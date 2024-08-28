package assetbun

import (
	"context"
	"github.com/apache/incubator-answer/internal/service/notice_queue"
)

type AssetBunRepo interface {
	SyncUsers(ctx context.Context)
	GetScore(ctx context.Context, userID string) (int, error)
	// 获取当前用户赚取积分时可得到的真实积分，因为有平台服务费
	GetRealPublishScore(ctx context.Context, userID string, score int) int
	// 获取当前用户下载积分时付出的真实积分，因为用户可能是VIP
	GetRealDownloadScore(ctx context.Context, userID string, score int) int
	// 发送积分操作信息到全部关注该内容的用户
	OperateScoreNotifySendFollow(ctx context.Context, queue notice_queue.NotificationQueueService, sendUID string, qid string, recUID string, title string, action string, pay int, point int)
	// 发送积分操作信息到指定用户
	OperateScoreNotifySend(ctx context.Context, queue notice_queue.NotificationQueueService, sendUID string, qid string, recUID string, title string, action string, pay int, point int)
	SubScore(ctx context.Context, userID string, subNum int) error
	OffsetScore(ctx context.Context, userID string, offsetNum int) error
	GetVIPInfo(ctx context.Context, userID string) (*Groups, error)
}
