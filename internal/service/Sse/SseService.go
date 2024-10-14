package Sse

import (
	"github.com/r3labs/sse/v2"
	"net/http"
)

// SseService kit service
type SseService struct {
	Eve *sse.Server
}

// NewSseService service
func NewSseService() *SseService {
	es := sse.New()
	es.AutoReplay = false
	es.CreateStream("message")
	es.Headers["Access-Control-Allow-Origin"] = "*"
	mux := http.NewServeMux()
	mux.HandleFunc("/events", es.ServeHTTP)

	go func() {
		http.ListenAndServe(":8080", mux)
	}()

	return &SseService{
		Eve: es,
	}
}
