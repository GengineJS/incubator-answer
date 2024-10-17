package controller

import (
	"github.com/apache/incubator-answer/internal/service/content"
	"github.com/gin-gonic/gin"
	"github.com/xinggaoya/qwen-sdk/qwen"
)

type AIController struct {
	qWenService       *content.AIQWenService
	commentController *CommentController
	answerController  *AnswerController
}

// NewAIController new controller
func NewAIController(cc *CommentController, ac *AnswerController) *AIController {
	// 通问千义
	qWenApiKey := "sk-9bf33e6a1d2b45bb8975f4f8daf7d567"
	qWenService := &content.AIQWenService{
		ApiKey:         qWenApiKey,
		Client:         qwen.NewWithDefaultChat(qWenApiKey),
		CommentService: cc.commentService,
	}
	return &AIController{
		qWenService:       qWenService,
		commentController: cc,
		answerController:  ac,
	}
}

func (ai *AIController) AddComment(ctx *gin.Context) {
	cc := ai.commentController
	cc.AddAIComment(ctx, ai.qWenService)
}

func (ai *AIController) AddAnswer(ctx *gin.Context) {
	ac := ai.answerController
	ac.AddAI(ctx, ai.qWenService)
}