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

package schema

import (
	"encoding/json"

	"github.com/apache/incubator-answer/internal/base/constant"
	"github.com/apache/incubator-answer/internal/entity"
)

type NotificationChannelConfig struct {
	Key    constant.NotificationChannelKey `json:"key"`
	Enable bool                            `json:"enable"`
}

type NotificationChannels []*NotificationChannelConfig

func NewNotificationChannelsFormJson(jsonStr string) NotificationChannels {
	var list NotificationChannels
	_ = json.Unmarshal([]byte(jsonStr), &list)
	return list
}

func NewNotificationChannelConfigFormJson(jsonStr string) NotificationChannelConfig {
	var list NotificationChannels
	_ = json.Unmarshal([]byte(jsonStr), &list)
	if len(list) > 0 {
		return *list[0]
	}
	return NotificationChannelConfig{}
}

func (n *NotificationChannels) ToJsonString() string {
	data, _ := json.Marshal(n)
	return string(data)
}

type NotificationConfig struct {
	Inbox                                   NotificationChannelConfig `json:"inbox"`
	EmailInbox                              NotificationChannelConfig `json:"email_inbox"`
	AllNewQuestion                          NotificationChannelConfig `json:"all_new_subject"`
	AllEmailNewQuestion                     NotificationChannelConfig `json:"all_email_new_question"`
	AllEmailNewScoreQuestion                NotificationChannelConfig `json:"all_email_new_score_question"`
	AllNewSubjectForFollowingTags           NotificationChannelConfig `json:"all_new_subject_for_following_tags"`
	AllEmailNewArticle                      NotificationChannelConfig `json:"all_email_new_article"`
	AllEmailNewScoreArticle                 NotificationChannelConfig `json:"all_email_new_score_article"`
	AllEmailNewBounty                       NotificationChannelConfig `json:"all_email_new_bounty"`
	AllEmailNewAssetbun                     NotificationChannelConfig `json:"all_email_new_assetbun"`
	AllEmailNewScoreAssetbun                NotificationChannelConfig `json:"all_email_new_score_assetbun"`
	AllEmailNewSubjectForFollowingTags      NotificationChannelConfig `json:"all_email_new_subject_for_following_tags"`
	AllEmailNewSubjectScoreForFollowingTags NotificationChannelConfig `json:"all_email_new_subject_score_for_following_tags"`
}

func NewNotificationConfig(configs []*entity.UserNotificationConfig) NotificationConfig {
	nc := NotificationConfig{}
	for _, item := range configs {
		switch item.Source {
		case string(constant.InboxSource):
			nc.Inbox = NewNotificationChannelConfigFormJson(item.Channels)
		case string(constant.AllNewSubjectSource):
			nc.AllNewQuestion = NewNotificationChannelConfigFormJson(item.Channels)
		case string(constant.AllNewSubjectForFollowingTagsSource):
			nc.AllNewSubjectForFollowingTags = NewNotificationChannelConfigFormJson(item.Channels)
		case string(constant.AllEmailNewQuestionSource):
			nc.AllEmailNewQuestion = NewNotificationChannelConfigFormJson(item.Channels)
		case string(constant.AllEmailNewScoreQuestionSource):
			nc.AllEmailNewScoreQuestion = NewNotificationChannelConfigFormJson(item.Channels)
		case string(constant.AllEmailNewArticleSource):
			nc.AllEmailNewArticle = NewNotificationChannelConfigFormJson(item.Channels)
		case string(constant.AllEmailNewScoreArticleSource):
			nc.AllEmailNewScoreArticle = NewNotificationChannelConfigFormJson(item.Channels)
		case string(constant.AllEmailNewBountySource):
			nc.AllEmailNewBounty = NewNotificationChannelConfigFormJson(item.Channels)
		case string(constant.AllEmailNewAssetbunSource):
			nc.AllEmailNewAssetbun = NewNotificationChannelConfigFormJson(item.Channels)
		case string(constant.AllEmailNewScoreAssetbunSource):
			nc.AllEmailNewScoreAssetbun = NewNotificationChannelConfigFormJson(item.Channels)
		case string(constant.AllEmailNewSubjectForFollowingTagsSource):
			nc.AllEmailNewSubjectForFollowingTags = NewNotificationChannelConfigFormJson(item.Channels)
		case string(constant.AllEmailNewSubjectScoreForFollowingTagsSource):
			nc.AllEmailNewSubjectScoreForFollowingTags = NewNotificationChannelConfigFormJson(item.Channels)
		}
	}
	return nc
}

func (n *NotificationConfig) Format() {
	if n.Inbox.Key == "" {
		n.Inbox.Key = constant.EmailChannel
		n.Inbox.Enable = false
	}
	if n.EmailInbox.Key == "" {
		n.EmailInbox.Key = constant.EmailChannel
		n.EmailInbox.Enable = false
	}
	if n.AllNewQuestion.Key == "" {
		n.AllNewQuestion.Key = constant.EmailChannel
		n.AllNewQuestion.Enable = false
	}
	if n.AllNewSubjectForFollowingTags.Key == "" {
		n.AllNewSubjectForFollowingTags.Key = constant.EmailChannel
		n.AllNewSubjectForFollowingTags.Enable = false
	}
	if n.AllEmailNewQuestion.Key == "" {
		n.AllEmailNewQuestion.Key = constant.EmailChannel
		n.AllEmailNewQuestion.Enable = false
	}
	if n.AllEmailNewScoreQuestion.Key == "" {
		n.AllEmailNewScoreQuestion.Key = constant.EmailChannel
		n.AllEmailNewScoreQuestion.Enable = false
	}
	if n.AllEmailNewArticle.Key == "" {
		n.AllEmailNewArticle.Key = constant.EmailChannel
		n.AllEmailNewArticle.Enable = false
	}
	if n.AllEmailNewScoreArticle.Key == "" {
		n.AllEmailNewScoreArticle.Key = constant.EmailChannel
		n.AllEmailNewScoreArticle.Enable = false
	}
	if n.AllEmailNewBounty.Key == "" {
		n.AllEmailNewBounty.Key = constant.EmailChannel
		n.AllEmailNewBounty.Enable = false
	}
	if n.AllEmailNewAssetbun.Key == "" {
		n.AllEmailNewAssetbun.Key = constant.EmailChannel
		n.AllEmailNewAssetbun.Enable = false
	}
	if n.AllEmailNewScoreAssetbun.Key == "" {
		n.AllEmailNewScoreAssetbun.Key = constant.EmailChannel
		n.AllEmailNewScoreAssetbun.Enable = false
	}
	if n.AllEmailNewSubjectForFollowingTags.Key == "" {
		n.AllEmailNewSubjectForFollowingTags.Key = constant.EmailChannel
		n.AllEmailNewSubjectForFollowingTags.Enable = false
	}
	if n.AllEmailNewSubjectScoreForFollowingTags.Key == "" {
		n.AllEmailNewSubjectScoreForFollowingTags.Key = constant.EmailChannel
		n.AllEmailNewSubjectScoreForFollowingTags.Enable = false
	}
}

// UpdateUserNotificationConfigReq update user notification config request
type UpdateUserNotificationConfigReq struct {
	NotificationConfig
	UserID string `json:"-"`
}

// GetUserNotificationConfigResp get user notification config response
type GetUserNotificationConfigResp struct {
	NotificationConfig
}
