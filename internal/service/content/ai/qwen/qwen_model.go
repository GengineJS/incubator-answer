package qwen

const (
	ChatUser   = "user"
	ChatSystem = "system"
	ChatBot    = "assistant"
)

const (
	ChatQWenModel = "qwen-turbo"
	ChatBaseUrl   = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions" // "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation"
)

type Input struct {
	Messages []Messages `json:"messages"`
}

type QWenTurbo struct {
	Model string `json:"model"`
	// Input      Input      `json:"input"`
	Messages   []Messages `json:"messages"`
	Parameters Parameters `json:"parameters"`
}

type Parameters struct {
	EnableSearch      bool   `json:"enable_search"`
	IncrementalOutput bool   `json:"incremental_output"`
	ResponseFormat    string `json:"response_format"`
}

type Messages struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// Result

type Output struct {
	Text         string `json:"text"`
	FinishReason string `json:"finish_reason"`
}

type Usage struct {
	OutputTokens int `json:"output_tokens"`
	InputTokens  int `json:"input_tokens"`
}

type RespMsg struct {
	Content string `json:"content"`
}
type Choice struct {
	Reason  string  `json:"finish_reason"`
	Index   int     `json:"index"`
	RespMsg RespMsg `json:"message"`
}

type Response struct {
	//Output    Output `json:"output"`
	//Usage     Usage  `json:"usage"`
	//RequestID string `json:"request_id"`
	ID      string   `json:"id"`
	Choices []Choice `json:"choices"`
}

type ResponseError struct {
	Code      string `json:"code"`
	Message   string `json:"message"`
	RequestId string `json:"request_id"`
}
