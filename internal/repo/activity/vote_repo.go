/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package activity

import (
	"context"
	"fmt"
	"github.com/apache/incubator-answer/internal/service/content"
	"github.com/segmentfault/pacman/log"
	"math"

	"github.com/apache/incubator-answer/internal/base/constant"
	"github.com/apache/incubator-answer/internal/base/pager"
	"github.com/apache/incubator-answer/internal/service/notice_queue"
	"github.com/apache/incubator-answer/internal/service/rank"
	"github.com/apache/incubator-answer/pkg/obj"

	"xorm.io/builder"

	"github.com/apache/incubator-answer/internal/base/data"
	"github.com/apache/incubator-answer/internal/base/reason"
	"github.com/apache/incubator-answer/internal/entity"
	"github.com/apache/incubator-answer/internal/schema"
	"github.com/apache/incubator-answer/internal/service/activity_common"
	"github.com/segmentfault/pacman/errors"
	"xorm.io/xorm"
)

// VoteRepo activity repository
type VoteRepo struct {
	data                     *data.Data
	activityRepo             activity_common.ActivityRepo
	userRankRepo             rank.UserRankRepo
	notificationQueueService notice_queue.NotificationQueueService
}

// NewVoteRepo new repository
func NewVoteRepo(
	data *data.Data,
	activityRepo activity_common.ActivityRepo,
	userRankRepo rank.UserRankRepo,
	notificationQueueService notice_queue.NotificationQueueService,
) content.VoteRepo {
	return &VoteRepo{
		data:                     data,
		activityRepo:             activityRepo,
		userRankRepo:             userRankRepo,
		notificationQueueService: notificationQueueService,
	}
}

func (vr *VoteRepo) Vote(ctx context.Context, op *schema.VoteOperationInfo) (err error) {
	noNeedToVote, err := vr.votePreCheck(ctx, op)
	if err != nil {
		return err
	}
	if noNeedToVote {
		return nil
	}

	sendInboxNotification := false
	maxDailyRank, err := vr.userRankRepo.GetMaxDailyRank(ctx)
	if err != nil {
		return err
	}
	var userIDs []string
	for _, activity := range op.Activities {
		userIDs = append(userIDs, activity.ActivityUserID)
	}

	_, err = vr.data.DB.Transaction(func(session *xorm.Session) (result any, err error) {
		session = session.Context(ctx)

		userInfoMapping, err := vr.acquireUserInfo(session, userIDs)
		if err != nil {
			return nil, err
		}

		err = vr.setActivityRankToZeroIfUserReachLimit(ctx, session, op, userInfoMapping, maxDailyRank)
		if err != nil {
			return nil, err
		}

		sendInboxNotification, err = vr.saveActivitiesAvailable(session, &op.RankOperationInfo)
		if err != nil {
			return nil, err
		}

		err = vr.changeUserRank(ctx, session, op, userInfoMapping)
		if err != nil {
			return nil, err
		}
		return nil, nil
	})
	if err != nil {
		return err
	}
	var rank float32
	for _, activity := range op.Activities {
		if activity.Rank == 0 {
			continue
		}
		rank = activity.Rank
		vr.sendAchievementNotification(ctx, activity.ActivityUserID, op.ObjectCreatorUserID, op.ObjectID)
	}
	if sendInboxNotification && rank != 0 {
		vr.sendVoteInboxNotification(ctx, op.OperatingUserID, op.ObjectCreatorUserID, op.ObjectID, float32(math.Abs(float64(rank))), op.VoteUp, false)
	}
	return nil
}

func (vr *VoteRepo) CancelVote(ctx context.Context, op *schema.VoteOperationInfo) (err error) {
	// Pre-Check
	// 1. check if the activity exist
	// 2. check if the activity is not cancelled
	// 3. if all activities are cancelled, return directly
	activities, err := vr.getExistActivity(ctx, op)
	if err != nil {
		return err
	}
	var userIDs []string
	for _, activity := range activities {
		if activity.Cancelled == entity.ActivityCancelled {
			continue
		}
		userIDs = append(userIDs, activity.UserID)
	}
	if len(userIDs) == 0 {
		return nil
	}

	_, err = vr.data.DB.Transaction(func(session *xorm.Session) (result any, err error) {
		session = session.Context(ctx)

		userInfoMapping, err := vr.acquireUserInfo(session, userIDs)
		if err != nil {
			return nil, err
		}

		err = vr.cancelActivities(session, activities)
		if err != nil {
			return nil, err
		}

		err = vr.rollbackUserRank(ctx, session, activities, userInfoMapping)
		if err != nil {
			return nil, err
		}
		return nil, nil
	})
	if err != nil {
		return err
	}
	var rank float32
	for _, activity := range activities {
		if activity.Rank == 0 {
			continue
		}
		rank = activity.Rank
		vr.sendAchievementNotification(ctx, activity.UserID, op.ObjectCreatorUserID, op.ObjectID)
	}
	if rank != 0 {
		vr.sendVoteInboxNotification(ctx, op.OperatingUserID, op.ObjectCreatorUserID, op.ObjectID, float32(math.Abs(float64(rank))), op.VoteUp, true)
	}
	return nil
}

