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

package notification

import (
	"context"
	"github.com/apache/incubator-answer/internal/base/constant"
	"github.com/apache/incubator-answer/internal/base/translator"
	"github.com/apache/incubator-answer/internal/entity"
	"github.com/apache/incubator-answer/internal/repo/user"
	"github.com/apache/incubator-answer/internal/schema"
	"github.com/apache/incubator-answer/internal/service/export"
	"github.com/apache/incubator-answer/pkg/display"
	"github.com/apache/incubator-answer/pkg/token"
	"github.com/apache/incubator-answer/plugin"
	"github.com/jinzhu/copier"
	"github.com/segmentfault/pacman/i18n"
	"github.com/segmentfault/pacman/log"
	"strings"
	"time"
	"xorm.io/xorm"
)

type NewQuestionSubscriber struct {
	UserID             string                      `json:"user_id"`
	Channels           schema.NotificationChannels `json:"channels"`
	NotificationSource constant.NotificationSource `json:"notification_source"`
	ContentType        entity.QuestionType
	ScoreAction        entity.ScoreAction
}

func (ns *ExternalNotificationService) handleNewQuestionNotification(ctx context.Context,
	msg *schema.ExternalNotificationMsg) error {
	log.Debugf("try to send new question notification %+v", msg)
	subscribers, err := ns.getNewQuestionSubscribers(ctx, msg)
	if err != nil {
		return err
	}
	log.Debugf("get subscribers %d for question %s", len(subscribers), msg.NewQuestionTemplateRawData.QuestionID)
	rawData := msg.NewQuestionTemplateRawData
	contentTypeBit := entity.GetContentTypeBitFlag(rawData.ContentType)
	for _, subscriber := range subscribers {
		for _, channel := range subscriber.Channels {
			if !channel.Enable {
				continue
			}
			switch channel.Key {
			case constant.EmailChannel:
				if contentTypeBit&subscriber.ContentType == contentTypeBit && ((rawData.Score > 0 && subscriber.ScoreAction&entity.ScoreAction_IS == entity.ScoreAction_IS) ||
					(rawData.Score == 0 && subscriber.ScoreAction&entity.ScoreAction_NOT == entity.ScoreAction_NOT)) {
					ns.sendNewQuestionNotificationEmail(ctx, subscriber.UserID, false, &schema.NewQuestionTemplateRawData{
						QuestionTitle:   rawData.QuestionTitle,
						QuestionID:      rawData.QuestionID,
						Score:           rawData.Score,
						ContentType:     rawData.ContentType,
						DisplayName:     rawData.DisplayName,
						UnsubscribeCode: token.GenerateToken(),
						Tags:            rawData.Tags,
						TagSlugs:        rawData.TagSlugs,
						TagIDs:          rawData.TagIDs,
					})
				}
			}
		}
	}

	ns.syncNewQuestionNotificationToPlugin(ctx, msg)
	return nil
}

func (ns *ExternalNotificationService) addSubscribersFromSource(ctx context.Context, sourceType constant.NotificationSource, subscribersMapping map[string][]*NewQuestionSubscriber) error {
	notificationConfigs, err := ns.userNotificationConfigRepo.GetBySource(ctx, sourceType)
	if err != nil {
		log.Errorf("failed to get notification configs by source: %v", err)
		return err
	}
	for _, notificationConfig := range notificationConfigs {
		if ns.checkSendNewQuestionNotificationEmailLimit(ctx, notificationConfig.UserID) {
			continue
		}
		var contentType entity.QuestionType
		var scoreAction entity.ScoreAction
		switch sourceType {
		case constant.AllNewSubjectSource:
			contentType = entity.GetContentTypeBitFlag(entity.TypeQuestion) |
				entity.GetContentTypeBitFlag(entity.TypeAiPic) |
				entity.GetContentTypeBitFlag(entity.TypeBounty) |
				entity.GetContentTypeBitFlag(entity.TypeArticle) |
				entity.GetContentTypeBitFlag(entity.TypeAssetBun)
			scoreAction = entity.ScoreAction_ALL
			break
		case constant.AllEmailNewQuestionSource:
			contentType = entity.GetContentTypeBitFlag(entity.TypeQuestion)
			scoreAction = entity.ScoreAction_NOT
			break
		case constant.AllEmailNewScoreQuestionSource:
			contentType = entity.GetContentTypeBitFlag(entity.TypeQuestion)
			scoreAction = entity.ScoreAction_IS
			break
		case constant.AllEmailNewArticleSource:
			contentType = entity.GetContentTypeBitFlag(entity.TypeArticle)
			scoreAction = entity.ScoreAction_NOT
			break
		case constant.AllEmailNewScoreArticleSource:
			contentType = entity.GetContentTypeBitFlag(entity.TypeArticle)
			scoreAction = entity.ScoreAction_IS
			break
		case constant.AllEmailNewBountySource:
			contentType = entity.GetContentTypeBitFlag(entity.TypeBounty)
			scoreAction = entity.ScoreAction_ALL
			break
		case constant.AllEmailNewAssetbunSource:
			contentType = entity.GetContentTypeBitFlag(entity.TypeAssetBun)
			scoreAction = entity.ScoreAction_NOT
			break
		case constant.AllEmailNewScoreAssetbunSource:
			contentType = entity.GetContentTypeBitFlag(entity.TypeAssetBun)
			scoreAction = entity.ScoreAction_IS
			break
		}
		subscriber := &NewQuestionSubscriber{
			UserID:             notificationConfig.UserID,
			Channels:           schema.NewNotificationChannelsFormJson(notificationConfig.Channels),
			NotificationSource: sourceType,
			ContentType:        contentType,
			ScoreAction:        scoreAction,
		}
		subscribersMapping[notificationConfig.UserID] = append(subscribersMapping[notificationConfig.UserID], subscriber)
	}
	return nil
}

