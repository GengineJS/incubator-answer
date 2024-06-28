package content

import "github.com/xinggaoya/qwen-sdk/qwen"

// AIQWenService ===============通义千问====================
type AIQWenService struct {
	ApiKey   string
	Client   *qwen.Chat
	Messages []qwen.Messages
}
