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

package constant

import "github.com/apache/incubator-answer/internal/base/reason"

type Privilege struct {
	Key   string  `json:"key"`
	Label string  `json:"label"`
	Title string  `json:"title"`
	Value float32 `validate:"gte=0" json:"value"`
}

const (
	RankQuestionAddKey               = "rank.question.add"
	RankQuestionEditKey              = "rank.question.edit"
	RankQuestionDeleteKey            = "rank.question.delete"
	RankQuestionVoteUpKey            = "rank.question.vote_up"
	RankQuestionVoteDownKey          = "rank.question.vote_down"
	RankAnswerAddKey                 = "rank.answer.add"
	RankAnswerEditKey                = "rank.answer.edit"
	RankAnswerDeleteKey              = "rank.answer.delete"
	RankAnswerAcceptKey              = "rank.answer.accept"
	RankAnswerVoteUpKey              = "rank.answer.vote_up"
	RankAnswerVoteDownKey            = "rank.answer.vote_down"
	RankInviteSomeoneToAnswerKey     = "rank.answer.invite_someone_to_answer"
	RankCommentAddKey                = "rank.comment.add"
	RankCommentEditKey               = "rank.comment.edit"
	RankCommentDeleteKey             = "rank.comment.delete"
	RankReportAddKey                 = "rank.report.add"
	RankTagAddKey                    = "rank.tag.add"
	RankTagEditKey                   = "rank.tag.edit"
	RankTagDeleteKey                 = "rank.tag.delete"
	RankTagSynonymKey                = "rank.tag.synonym"
	RankLinkUrlLimitKey              = "rank.link.url_limit"
	RankVoteDetailKey                = "rank.vote.detail"
	RankCommentVoteUpKey             = "rank.comment.vote_up"
	RankCommentVoteDownKey           = "rank.comment.vote_down"
	RankQuestionEditWithoutReviewKey = "rank.question.edit_without_review"
	RankAnswerEditWithoutReviewKey   = "rank.answer.edit_without_review"
	RankTagEditWithoutReviewKey      = "rank.tag.edit_without_review"
	RankAnswerAuditKey               = "rank.answer.audit"
	RankQuestionAuditKey             = "rank.question.audit"
	RankTagAuditKey                  = "rank.tag.audit"
	RankQuestionCloseKey             = "rank.question.close"
	RankQuestionReopenKey            = "rank.question.reopen"
	RankTagUseReservedTagKey         = "rank.tag.use_reserved_tag"
	// 发布主题会得到的贡献值
	RankSubjectContributeKey = "rank.subject.contribute"
	// 发布积分主题会得到的贡献值
	RankSubjectScoreContributeKey = "rank.subject.score_contribute"
	// 当主题回复被采纳时，主题的作者能获取的贡献值
	RankSubjectAcceptKey = "rank.subject.accept"
	// 当主题AI回复被采纳时，主题的作者能获取的贡献值
	RankSubjectAIAcceptKey = "rank.subject.ai_accept"
	// 当积分主题回复被采纳时，主题的作者能获取的贡献值
	RankSubjectScoreAcceptKey = "rank.subject.score_accept"
	// 当积分主题AI回复被采纳时，主题的作者能获取的贡献值
	RankSubjectScoreAIAcceptKey = "rank.subject.score_ai_accept"
	// 普通主题被采纳后可以得到的贡献值
	RankSubjectAcceptedKey        = "rank.subject.accepted"
	RankSubjectAIAcceptedKey      = "rank.subject.ai_accepted"
	RankSubjectScoreAcceptedKey   = "rank.subject.score_accepted"
	RankSubjectAIScoreAcceptedKey = "rank.subject.ai_score_accepted"
	// 回答普通主题时获得的贡献值
	RankSubjectAnswerKey = "rank.subject.answer"
	// 回答积分主题时获得的贡献值
	RankSubjectScoreAnswerKey = "rank.subject.score_answer"
	// AI回答普通主题时获得的贡献值
	RankSubjectAIAnswerKey = "rank.subject.ai_answer"
	// AI回答积分主题时获得的贡献值
	RankSubjectAIScoreAnswerKey = "rank.subject.ai_score_answer"
	// AI回答积分主题时被采纳后能获得的积分比例(%)
	RankSubjectScoreAIAcceptedGetKey = "rank.subject.ai_score_get"
	// ========================点赞与点踩=========================
	// 对主题的每个点赞能获取多少声望
	RankSubjectUpVotedKey = "rank.subject.up_voted"
	// 对主题的每个点踩会失去多少声望
	RankSubjectDownVotedKey = "rank.subject.down_voted"
	// 每个积分主题的点赞会获得多少声望
	RankSubjectScoreUpVotedKey = "rank.subject.score_up_voted"
	// 每个积分主题的点踩会失去多少声望
	RankSubjectScoreDownVotedKey = "rank.subject.score_down_voted"
	// 对主题的收藏能获得多少声望
	RankSubjectCollectKey = "rank.subject.collect"
	// 对积分主题的收藏能获得多少声望
	RankSubjectScoreCollectKey = "rank.subject.score_collect"

	// 对主题回复的每个点赞能获取多少声望
	RankSubjectAnswerUpVotedKey = "rank.subject.answer_up_voted"
	// 对主题回复的每个点踩会失去多少声望
	RankSubjectAnswerDownVotedKey = "rank.subject.answer_down_voted"
	// 对积分主题回复的每个点赞能获取多少声望
	RankSubjectAnswerScoreUpVotedKey = "rank.subject.answer_score_up_voted"
	// 对积分主题回复的每个点踩会失去多少声望
	RankSubjectAnswerScoreDownVotedKey = "rank.subject.answer_score_down_voted"
	// 对AI回复的每个点赞能获取多少声望
	RankSubjectAnswerAIUpVotedKey = "rank.subject.answer_ai_up_voted"
	// 对AI回复的每个点踩会失去多少声望
	RankSubjectAnswerAIDownVotedKey = "rank.subject.answer_ai_down_voted"
	// 对积分主题AI回复的每个点赞能获取多少声望
	RankSubjectAnswerScoreAIUpVotedKey = "rank.subject.answer_score_ai_up_voted"
	// 对积分主题AI回复的每个点踩会失去多少声望
	RankSubjectAnswerScoreAIDownVotedKey = "rank.subject.answer_score_ai_down_voted"

	// 对主题评论的每个点赞能获取多少声望
	RankSubjectCommentUpVoteKey = "rank.subject.comment_up_vote"
	// 对主题评论的每个点踩会失去多少声望
	RankSubjectCommentDownVoteKey = "rank.subject.comment_down_vote"
	// 对积分主题评论的每个点赞能获取多少声望
	RankSubjectCommentScoreUpVoteKey = "rank.subject.comment_score_up_vote"
	// 对积分主题评论的每个点踩会失去多少声望
	RankSubjectCommentScoreDownVoteKey = "rank.subject.comment_score_down_vote"
	// 对AI评论的每个点赞能获取多少声望
	RankSubjectCommentAIUpVoteKey = "rank.subject.comment_ai_up_vote"
	// 对AI评论的每个点踩会失去多少声望
	RankSubjectCommentAIDownVoteKey = "rank.subject.comment_ai_down_vote"
	// 对积分主题AI评论的每个点赞能获取多少声望
	RankSubjectCommentScoreAIUpVoteKey = "rank.subject.comment_score_ai_up_vote"
	// 对积分主题AI评论的每个点踩会失去多少声望
	RankSubjectCommentScoreAIDownVoteKey = "rank.subject.comment_score_ai_down_vote"

	// 多少声望可以兑换1积分
	RankScoreExchangeKey = "rank.score.exchange"
)