// 获取用户订阅者信息，并根据通知源分类
func (ns *ExternalNotificationService) addUserTagsSubscribers(ctx context.Context, followerIDs []string, source constant.NotificationSource, subscribersMapping map[string][]*NewQuestionSubscriber) error {
	userNotificationConfigs, err := ns.userNotificationConfigRepo.GetByUsersAndSource(ctx, followerIDs, source)
	if err != nil {
		log.Errorf("failed to get user notification configs for source %s: %v", source, err)
		return err
	}
	var contentType entity.QuestionType
	var scoreAction entity.ScoreAction
	switch source {
	case constant.AllNewSubjectForFollowingTagsSource:
		contentType = entity.GetContentTypeBitFlag(entity.TypeQuestion) |
			entity.GetContentTypeBitFlag(entity.TypeAiPic) |
			entity.GetContentTypeBitFlag(entity.TypeBounty) |
			entity.GetContentTypeBitFlag(entity.TypeArticle) |
			entity.GetContentTypeBitFlag(entity.TypeAssetBun)
		scoreAction = entity.ScoreAction_ALL
		break
	case constant.AllEmailNewSubjectForFollowingTagsSource:
		contentType = entity.GetContentTypeBitFlag(entity.TypeQuestion) |
			entity.GetContentTypeBitFlag(entity.TypeAiPic) |
			entity.GetContentTypeBitFlag(entity.TypeBounty) |
			entity.GetContentTypeBitFlag(entity.TypeArticle) |
			entity.GetContentTypeBitFlag(entity.TypeAssetBun)
		scoreAction = entity.ScoreAction_NOT
		break
	case constant.AllEmailNewSubjectScoreForFollowingTagsSource:
		contentType = entity.GetContentTypeBitFlag(entity.TypeQuestion) |
			entity.GetContentTypeBitFlag(entity.TypeAiPic) |
			entity.GetContentTypeBitFlag(entity.TypeBounty) |
			entity.GetContentTypeBitFlag(entity.TypeArticle) |
			entity.GetContentTypeBitFlag(entity.TypeAssetBun)
		scoreAction = entity.ScoreAction_IS
		break
	}
	for _, userNotificationConfig := range userNotificationConfigs {
		subscriber := &NewQuestionSubscriber{
			UserID:             userNotificationConfig.UserID,
			Channels:           schema.NewNotificationChannelsFormJson(userNotificationConfig.Channels),
			NotificationSource: source,
			ContentType:        contentType,
			ScoreAction:        scoreAction,
		}
		subscribersMapping[userNotificationConfig.UserID] = append(subscribersMapping[userNotificationConfig.UserID], subscriber)
	}

	return nil
}

