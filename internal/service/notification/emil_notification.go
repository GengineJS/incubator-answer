package notification

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/apache/incubator-answer/internal/entity"
)

type MailParams struct {
	Email     string `json:"to" binding:"email"`
	Title     string `json:"title"`
	Message   string `json:"message"`
	SendToAll bool   `json:"sendToAll"`
}

type EmailTemplateInfo struct {
	ContentLink string
	ContentType string
	Content     string
}

var emailTemplateMap = map[entity.QuestionType]EmailTemplateInfo{
	entity.TypeQuestion: {
		ContentLink: "https://ai.assetbun.com/questions/",
		ContentType: "积分问题",
		Content:     "问题",
	},
	entity.TypeArticle: {
		ContentLink: "https://ai.assetbun.com/questions/",
		ContentType: "文章",
		Content:     "文章",
	},
	entity.TypeAssetBun: {
		ContentLink: "https://ai.assetbun.com/questions/",
		ContentType: "资产包",
		Content:     "资产包",
	},
	entity.TypeBounty: {
		ContentLink: "https://ai.assetbun.com/questions/",
		ContentType: "悬赏",
		Content:     "悬赏",
	},
	entity.TypeAiPic: {
		ContentLink: "https://ai.assetbun.com/questions/",
		ContentType: "AI图片",
		Content:     "AI图片",
	},
}

// Replace 根据替换表执行批量替换
func Replace(table map[string]string, s string) string {
	for key, value := range table {
		s = strings.Replace(s, key, value, -1)
	}
	return s
}

// EmailReplace 替换邮件中的内容
func EmailReplace(table map[string]string, message string) string {

	return Replace(table, message)
}

// SendMailContentNotification 发送邮件通知
func SendMailContentNotification(title string, score int, contentType int) error {
	mailData := MailParams{
		Email:     "476393671@qq.com", // 需要替换为实际邮箱
		Title:     "资产包子-有人发布了项目需求",
		Message:   fmt.Sprintf("用户发布了新问题: %s, 积分: %d", title, score),
		SendToAll: false,
	}

	jsonData, err := json.Marshal(mailData)
	if err != nil {
		return fmt.Errorf("marshal mail data error: %v", err)
	}

	client := &http.Client{
		Timeout: 5 * time.Second,
	}

	resp, err := client.Post("http://your-service-url/api/mail", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("send mail notification error: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("mail notification failed with status: %d", resp.StatusCode)
	}

	return nil
}

// 使用示例
func getEmailTemplateInfo(questionType entity.QuestionType) EmailTemplateInfo {
	if info, ok := emailTemplateMap[questionType]; ok {
		return info
	}
	// 默认返回问题类型的模板信息
	return emailTemplateMap[entity.TypeQuestion]
}