var (
	RankAllPrivileges = []*Privilege{
		{Label: reason.RankQuestionAddLabel, Key: RankQuestionAddKey},
		{Label: reason.RankAnswerAddLabel, Key: RankAnswerAddKey},
		{Label: reason.RankCommentAddLabel, Key: RankCommentAddKey},
		{Label: reason.RankReportAddLabel, Key: RankReportAddKey},
		{Label: reason.RankCommentVoteUpLabel, Key: RankCommentVoteUpKey},
		{Label: reason.RankLinkUrlLimitLabel, Key: RankLinkUrlLimitKey},
		{Label: reason.RankQuestionVoteUpLabel, Key: RankQuestionVoteUpKey},
		{Label: reason.RankAnswerVoteUpLabel, Key: RankAnswerVoteUpKey},
		{Label: reason.RankQuestionVoteDownLabel, Key: RankQuestionVoteDownKey},
		{Label: reason.RankAnswerVoteDownLabel, Key: RankAnswerVoteDownKey},
		{Label: reason.RankInviteSomeoneToAnswerLabel, Key: RankInviteSomeoneToAnswerKey},
		{Label: reason.RankTagAddLabel, Key: RankTagAddKey},
		{Label: reason.RankTagEditLabel, Key: RankTagEditKey},
		{Label: reason.RankQuestionEditLabel, Key: RankQuestionEditKey},
		{Label: reason.RankAnswerEditLabel, Key: RankAnswerEditKey},
		{Label: reason.RankQuestionEditWithoutReviewLabel, Key: RankQuestionEditWithoutReviewKey},
		{Label: reason.RankAnswerEditWithoutReviewLabel, Key: RankAnswerEditWithoutReviewKey},
		{Label: reason.RankQuestionAuditLabel, Key: RankQuestionAuditKey},
		{Label: reason.RankAnswerAuditLabel, Key: RankAnswerAuditKey},
		{Label: reason.RankTagAuditLabel, Key: RankTagAuditKey},
		{Label: reason.RankTagEditWithoutReviewLabel, Key: RankTagEditWithoutReviewKey},
		{Label: reason.RankTagSynonymLabel, Key: RankTagSynonymKey},
		{Label: reason.RankSubjectContributeLabel, Key: RankSubjectContributeKey},
		{Label: reason.RankSubjectScoreContributeLabel, Key: RankSubjectScoreContributeKey},
		{Label: reason.RankSubjectAcceptLabel, Key: RankSubjectAcceptKey},
		{Label: reason.RankSubjectAIAcceptLabel, Key: RankSubjectAIAcceptKey},
		{Label: reason.RankSubjectScoreAcceptLabel, Key: RankSubjectScoreAcceptKey},
		{Label: reason.RankSubjectScoreAIAcceptLabel, Key: RankSubjectScoreAIAcceptKey},
		{Label: reason.RankSubjectAcceptedLabel, Key: RankSubjectAcceptedKey},
		{Label: reason.RankSubjectAIAcceptedLabel, Key: RankSubjectAIAcceptedKey},
		{Label: reason.RankSubjectScoreAcceptedLabel, Key: RankSubjectScoreAcceptedKey},
		{Label: reason.RankSubjectAIScoreAcceptedLabel, Key: RankSubjectAIScoreAcceptedKey},
		{Label: reason.RankSubjectAnswerLabel, Key: RankSubjectAnswerKey},
		{Label: reason.RankSubjectScoreAnswerLabel, Key: RankSubjectScoreAnswerKey},
		{Label: reason.RankSubjectAIAnswerLabel, Key: RankSubjectAIAnswerKey},
		{Label: reason.RankSubjectAIScoreAnswerLabel, Key: RankSubjectAIScoreAnswerKey},
		{Label: reason.RankSubjectScoreAIAcceptedGetLabel, Key: RankSubjectScoreAIAcceptedGetKey},

		{Label: reason.RankSubjectUpVotedLabel, Key: RankSubjectUpVotedKey},
		{Label: reason.RankSubjectDownVotedLabel, Key: RankSubjectDownVotedKey},
		// 每个积分主题的点赞会获得多少声望
		{Label: reason.RankSubjectScoreUpVotedLabel, Key: RankSubjectScoreUpVotedKey},
		// 每个积分主题的点踩会失去多少声望
		{Label: reason.RankSubjectScoreDownVotedLabel, Key: RankSubjectScoreDownVotedKey},
		// 对主题的收藏能获得多少声望
		{Label: reason.RankSubjectCollectLabel, Key: RankSubjectCollectKey},
		// 对积分主题的收藏能获得多少声望
		{Label: reason.RankSubjectScoreCollectLabel, Key: RankSubjectScoreCollectKey},
		// 对主题回复的每个点赞能获取多少声望
		{Label: reason.RankSubjectAnswerUpVotedLabel, Key: RankSubjectAnswerUpVotedKey},
		// 对主题回复的每个点踩会失去多少声望
		{Label: reason.RankSubjectAnswerDownVotedLabel, Key: RankSubjectAnswerDownVotedKey},
		// 对积分主题回复的每个点赞能获取多少声望
		{Label: reason.RankSubjectAnswerScoreUpVotedLabel, Key: RankSubjectAnswerScoreUpVotedKey},
		// 对积分主题回复的每个点踩会失去多少声望
		{Label: reason.RankSubjectAnswerScoreDownVotedLabel, Key: RankSubjectAnswerScoreDownVotedKey},
		// 对AI回复的每个点赞能获取多少声望
		{Label: reason.RankSubjectAnswerAIUpVotedLabel, Key: RankSubjectAnswerAIUpVotedKey},
		// 对AI回复的每个点踩会失去多少声望
		{Label: reason.RankSubjectAnswerAIDownVotedLabel, Key: RankSubjectAnswerAIDownVotedKey},
		// 对积分主题AI回复的每个点赞能获取多少声望
		{Label: reason.RankSubjectAnswerScoreAIUpVotedLabel, Key: RankSubjectAnswerScoreAIUpVotedKey},
		// 对积分主题AI回复的每个点踩会失去多少声望
		{Label: reason.RankSubjectAnswerScoreAIDownVotedLabel, Key: RankSubjectAnswerScoreAIDownVotedKey},
		// 对主题评论的每个点赞能获取多少声望
		{Label: reason.RankSubjectCommentUpVoteLabel, Key: RankSubjectCommentUpVoteKey},
		// 对主题评论的每个点踩会失去多少声望
		{Label: reason.RankSubjectCommentDownVoteLabel, Key: RankSubjectCommentDownVoteKey},
		// 对积分主题评论的每个点赞能获取多少声望
		{Label: reason.RankSubjectCommentScoreUpVoteLabel, Key: RankSubjectCommentScoreUpVoteKey},
		// 对积分主题评论的每个点踩会失去多少声望
		{Label: reason.RankSubjectCommentScoreDownVoteLabel, Key: RankSubjectCommentScoreDownVoteKey},
		// 对AI评论的每个点赞能获取多少声望
		{Label: reason.RankSubjectCommentAIUpVoteLabel, Key: RankSubjectCommentAIUpVoteKey},
		// 对AI评论的每个点踩会失去多少声望
		{Label: reason.RankSubjectCommentAIDownVoteLabel, Key: RankSubjectCommentAIDownVoteKey},
		// 对积分主题AI评论的每个点赞能获取多少声望
		{Label: reason.RankSubjectCommentScoreAIUpVoteLabel, Key: RankSubjectCommentScoreAIUpVoteKey},
		// 对积分主题AI评论的每个点踩会失去多少声望
		{Label: reason.RankSubjectCommentScoreAIDownVoteLabel, Key: RankSubjectCommentScoreAIDownVoteKey},
		// 多少声望可以兑换1积分
		{Label: reason.RankScoreExchangeLabel, Key: RankScoreExchangeKey},
	}
)