func (ns *ExternalNotificationService) getNewQuestionSubscribers(ctx context.Context, msg *schema.ExternalNotificationMsg) (
	subscribers []*NewQuestionSubscriber, err error) {
	subscribersMapping := make(map[string][]*NewQuestionSubscriber)

	// 1. get all this new question's tags followers
	tagsFollowerIDs := make([]string, 0)
	followerMapping := make(map[string]bool)
	for _, tagID := range msg.NewQuestionTemplateRawData.TagIDs {
		userIDs, err := ns.followRepo.GetFollowUserIDs(ctx, tagID)
		if err != nil {
			log.Errorf("failed to get followers for tag %s: %v", tagID, err)
			continue
		}
		for _, userID := range userIDs {
			if _, ok := followerMapping[userID]; ok {
				continue
			}
			followerMapping[userID] = true
			tagsFollowerIDs = append(tagsFollowerIDs, userID)
		}
	}

	sources := []struct {
		sourceType constant.NotificationSource
	}{
		{constant.AllNewSubjectForFollowingTagsSource},
		{constant.AllEmailNewSubjectForFollowingTagsSource},
		{constant.AllEmailNewSubjectScoreForFollowingTagsSource},
	}
	for _, source := range sources {
		err = ns.addUserTagsSubscribers(ctx, tagsFollowerIDs, source.sourceType, subscribersMapping)
		if err != nil {
			return nil, err
		}
	}

	// 2. get all new question's followers
	sources = []struct {
		sourceType constant.NotificationSource
	}{
		{constant.AllNewSubjectSource},
		{constant.AllEmailNewQuestionSource},
		{constant.AllEmailNewScoreQuestionSource},
		{constant.AllEmailNewArticleSource},
		{constant.AllEmailNewScoreArticleSource},
		{constant.AllEmailNewBountySource},
		{constant.AllEmailNewAssetbunSource},
		{constant.AllEmailNewScoreAssetbunSource},
		// {constant.AllEmailNewSubjectForFollowingTagsSource},
		// {constant.AllEmailNewSubjectScoreForFollowingTagsSource},
	}

	for _, source := range sources {
		err = ns.addSubscribersFromSource(ctx, source.sourceType, subscribersMapping)
		if err != nil {
			return nil, err
		}
	}

	// 3. remove question owner
	delete(subscribersMapping, msg.NewQuestionTemplateRawData.QuestionAuthorUserID)
	for _, subscriberList := range subscribersMapping {
		subscribers = append(subscribers, subscriberList...)
	}
	log.Debugf("get %d subscribers from all new question config", len(subscribers))
	return subscribers, nil
}

func (ns *ExternalNotificationService) checkSendNewQuestionNotificationEmailLimit(ctx context.Context, userID string) bool {
	key := constant.NewQuestionNotificationLimitCacheKeyPrefix + userID
	old, exist, err := ns.data.Cache.GetInt64(ctx, key)
	if err != nil {
		log.Error(err)
		return false
	}
	if exist && old >= constant.NewQuestionNotificationLimitMax {
		log.Debugf("%s user reach new question notification limit", userID)
		return true
	}
	if !exist {
		err = ns.data.Cache.SetInt64(ctx, key, 1, constant.NewQuestionNotificationLimitCacheTime)
	} else {
		_, err = ns.data.Cache.Increase(ctx, key, 1)
	}
	if err != nil {
		log.Error(err)
	}
	return false
}

func SendNewQuestionNotificationEmail(ctx context.Context, DB *xorm.Engine, emailService *export.EmailService,
	userID string, isAudit bool, rawData *schema.NewQuestionTemplateRawData) {
	userInfo, exist, err := user.GetByUserID(ctx, DB, userID)
	if err != nil {
		log.Error(err)
		return
	}
	if !exist {
		log.Errorf("user %s not exist", userID)
		return
	}
	// If receiver has set language, use it to send email.
	if len(userInfo.Language) > 0 {
		ctx = context.WithValue(ctx, constant.AcceptLanguageFlag, i18n.Language(userInfo.Language))
	}
	title, body, err := emailService.NewQuestionTemplate(ctx, rawData)
	if err != nil {
		log.Error(err)
		return
	}

	codeContent := &schema.EmailCodeContent{
		SourceType: schema.UnsubscribeSourceType,
		Email:      userInfo.EMail,
		UserID:     userID,
		NotificationSources: []constant.NotificationSource{
			constant.AllNewSubjectSource,
			constant.AllNewSubjectForFollowingTagsSource,
			constant.AllEmailNewQuestionSource,
			constant.AllEmailNewScoreQuestionSource,
			constant.AllEmailNewArticleSource,
			constant.AllEmailNewScoreArticleSource,
			constant.AllEmailNewBountySource,
			constant.AllEmailNewAssetbunSource,
			constant.AllEmailNewScoreAssetbunSource,
			constant.AllEmailNewSubjectForFollowingTagsSource,
			constant.AllEmailNewSubjectScoreForFollowingTagsSource,
		},
	}
	if isAudit {
		title += "[UNAUDITED]"
	}
	emailService.SendAndSaveCodeWithTime(
		ctx, userInfo.EMail, title, body, rawData.UnsubscribeCode, codeContent.ToJSONString(), 1*24*time.Hour)
}

