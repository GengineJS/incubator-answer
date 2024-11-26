package entity

import (
	"net/http"
)

func SendSetNotifyDefault() {
	url := "https://ai.assetbun.com/answer/api/v1/user/notify/default"
	// 发送 GET 请求
	http.Get(url)
	// LocalHost
	url = "http://localhost/answer/api/v1/user/notify/default"
	// 发送 GET 请求
	http.Get(url)
}
