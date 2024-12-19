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

package reason

const (
	PrivilegeLevel1Desc      = "privilege.level_1.description"
	PrivilegeLevel2Desc      = "privilege.level_2.description"
	PrivilegeLevel3Desc      = "privilege.level_3.description"
	PrivilegeLevelCustomDesc = "privilege.level_custom.description"

	RankQuestionAddLabel               = "privilege.rank_question_add_label"
	RankAnswerAddLabel                 = "privilege.rank_answer_add_label"
	RankCommentAddLabel                = "privilege.rank_comment_add_label"
	RankReportAddLabel                 = "privilege.rank_report_add_label"
	RankCommentVoteUpLabel             = "privilege.rank_comment_vote_up_label"
	RankLinkUrlLimitLabel              = "privilege.rank_link_url_limit_label"
	RankQuestionVoteUpLabel            = "privilege.rank_question_vote_up_label"
	RankAnswerVoteUpLabel              = "privilege.rank_answer_vote_up_label"
	RankQuestionVoteDownLabel          = "privilege.rank_question_vote_down_label"
	RankAnswerVoteDownLabel            = "privilege.rank_answer_vote_down_label"
	RankInviteSomeoneToAnswerLabel     = "privilege.rank_invite_someone_to_answer_label"
	RankTagAddLabel                    = "privilege.rank_tag_add_label"
	RankTagEditLabel                   = "privilege.rank_tag_edit_label"
	RankQuestionEditLabel              = "privilege.rank_question_edit_label"
	RankAnswerEditLabel                = "privilege.rank_answer_edit_label"
	RankQuestionEditWithoutReviewLabel = "privilege.rank_question_edit_without_review_label"
	RankAnswerEditWithoutReviewLabel   = "privilege.rank_answer_edit_without_review_label"
	RankQuestionAuditLabel             = "privilege.rank_question_audit_label"
	RankAnswerAuditLabel               = "privilege.rank_answer_audit_label"
	RankTagAuditLabel                  = "privilege.rank_tag_audit_label"
	RankTagEditWithoutReviewLabel      = "privilege.rank_tag_edit_without_review_label"
	RankTagSynonymLabel                = "privilege.rank_tag_synonym_label"
	// 发布相关
	RankSubjectContributeLabel      = "privilege.rank_subject_contribute_label"
	RankSubjectScoreContributeLabel = "privilege.rank_subject_score_contribute_label"
	// 当主题回复被采纳时，主题的作者能获取的贡献值
	RankSubjectAcceptLabel = "privilege.rank_subject_accept_label"
	// 当主题AI回复被采纳时，主题的作者能获取的贡献值
	RankSubjectAIAcceptLabel = "privilege.rank_subject_ai_accept_label"
	// 当积分主题回复被采纳时，主题的作者能获取的贡献值
	RankSubjectScoreAcceptLabel = "privilege.rank_subject_score_accept_label"
	// 当积分主题AI回复被采纳时，主题的作者能获取的贡献值
	RankSubjectScoreAIAcceptLabel          = "privilege.rank_subject_score_ai_accept_label"
	RankSubjectAcceptedLabel               = "privilege.rank_subject_accepted_label"
	RankSubjectAIAcceptedLabel             = "privilege.rank_subject_ai_accepted_label"
	RankSubjectScoreAcceptedLabel          = "privilege.rank_subject_score_accepted_label"
	RankSubjectAIScoreAcceptedLabel        = "privilege.rank_subject_ai_score_accepted_label"
	RankSubjectAnswerLabel                 = "privilege.rank_subject_answer_label"
	RankSubjectScoreAnswerLabel            = "privilege.rank_subject_score_answer_label"
	RankSubjectAIAnswerLabel               = "privilege.rank_subject_ai_answer_label"
	RankSubjectAIScoreAnswerLabel          = "privilege.rank_subject_ai_score_answer_label"
	RankSubjectScoreAIAcceptedGetLabel     = "privilege.rank_subject_score_ai_accepted_get_label"
	RankSubjectUpVotedLabel                = "privilege.rank_subject_up_vote_label"
	RankSubjectDownVotedLabel              = "privilege.rank_subject_down_vote_label"
	RankSubjectScoreUpVotedLabel           = "privilege.rank_subject_score_up_vote_label"               // 每个积分主题的点赞所获得的声望
	RankSubjectScoreDownVotedLabel         = "privilege.rank_subject_score_down_vote_label"             // 每个积分主题的点踩所失去的声望
	RankSubjectCollectLabel                = "privilege.rank_subject_collect_label"                     // 对主题的每次收藏所能获得的声望
	RankSubjectScoreCollectLabel           = "privilege.rank_subject_score_collect_label"               // 对积分主题的每次收藏所能获得的声望
	RankSubjectAnswerUpVotedLabel          = "privilege.rank_subject_answer_up_vote_label"              // 对主题回复的每个点赞能获取的声望
	RankSubjectAnswerDownVotedLabel        = "privilege.rank_subject_answer_down_vote_label"            // 对主题回复的每个点踩会失去的声望
	RankSubjectAnswerScoreUpVotedLabel     = "privilege.rank_subject_answer_score_up_vote_label"        // 对积分主题回复的每个点赞能获取的声望
	RankSubjectAnswerScoreDownVotedLabel   = "privilege.rank_subject_answer_score_down_vote_label"      // 对积分主题回复的每个点踩会失去的声望
	RankSubjectAnswerAIUpVotedLabel        = "privilege.rank_subject_answer_ai_up_vote_label"           // 对AI回复的每个点赞能获取的声望
	RankSubjectAnswerAIDownVotedLabel      = "privilege.rank_subject_answer_ai_down_vote_label"         // 对AI回复的每个点踩会失去的声望
	RankSubjectAnswerScoreAIUpVotedLabel   = "privilege.rank_subject_answer_score_ai_up_vote_label"     // 对积分主题AI回复的每个点赞能获取的声望
	RankSubjectAnswerScoreAIDownVotedLabel = "privilege.rank_subject_answer_score_ai_down_vote_label"   // 对积分主题AI回复的每个点踩会失去的声望
	RankSubjectCommentUpVoteLabel          = "privilege.rank_subject_comment_up_voted_label"            // 对主题评论的每个点赞能获取的声望
	RankSubjectCommentDownVoteLabel        = "privilege.rank_subject_comment_down_voted_label"          // 对主题评论的每个点踩会失去的声望
	RankSubjectCommentScoreUpVoteLabel     = "privilege.rank_subject_comment_score_up_voted_label"      // 对积分主题评论的每个点赞能获取的声望
	RankSubjectCommentScoreDownVoteLabel   = "privilege.rank_subject_comment_score_down_voted_label"    // 对积分主题评论的每个点踩会失去的声望
	RankSubjectCommentAIUpVoteLabel        = "privilege.rank_subject_comment_ai_up_voted_label"         // 对AI评论的每个点赞能获取的声望
	RankSubjectCommentAIDownVoteLabel      = "privilege.rank_subject_comment_ai_down_voted_label"       // 对AI评论的每个点踩会失去的声望
	RankSubjectCommentScoreAIUpVoteLabel   = "privilege.rank_subject_comment_score_ai_up_voted_label"   // 对积分主题AI评论的每个点赞能获取的声望
	RankSubjectCommentScoreAIDownVoteLabel = "privilege.rank_subject_comment_score_ai_down_voted_label" // 对积分主题AI评论的每个点踩会失去的声望
	RankScoreExchangeLabel                 = "privilege.rank_score_exchange_label"                      // 多少声望可以兑换1积分
)