func (vr *VoteRepo) GetAndSaveVoteResult(ctx context.Context, objectID, objectType string) (
	up, down int64, err error) {
	up = vr.countVoteUp(ctx, objectID, objectType)
	down = vr.countVoteDown(ctx, objectID, objectType)
	err = vr.updateVotes(ctx, objectID, objectType, int(up-down))
	return
}

func (vr *VoteRepo) ListUserVotes(ctx context.Context, userID string,
	page int, pageSize int, activityTypes []int) (voteList []*entity.Activity, total int64, err error) {
	session := vr.data.DB.Context(ctx)
	cond := builder.
		And(
			builder.Eq{"user_id": userID},
			builder.Eq{"cancelled": 0},
			builder.In("activity_type", activityTypes),
		)

	session.Where(cond).Desc("updated_at")

	total, err = pager.Help(page, pageSize, &voteList, &entity.Activity{}, session)
	if err != nil {
		err = errors.InternalServer(reason.DatabaseError).WithError(err).WithStack()
	}
	return
}

func (vr *VoteRepo) votePreCheck(ctx context.Context, op *schema.VoteOperationInfo) (noNeedToVote bool, err error) {
	activities, err := vr.getExistActivity(ctx, op)
	if err != nil {
		return false, err
	}
	done := 0
	for _, activity := range activities {
		if activity.Cancelled == entity.ActivityAvailable {
			done++
		}
	}
	return done == len(op.Activities), nil
}

func (vr *VoteRepo) acquireUserInfo(session *xorm.Session, userIDs []string) (map[string]*entity.User, error) {
	us := make([]*entity.User, 0)
	err := session.In("id", userIDs).ForUpdate().Find(&us)
	if err != nil {
		log.Error(err)
		return nil, err
	}

	users := make(map[string]*entity.User, 0)
	for _, u := range us {
		users[u.ID] = u
	}
	return users, nil
}

func (vr *VoteRepo) setActivityRankToZeroIfUserReachLimit(ctx context.Context, session *xorm.Session,
	op *schema.VoteOperationInfo, userInfoMapping map[string]*entity.User, maxDailyRank int) (err error) {
	// check if user reach daily rank limit
	for _, activity := range op.Activities {
		if activity.Rank > 0 {
			// check if reach max daily rank
			reach, err := vr.userRankRepo.CheckReachLimit(ctx, session, activity.ActivityUserID, maxDailyRank)
			if err != nil {
				log.Error(err)
				return err
			}
			if reach {
				activity.Rank = 0
				continue
			}
		} else {
			// If user rank is lower than 1 after this action, then user rank will be set to 1 only.
			userCurrentScore := userInfoMapping[activity.ActivityUserID].Rank
			if float32(userCurrentScore)+activity.Rank < 1 {
				activity.Rank = float32(1 - userCurrentScore)
			}
		}
	}
	return nil
}

func (vr *VoteRepo) changeUserRank(ctx context.Context, session *xorm.Session,
	op *schema.VoteOperationInfo,
	userInfoMapping map[string]*entity.User) (err error) {
	for _, activity := range op.Activities {
		if activity.Rank == 0 {
			continue
		}
		user := userInfoMapping[activity.ActivityUserID]
		if user == nil {
			continue
		}
		if err = vr.userRankRepo.ChangeUserFloatRank(ctx, session,
			activity.ActivityUserID, activity.Rank); err != nil {
			log.Error(err)
			return err
		}
	}
	return nil
}

func (vr *VoteRepo) rollbackUserRank(ctx context.Context, session *xorm.Session,
	activities []*entity.Activity,
	userInfoMapping map[string]*entity.User) (err error) {
	for _, activity := range activities {
		if activity.Rank == 0 {
			continue
		}
		user := userInfoMapping[activity.UserID]
		if user == nil {
			continue
		}
		if err = vr.userRankRepo.ChangeUserFloatRank(ctx, session,
			activity.UserID, -activity.Rank); err != nil {
			log.Error(err)
			return err
		}
	}
	return nil
}

// saveActivitiesAvailable save activities
// If activity not exist it will be created or else will be updated
// If this activity is already exist, set activity rank to 0
// So after this function, the activity rank will be correct for update user rank
func (vr *VoteRepo) saveActivitiesAvailable(session *xorm.Session, op *schema.RankOperationInfo) (newAct bool, err error) {
	return SaveActivitiesAvailable(session, op)
}

