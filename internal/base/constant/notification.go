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

const (
	// NotificationUpdateQuestion update question
	NotificationUpdateQuestion = "notification.action.update_question"
	// NotificationSubIntegral sub integral
	NotificationSubIntegral = "notification.action.sub_integral"
	// NotificationSubIntegral add integral
	NotificationAddIntegral          = "notification.action.add_integral"
	NotificationAddSubject           = "notification.action.add_subject"
	NotificationCollectSubject       = "notification.action.collect_subject"
	NotificationCancelCollectSubject = "notification.action.cancel_collect_subject"
	NotificationAddAnswer            = "notification.action.add_answer"
	NotificationAddAIAnswer          = "notification.action.add_ai_answer"
	NotificationDeleteAnswer         = "notification.action.delete_answer"
	NotificationDeleteAIAnswer       = "notification.action.delete_ai_answer"
	NotificationRecoverAnswer        = "notification.action.recover_answer"
	NotificationAIRecoverAnswer      = "notification.action.ai_recover_answer"
	NotificationClosedSubject        = "notification.action.closed_subject"
	NotificationRecoverSubject       = "notification.action.recover_subject"
	NotificationReOpenSubject        = "notification.action.reopen_subject"
	NotificationDeleteSubject        = "notification.action.delete_subject"
	// NotificationPayIntegral pay integral
	NotificationPayIntegral = "notification.action.pay_integral"
	// NotificationAcceptedGetIntegral 回复被采纳后可以获得的积分
	NotificationAcceptedGetIntegral = "notification.action.accepted_get_integral"
	// NotificationAIAcceptedGetIntegral ai的回复被采纳后可以获得的积分
	NotificationAIAcceptedGetIntegral = "notification.action.ai_accepted_get_integral"
	// NotificationAccpetedSelfIntegral 采纳自己的回复，并且不是AI回复，将返还积分
	NotificationAccpetedSelfIntegral = "notification.action.accpeted_self_integral"
	// NotificationAIAcceptedIntegral ai accepted integral
	NotificationAIAcceptedIntegral = "notification.action.ai_accepted_integral"
	// NotificationDeleteBackIntegral delete back integral
	NotificationDeleteBackIntegral = "notification.action.delete_back_integral"
	// NotificationUpdateSubIntegral update sub integral
	NotificationUpdateSubIntegral = "notification.action.update_sub_integral"
	// NotificationUpdateBackIntegral update back integral
	NotificationUpdateBackIntegral = "notification.action.update_back_integral"
	// NotificationAnswerTheQuestion answer the question
	NotificationAnswerTheQuestion = "notification.action.answer_the_question"
	// NotificationUpVotedTheQuestion up voted the question
	NotificationUpVotedTheQuestion = "notification.action.up_voted_question"
	// NotificationUpVotedCancelTheQuestion up voted cancel the question
	NotificationUpVotedCancelTheQuestion = "notification.action.up_voted_cancel_question"
	// NotificationDownVotedTheQuestion down voted the question
	NotificationDownVotedTheQuestion = "notification.action.down_voted_question"
	// NotificationDownVotedCancelTheQuestion down voted cancel the question
	NotificationDownVotedCancelTheQuestion = "notification.action.down_voted_cancel_question"
	// NotificationUpdateAnswer update answer
	NotificationUpdateAnswer = "notification.action.update_answer"
	// NotificationAcceptAnswer accept answer
	NotificationAcceptAnswer = "notification.action.accept_answer"
	// NotificationCancelAcceptAnswer cancel accept answer
	NotificationCancelAcceptAnswer = "notification.action.cancel_accept_answer"
	// NotificationAcceptedRankAnswer 采纳答案后，并获得了xx声望
	NotificationAcceptedRankAnswer = "notification.action.accepted_rank_answer"
	// NotificationAcceptRankAnswer 采纳了主题下的回复，并获得了xx声望
	NotificationAcceptRankAnswer = "notification.action.accept_rank_answer"
	// NotificationCancelAcceptedRankAnswer 采纳答案被取消了，并失去了xx声望
	NotificationCancelAcceptedRankAnswer = "notification.action.cancel_accepted_rank_answer"
	// NotificationCancelAcceptRankAnswer 主题下的采纳答案被取消了，并失去了xx声望
	NotificationCancelAcceptRankAnswer = "notification.action.cancel_accept_rank_answer"
	// NotificationUpVotedTheAnswer up voted the answer
	NotificationUpVotedTheAnswer = "notification.action.up_voted_answer"
	// NotificationUpVotedCancelTheAnswer up voted cancel the answer
	NotificationUpVotedCancelTheAnswer = "notification.action.up_voted_cancel_answer"
	// NotificationDownVotedTheAnswer down voted the answer
	NotificationDownVotedTheAnswer = "notification.action.down_voted_answer"
	// NotificationDownVotedCancelTheAnswer down voted cancel the answer
	NotificationDownVotedCancelTheAnswer = "notification.action.down_voted_cancel_answer"
	// NotificationCommentQuestion comment question
	NotificationCommentQuestion = "notification.action.comment_question"
	// NotificationCommentAnswer comment answer
	NotificationCommentAnswer = "notification.action.comment_answer"
	// NotificationUpVotedTheComment up voted the comment
	NotificationUpVotedTheComment = "notification.action.up_voted_comment"
	// NotificationUpVotedCancelTheComment up voted cancel the comment
	NotificationUpVotedCancelTheComment = "notification.action.up_voted_cancel_comment"
	// NotificationReplyToYou reply to you
	NotificationReplyToYou = "notification.action.reply_to_you"
	// NotificationMentionYou mention you
	NotificationMentionYou = "notification.action.mention_you"
	// NotificationYourQuestionIsClosed your question is closed
	NotificationYourQuestionIsClosed = "notification.action.your_question_is_closed"
	// NotificationYourQuestionWasDeleted your question was deleted
	NotificationYourQuestionWasDeleted = "notification.action.your_question_was_deleted"
	// NotificationYourAnswerWasDeleted your answer was deleted
	NotificationYourAnswerWasDeleted = "notification.action.your_answer_was_deleted"
	// NotificationYourCommentWasDeleted your comment was deleted
	NotificationYourCommentWasDeleted = "notification.action.your_comment_was_deleted"
	// NotificationInvitedYouToAnswer invited you to answer
	NotificationInvitedYouToAnswer = "notification.action.invited_you_to_answer"
	NotificationUserContract       = "notification.action.contract_subject"
)