func (ns *ExternalNotificationService) sendNewQuestionNotificationEmail(ctx context.Context,
	userID string, isAudit bool, rawData *schema.NewQuestionTemplateRawData) {
	SendNewQuestionNotificationEmail(ctx, ns.data.DB, ns.emailService, userID, isAudit, rawData)
}

func (ns *ExternalNotificationService) syncNewQuestionNotificationToPlugin(ctx context.Context,
	msg *schema.ExternalNotificationMsg) {
	_ = plugin.CallNotification(func(fn plugin.Notification) error {
		// 1. get all this new question's tags followers
		subscribersMapping := make(map[string]plugin.NotificationType)
		for _, tagID := range msg.NewQuestionTemplateRawData.TagIDs {
			userIDs, err := ns.followRepo.GetFollowUserIDs(ctx, tagID)
			if err != nil {
				log.Error(err)
				continue
			}
			for _, userID := range userIDs {
				subscribersMapping[userID] = plugin.NotificationNewQuestionFollowedTag
			}
		}

		// 2. get all new question's followers
		questionSubscribers := fn.GetNewQuestionSubscribers()
		for _, subscriber := range questionSubscribers {
			subscribersMapping[subscriber] = plugin.NotificationNewQuestion
		}

		// 3. remove question owner
		delete(subscribersMapping, msg.NewQuestionTemplateRawData.QuestionAuthorUserID)

		pluginNotificationMsg := ns.newPluginQuestionNotification(ctx, msg)

		// 4. send notification
		for subscriberUserID, notificationType := range subscribersMapping {
			newMsg := plugin.NotificationMessage{}
			_ = copier.Copy(&newMsg, pluginNotificationMsg)
			newMsg.ReceiverUserID = subscriberUserID
			newMsg.Type = notificationType

			if len(subscriberUserID) > 0 {
				userInfo, _, _ := ns.userRepo.GetByUserID(ctx, subscriberUserID)
				if userInfo != nil && len(userInfo.Language) > 0 && userInfo.Language != translator.DefaultLangOption {
					newMsg.ReceiverLang = userInfo.Language
				}
			}

			userInfo, exist, err := ns.userExternalLoginRepo.GetByUserID(ctx, fn.Info().SlugName, subscriberUserID)
			if err != nil {
				log.Errorf("get user external login info failed: %v", err)
				return nil
			}
			if exist {
				newMsg.ReceiverExternalID = userInfo.ExternalID
			}
			fn.Notify(newMsg)
		}
		return nil
	})
}

func (ns *ExternalNotificationService) newPluginQuestionNotification(
	ctx context.Context, msg *schema.ExternalNotificationMsg) (raw *plugin.NotificationMessage) {
	raw = &plugin.NotificationMessage{
		ReceiverUserID: msg.ReceiverUserID,
		ReceiverLang:   msg.ReceiverLang,
		QuestionTitle:  msg.NewQuestionTemplateRawData.QuestionTitle,
		QuestionTags:   strings.Join(msg.NewQuestionTemplateRawData.Tags, ","),
	}
	siteInfo, err := ns.siteInfoService.GetSiteGeneral(ctx)
	if err != nil {
		return raw
	}
	seoInfo, err := ns.siteInfoService.GetSiteSeo(ctx)
	if err != nil {
		return raw
	}
	interfaceInfo, err := ns.siteInfoService.GetSiteInterface(ctx)
	if err != nil {
		return raw
	}
	if len(raw.ReceiverLang) == 0 || raw.ReceiverLang == translator.DefaultLangOption {
		raw.ReceiverLang = interfaceInfo.Language
	}
	raw.QuestionUrl = display.QuestionURL(
		seoInfo.Permalink, siteInfo.SiteUrl,
		msg.NewQuestionTemplateRawData.QuestionID, msg.NewQuestionTemplateRawData.QuestionTitle)
	return raw
}