// cancelActivities cancel activities
// If this activity is already cancelled, set activity rank to 0
// So after this function, the activity rank will be correct for update user rank
func (vr *VoteRepo) cancelActivities(session *xorm.Session, activities []*entity.Activity) (err error) {
	return CancelActivities(session, activities)
}

func (vr *VoteRepo) getExistActivity(ctx context.Context, op *schema.VoteOperationInfo) ([]*entity.Activity, error) {
	return GetExistActivity(ctx, vr.data.DB, &op.RankOperationInfo)
}

func (vr *VoteRepo) countVoteUp(ctx context.Context, objectID, objectType string) (count int64) {
	count, err := vr.countVote(ctx, objectID, objectType, constant.ActVoteUp)
	if err != nil {
		log.Errorf("get vote up count error: %v", err)
	}
	return count
}

func (vr *VoteRepo) countVoteDown(ctx context.Context, objectID, objectType string) (count int64) {
	count, err := vr.countVote(ctx, objectID, objectType, constant.ActVoteDown)
	if err != nil {
		log.Errorf("get vote down count error: %v", err)
	}
	return count
}

func (vr *VoteRepo) countVote(ctx context.Context, objectID, objectType, action string) (count int64, err error) {
	activity := &entity.Activity{}
	activityType, _ := vr.activityRepo.GetActivityTypeByObjectType(ctx, objectType, action)
	count, err = vr.data.DB.Context(ctx).Where(builder.Eq{"object_id": objectID}).
		And(builder.Eq{"activity_type": activityType}).
		And(builder.Eq{"cancelled": 0}).
		Count(activity)
	if err != nil {
		err = errors.InternalServer(reason.DatabaseError).WithError(err).WithStack()
	}
	return count, err
}

func (vr *VoteRepo) updateVotes(ctx context.Context, objectID, objectType string, voteCount int) (err error) {
	session := vr.data.DB.Context(ctx)
	switch objectType {
	case constant.QuestionObjectType:
		_, err = session.ID(objectID).Cols("vote_count").Update(&entity.Question{VoteCount: voteCount})
	case constant.AnswerObjectType:
		_, err = session.ID(objectID).Cols("vote_count").Update(&entity.Answer{VoteCount: voteCount})
	case constant.CommentObjectType:
		_, err = session.ID(objectID).Cols("vote_count").Update(&entity.Comment{VoteCount: voteCount})
	}
	if err != nil {
		log.Error(err)
	}
	return
}

func (vr *VoteRepo) sendAchievementNotification(ctx context.Context, activityUserID, objectUserID, objectID string) {
	objectType, err := obj.GetObjectTypeStrByObjectID(objectID)
	if err != nil {
		return
	}

	msg := &schema.NotificationMsg{
		ReceiverUserID: activityUserID,
		TriggerUserID:  objectUserID,
		Type:           schema.NotificationTypeAchievement,
		ObjectID:       objectID,
		ObjectType:     objectType,
	}
	vr.notificationQueueService.Send(ctx, msg)
}

func (vr *VoteRepo) sendVoteInboxNotification(ctx context.Context, triggerUserID, receiverUserID, objectID string, rank float32, upvote, isCancel bool) {
	if triggerUserID == receiverUserID {
		return
	}
	objectType, _ := obj.GetObjectTypeStrByObjectID(objectID)

	msg := &schema.NotificationMsg{
		TriggerUserID:  triggerUserID,
		ReceiverUserID: receiverUserID,
		Type:           schema.NotificationTypeInbox,
		ObjectID:       objectID,
		ObjectType:     objectType,
		ExtraInfo: map[string]string{
			"Rank": fmt.Sprintf("%.2f", rank),
		},
	}
	if objectType == constant.QuestionObjectType {
		if upvote {
			msg.NotificationAction = constant.NotificationUpVotedTheQuestion
			if isCancel {
				msg.NotificationAction = constant.NotificationUpVotedCancelTheQuestion
			}
		} else {
			msg.NotificationAction = constant.NotificationDownVotedTheQuestion
			if isCancel {
				msg.NotificationAction = constant.NotificationDownVotedCancelTheQuestion
			}
		}
	}
	if objectType == constant.AnswerObjectType {
		if upvote {
			msg.NotificationAction = constant.NotificationUpVotedTheAnswer
			if isCancel {
				msg.NotificationAction = constant.NotificationUpVotedCancelTheAnswer
			}
		} else {
			msg.NotificationAction = constant.NotificationDownVotedTheAnswer
			if isCancel {
				msg.NotificationAction = constant.NotificationDownVotedCancelTheAnswer
			}
		}
	}
	if objectType == constant.CommentObjectType {
		if upvote {
			msg.NotificationAction = constant.NotificationUpVotedTheComment
			if isCancel {
				msg.NotificationAction = constant.NotificationUpVotedCancelTheComment
			}
		}
	}
	if len(msg.NotificationAction) > 0 {
		vr.notificationQueueService.Send(ctx, msg)
	}
}
