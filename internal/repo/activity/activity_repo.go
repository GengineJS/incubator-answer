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
	"github.com/apache/incubator-answer/internal/schema"
	"github.com/apache/incubator-answer/internal/service/object_info"
	"github.com/apache/incubator-answer/pkg/converter"
	"time"
	"xorm.io/builder"
	"xorm.io/xorm"

	"github.com/apache/incubator-answer/internal/base/data"
	"github.com/apache/incubator-answer/internal/base/reason"
	"github.com/apache/incubator-answer/internal/entity"
	"github.com/apache/incubator-answer/internal/service/activity"
	"github.com/apache/incubator-answer/internal/service/activity_type"
	"github.com/apache/incubator-answer/internal/service/config"
	"github.com/segmentfault/pacman/errors"
	"github.com/segmentfault/pacman/log"
)

// activityRepo activity repository
type activityRepo struct {
	data          *data.Data
	configService *config.ConfigService
	objService    *object_info.ObjService
}

type RankActivityRepo = activityRepo

// NewActivityRepo new repository
func NewActivityRepo(
	data *data.Data,
	configService *config.ConfigService,
	objService *object_info.ObjService,
) activity.ActivityRepo {
	return &activityRepo{
		data:          data,
		configService: configService,
		objService:    objService,
	}
}

func (ar *activityRepo) GetObjectAllActivity(ctx context.Context, objectID string, showVote bool) (
	activityList []*entity.Activity, err error) {
	activityList = make([]*entity.Activity, 0)
	session := ar.data.DB.Context(ctx).Desc("id")

	if !showVote {
		activityTypeNotShown := ar.getAllActivityType(ctx)
		session.NotIn("activity_type", activityTypeNotShown)
	}
	err = session.Find(&activityList, &entity.Activity{OriginalObjectID: objectID})
	if err != nil {
		return nil, errors.InternalServer(reason.DatabaseError).WithError(err).WithStack()
	}
	return activityList, nil
}

func (ar *activityRepo) getAllActivityType(ctx context.Context) (activityTypes []int) {
	var activityTypeNotShown []int
	for _, key := range activity_type.VoteActivityTypeList {
		id, err := ar.configService.GetIDByKey(ctx, key)
		if err != nil {
			log.Errorf("get config id by key [%s] error: %v", key, err)
		} else {
			activityTypeNotShown = append(activityTypeNotShown, id)
		}
	}
	return activityTypeNotShown
}

func GetExistActivity(ctx context.Context, db *xorm.Engine, op *schema.RankOperationInfo) ([]*entity.Activity, error) {
	var activities []*entity.Activity
	for _, action := range op.Activities {
		t := &entity.Activity{}
		exist, err := db.Context(ctx).
			Where(builder.Eq{"user_id": action.ActivityUserID}).
			And(builder.Eq{"trigger_user_id": action.TriggerUserID}).
			And(builder.Eq{"activity_type": action.ActivityType}).
			And(builder.Eq{"object_id": op.ObjectID}).
			Get(t)
		if err != nil {
			return nil, errors.InternalServer(reason.DatabaseError).WithError(err).WithStack()
		}
		if exist {
			activities = append(activities, t)
		}
	}
	return activities, nil
}

// CancelActivities cancel activities
// If this activity is already cancelled, set activity rank to 0
// So after this function, the activity rank will be correct for update user rank
func CancelActivities(session *xorm.Session, activities []*entity.Activity) (err error) {
	for _, activity := range activities {
		t := &entity.Activity{}
		exist, err := session.ID(activity.ID).Get(t)
		if err != nil {
			log.Error(err)
			return err
		}
		if !exist {
			log.Error(fmt.Errorf("%s activity not exist", activity.ID))
			return fmt.Errorf("%s activity not exist", activity.ID)
		}
		//  If this activity is already cancelled, set activity rank to 0
		if t.Cancelled == entity.ActivityCancelled {
			activity.Rank = 0
		}
		if _, err = session.ID(activity.ID).Cols("cancelled", "cancelled_at").
			Update(&entity.Activity{
				Cancelled:   entity.ActivityCancelled,
				CancelledAt: time.Now(),
			}); err != nil {
			log.Error(err)
			return err
		}
	}
	return nil
}

func (ar *activityRepo) CreateRankOperationInfo(ctx context.Context, userID, objID string) *schema.RankOperationInfo {
	objectInfo, _ := ar.objService.GetInfo(ctx, objID)
	// warp rank operation
	rankOperationInfo := &schema.RankOperationInfo{
		ObjectID:            objectInfo.ObjectID,
		ObjectType:          objectInfo.ObjectType,
		ObjectCreatorUserID: objectInfo.ObjectCreatorUserID,
		OperatingUserID:     userID,
	}

	// rankOperationInfo.Activities = vs.getActivities(ctx, rankOperationInfo)
	return rankOperationInfo
}

func BeginSaveActivity(engine *xorm.Engine) (session *xorm.Session) {
	// 创建一个新的session
	session = engine.NewSession()
	defer session.Close()

	// 开始事务
	if err := session.Begin(); err != nil {
		return nil
	}
	return session
}

func EndSaveActivity(session *xorm.Session) {
	if err := session.Commit(); err != nil {
		session.Rollback()
	}
}

// SaveActivitiesAvailable save activities
// If activity not exist it will be created or else will be updated
// If this activity is already exist, set activity rank to 0
// So after this function, the activity rank will be correct for update user rank
func SaveActivitiesAvailable(session *xorm.Session, op *schema.RankOperationInfo) (newAct bool, err error) {
	for _, activity := range op.Activities {
		existsActivity := &entity.Activity{}
		exist, err := session.
			Where(builder.Eq{"object_id": op.ObjectID}).
			And(builder.Eq{"user_id": activity.ActivityUserID}).
			And(builder.Eq{"trigger_user_id": activity.TriggerUserID}).
			And(builder.Eq{"activity_type": activity.ActivityType}).
			Get(existsActivity)
		if err != nil {
			return false, err
		}
		if exist && existsActivity.Cancelled == entity.ActivityAvailable {
			activity.Rank = 0
			continue
		}
		hasRank := 0
		if activity.Rank != 0 {
			hasRank = 1
		}
		if exist {
			bean := &entity.Activity{
				Cancelled: entity.ActivityAvailable,
				Rank:      activity.Rank,
				HasRank:   hasRank,
			}
			session.Where("id = ?", existsActivity.ID)
			if _, err = session.Cols("`cancelled`", "`rank`", "`has_rank`").
				Update(bean); err != nil {
				return false, err
			}
			// 虽然存在，但是重新点赞也得发送通知
			newAct = true
		} else {
			insertActivity := entity.Activity{
				ObjectID:         op.ObjectID,
				OriginalObjectID: op.ObjectID,
				UserID:           activity.ActivityUserID,
				TriggerUserID:    converter.StringToInt64(activity.TriggerUserID),
				ActivityType:     activity.ActivityType,
				Rank:             activity.Rank,
				HasRank:          hasRank,
				Cancelled:        entity.ActivityAvailable,
			}
			_, err = session.Insert(&insertActivity)
			if err != nil {
				return false, err
			}
			newAct = true
		}
	}
	return newAct, nil
}