type NotificationChannelKey string
type NotificationSource string

const (
	InboxSource                                   NotificationSource = "inbox"
	AllNewSubjectSource                           NotificationSource = "all_new_subject"
	AllNewSubjectForFollowingTagsSource           NotificationSource = "all_new_subject_for_following_tags"
	AllEmailNewQuestionSource                     NotificationSource = "all_email_new_question"
	AllEmailNewScoreQuestionSource                NotificationSource = "all_email_new_score_question"
	AllEmailNewArticleSource                      NotificationSource = "all_email_new_article"
	AllEmailNewScoreArticleSource                 NotificationSource = "all_email_new_score_article"
	AllEmailNewBountySource                       NotificationSource = "all_email_new_bounty"
	AllEmailNewAssetbunSource                     NotificationSource = "all_email_new_assetbun"
	AllEmailNewScoreAssetbunSource                NotificationSource = "all_email_new_score_assetbun"
	AllEmailNewSubjectForFollowingTagsSource      NotificationSource = "all_email_new_subject_for_following_tags"
	AllEmailNewSubjectScoreForFollowingTagsSource NotificationSource = "all_email_new_subject_score_for_following_tags"
)

const (
	EmailChannel NotificationChannelKey = "email"
)

var (
	NotificationMsgTypeMapping = map[string]int{
		NotificationUpdateQuestion:             1,
		NotificationAnswerTheQuestion:          1,
		NotificationUpVotedTheQuestion:         2,
		NotificationUpVotedCancelTheQuestion:   2,
		NotificationDownVotedTheQuestion:       2,
		NotificationDownVotedCancelTheQuestion: 2,
		NotificationUpdateAnswer:               1,
		NotificationAcceptAnswer:               1,
		NotificationUpVotedTheAnswer:           2,
		NotificationUpVotedCancelTheAnswer:     2,
		NotificationDownVotedTheAnswer:         2,
		NotificationDownVotedCancelTheAnswer:   2,
		NotificationCommentQuestion:            1,
		NotificationCommentAnswer:              1,
		NotificationUpVotedTheComment:          2,
		NotificationUpVotedCancelTheComment:    2,
		NotificationReplyToYou:                 1,
		NotificationMentionYou:                 1,
		NotificationYourQuestionIsClosed:       1,
		NotificationYourQuestionWasDeleted:     1,
		NotificationYourAnswerWasDeleted:       1,
		NotificationYourCommentWasDeleted:      1,
		NotificationInvitedYouToAnswer:         3,
		NotificationAddIntegral:                4,
		NotificationPayIntegral:                4,
		NotificationSubIntegral:                4,
		NotificationDeleteBackIntegral:         4,
		NotificationUpdateSubIntegral:          4,
		NotificationUpdateBackIntegral:         4,
		NotificationAddSubject:                 1,
		NotificationCollectSubject:             1,
		NotificationCancelCollectSubject:       1,
		NotificationClosedSubject:              1,
		NotificationReOpenSubject:              1,
		NotificationDeleteSubject:              1,
		NotificationAddAnswer:                  1,
		NotificationAddAIAnswer:                1,
		NotificationDeleteAnswer:               1,
		NotificationDeleteAIAnswer:             1,
		NotificationRecoverAnswer:              1,
		NotificationAIRecoverAnswer:            1,
		NotificationRecoverSubject:             1,
		NotificationAcceptedRankAnswer:         1,
		NotificationAcceptRankAnswer:           1,
		NotificationCancelAcceptedRankAnswer:   1,
		NotificationCancelAcceptRankAnswer:     1,
		NotificationCancelAcceptAnswer:         1,
		NotificationAIAcceptedIntegral:         4,
		NotificationAccpetedSelfIntegral:       4,
		NotificationAIAcceptedGetIntegral:      4,
		NotificationAcceptedGetIntegral:        4,
		NotificationUserContract:               5,
	}
)
