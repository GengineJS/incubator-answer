package content

import (
	"fmt"
	"github.com/apache/incubator-answer/internal/base/constant"
	commentService "github.com/apache/incubator-answer/internal/service/comment"
	"github.com/apache/incubator-answer/internal/service/object_info"
	"github.com/apache/incubator-answer/pkg/uid"
	"github.com/gin-gonic/gin"
	"github.com/russross/blackfriday/v2"
	"github.com/xinggaoya/qwen-sdk/qwen"
	"regexp"
)

// AIQWenService ===============通义千问====================
type AIQWenService struct {
	ApiKey         string
	Client         *qwen.Chat
	Messages       []qwen.Messages
	CommentService *commentService.CommentService
}

func removePTags(input string) string {
	// 使用正则表达式匹配<p>和</p>标签并替换为空字符串
	re := regexp.MustCompile(`(?i)<p\b[^>]*>|</p>`)
	return re.ReplaceAllString(input, "")
}

func (operator *AIQWenService) addAIMsg(ctx *gin.Context, messages []qwen.Messages, objId string, reType object_info.AIReplyType) (msg []qwen.Messages) {
	objInfo, _ := operator.CommentService.GetCommentFromObject(ctx, objId)
	if objInfo == nil {
		return messages
	}
	role := qwen.ChatUser
	if objInfo.IsAI {
		role = qwen.ChatBot
	}
	if objInfo.ObjectType == constant.QuestionObjectType {
		messages = append(messages, qwen.Messages{Role: role, Content: objInfo.Title})
		messages = append(messages, qwen.Messages{Role: role, Content: removePTags(objInfo.Content)})
	} else if objInfo.ObjectType == constant.AnswerObjectType {
		messages = operator.addAIMsg(ctx, messages, objInfo.QuestionID, reType)
		messages = append(messages, qwen.Messages{Role: role, Content: removePTags(objInfo.Content)})
	} else if objInfo.ObjectType == constant.CommentObjectType {
		if len(objInfo.ReCommentID) != 0 {
			messages = operator.addAIMsg(ctx, messages, objInfo.ReCommentID, reType)
		} else {
			if len(objInfo.AnswerID) > 0 && objInfo.AnswerID != "0" {
				messages = operator.addAIMsg(ctx, messages, objInfo.AnswerID, reType)
			} else {
				messages = operator.addAIMsg(ctx, messages, objInfo.QuestionID, reType)
			}
		}
		messages = append(messages, qwen.Messages{Role: role, Content: removePTags(objInfo.Content)})
	}
	operator.CommentService.UpdateAIReplied(ctx, objId, reType)
	return messages
}

func (operator *AIQWenService) GetAIReply(ctx *gin.Context, objId string, replyId string, reType object_info.AIReplyType) (origin string, htmlStr string) {
	var messages = operator.Messages
	objId = uid.DeShortID(objId)
	if len(replyId) > 0 {
		messages = operator.addAIMsg(ctx, messages, uid.DeShortID(replyId), reType)
	} else {
		messages = operator.addAIMsg(ctx, messages, uid.DeShortID(objId), reType)
	}

	// 获取AI对消息的回复
	aiResp, aiErr := operator.Client.GetAIReply(messages)
	if aiErr != nil {
		fmt.Printf("获取AI回复失败：%v\n", aiErr)
		return "", ""
	}

	fmt.Printf("收到了AI回复")
	originStr := aiResp.Output.Text
	return originStr, string(blackfriday.Run([]byte(originStr)))
}
