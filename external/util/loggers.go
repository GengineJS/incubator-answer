package util

import (
	"fmt"
	"github.com/sirupsen/logrus"
	"log"
	"os"
	"sync"
)

// Logger 封装后的日志对象
type Logger struct {
	*logrus.Logger
}

// NewLogger 创建一个新的 Logger 实例
func NewLogger(logFile string) (*Logger, error) {
	// 创建日志文件
	file, err := os.OpenFile(logFile, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		return nil, err
	}

	// 创建 logrus.Logger 实例
	logger := logrus.New()
	logger.Out = file
	logger.SetLevel(logrus.DebugLevel) // 设置日志级别为 Debug

	// 设置日志格式为 JSON
	logger.SetFormatter(&logrus.JSONFormatter{
		TimestampFormat: "2006-01-02 15:04:05",
	})

	// 返回封装后的 Logger 实例
	return &Logger{logger}, nil
}

// Info 输出 Info 级别日志
func (l *Logger) Info(args ...interface{}) {
	l.Logger.Info(fmt.Sprint(args...))
}

// Debug 输出 Debug 级别日志
func (l *Logger) Debug(args ...interface{}) {
	l.Logger.Debug(fmt.Sprint(args...))
}

// Error 输出 Error 级别日志
func (l *Logger) Error(args ...interface{}) {
	l.Logger.Error(fmt.Sprint(args...))
}

// Fatal 输出 Fatal 级别日志并退出程序
func (l *Logger) Fatal(args ...interface{}) {
	l.Logger.Fatal(fmt.Sprint(args...))
}

// GlobalLogger 全局 Logger 实例
var GlobalLogger *Logger

// initialized 标志变量，用于检查是否已经初始化
var initialized bool

// initLock 用于同步初始化操作
var initLock sync.Once

// InitGlobalLogger 初始化全局 Logger 实例
func InitGlobalLogger(logFile string) error {
	initLock.Do(func() {
		if initialized {
			return
		}
		var err error
		GlobalLogger, err = NewLogger(logFile)
		if err != nil {
			// 这里不能使用 GlobalLogger 输出错误日志，因为可能还没有初始化成功
			// 可以使用标准库的 log 包输出错误日志
			log.Fatalf("create logger failed: %v", err)
		}
		initialized = true
	})
	return nil
}
