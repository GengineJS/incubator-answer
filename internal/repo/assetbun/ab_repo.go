package assetbun

import (
	"context"
	"encoding/json"
	"github.com/apache/incubator-answer/internal/base/constant"
	"github.com/apache/incubator-answer/internal/base/data"
	"github.com/apache/incubator-answer/internal/base/reason"
	"github.com/apache/incubator-answer/internal/entity"
	"github.com/apache/incubator-answer/internal/schema"
	"github.com/apache/incubator-answer/internal/service/assetbun"
	"github.com/apache/incubator-answer/internal/service/notice_queue"
	"github.com/gin-gonic/gin"
	"github.com/segmentfault/pacman/errors"
	"math"
	"strconv"
	"time"
	"xorm.io/xorm"
)

// AssetBun的用户表
type Users struct {
	ID        string    `xorm:"not null pk autoincr BIGINT(20) id"`
	CreatedAt time.Time `xorm:"created TIMESTAMP created_at"`
	UpdatedAt time.Time `xorm:"updated TIMESTAMP updated_at"`
	DeletedAt time.Time `xorm:"TIMESTAMP deleted_at"`

	// 其他字段
	Email    string `xorm:"not null VARCHAR(100) email"`
	Nick     string `xorm:"not null default '' VARCHAR(50) UNIQUE nick"`
	Password string `xorm:"not null default '' VARCHAR(255) password"`
	// 是否已经邮箱激活，0为激活，1为未激活，2未被封禁，3为超额被封禁
	Status          int    `xorm:"not null default 1 TINYINT(4) status"`
	AuditFree       bool   `xorm:"not null default 0 TINYINT(4) audit_free"`
	Storage         uint64 `xorm:"not null default 0 TINYINT(4) storage"`
	OpenID          string
	TwoFactor       string
	Avatar          string
	Options         string `xorm:"TEXT"`
	Authn           string `xorm:"TEXT"`
	Score           int    `xorm:"not null default 0 TINYINT(4) score"`
	PreviousGroupID uint   `xorm:"not null default 0 TINYINT(4) previous_group_id"`
	GroupID         uint   `xorm:"not null default 2 TINYINT(4) group_id"`
	Phone           string `xorm:"not null VARCHAR(100) phone"`
}

// 定义请求的URL
var assetBunAPIURL = []string{"http://localhost:5212/api/v3", "https://cloud.assetbun.com/api/v3"}
var serviceURL = []string{"localhost", "learnearn.cn"}

type ABLogin struct {
	UserName string `json:"userName"`
	Password string `json:"Password"`
}

func indexOf(slice []string, value string) int {
	for index, elem := range slice {
		if elem == value {
			return index // 找到元素，返回索引
		}
	}
	return -1 // 元素不存在于切片中，返回-1
}

type assetBunRepo struct {
	data *data.Data
}

func (ab *assetBunRepo) OperateScoreNotifySendFollow(ctx context.Context, queue notice_queue.NotificationQueueService, sendUID string, qid string, recUID string, title string, action string, pay int, getPoint int) {
	queue.Send(ctx, &schema.NotificationMsg{
		TriggerUserID:       sendUID,
		ObjectID:            qid,
		ReceiverUserID:      recUID,
		Type:                1,
		Title:               title,
		ObjectType:          constant.QuestionObjectType,
		NotificationAction:  action,
		NoNeedPushAllFollow: false,
		ExtraInfo: map[string]string{
			"Integral": strconv.Itoa(int(getPoint)),
			"Pay":      strconv.Itoa(int(pay)),
		},
	})
}

func (ab *assetBunRepo) OperateScoreNotifySend(ctx context.Context, queue notice_queue.NotificationQueueService, sendUID string, qid string, recUID string, title string, action string, pay int, getPoint int) {
	queue.Send(ctx, &schema.NotificationMsg{
		TriggerUserID:       sendUID,
		ObjectID:            qid,
		ReceiverUserID:      recUID,
		Type:                1,
		Title:               title,
		ObjectType:          constant.QuestionObjectType,
		NotificationAction:  action,
		NoNeedPushAllFollow: true,
		ExtraInfo: map[string]string{
			"Integral": strconv.Itoa(int(getPoint)),
			"Pay":      strconv.Itoa(int(pay)),
		},
	})
}

func (ab *assetBunRepo) GetRealDownloadScore(ctx context.Context, userID string, score int) int {
	groups, _ := ab.GetVIPInfo(ctx, userID)
	ratio := groups.Infos.DownloadScoreRatio
	if ratio > 100 {
		ratio = 100
	}
	return int(math.Round(float64(score) - float64(score)*(float64(ratio)/100.0)))
}

func (ab *assetBunRepo) GetVIPInfo(ctx context.Context, userID string) (*assetbun.Groups, error) {
	userInfo, err := GetAbUser(ctx, ab, userID)
	if err != nil {
		return nil, err
	}
	groupId := userInfo.GroupID
	groups := &assetbun.Groups{}
	_, err = ab.data.DB.Context(ctx).Where("id = ?", groupId).Get(groups)
	var op assetbun.GroupOption

	// 解析JSON字符串到结构体
	err = json.Unmarshal([]byte(groups.Options), &op)
	groups.Infos = op
	// 积分提取的比率
	settings := &assetbun.Settings{}
	_, err = ab.data.DB.Context(ctx).Where("name = ?", "share_score_rate").Get(settings)
	groups.BasePublishScoreRatio, _ = strconv.ParseUint(settings.Value, 10, 64)
	// 积分价格，0.1元可兑换的积分数量
	settings = &assetbun.Settings{}
	_, err = ab.data.DB.Context(ctx).Where("name = ?", "score_price").Get(settings)
	groups.Price, _ = strconv.ParseUint(settings.Value, 10, 64)
	return groups, err
}

func GetAssetBunAPIHost(ctx *gin.Context) string {
	host := ctx.Request.Host
	localhostIndex := indexOf(serviceURL, host)
	if localhostIndex != -1 {
		return assetBunAPIURL[localhostIndex]
	}
	return assetBunAPIURL[1]
}

func GetAssetBunLoginAPIHost(ctx *gin.Context) string {
	apiHost := GetAssetBunAPIHost(ctx) + "/user/session"
	return apiHost
}

// NewAuthRepo new repository
func NewAssetBunRepo(data *data.Data) assetbun.AssetBunRepo {
	return &assetBunRepo{
		data: data,
	}
}

func GetAbUser(ctx context.Context, ab *assetBunRepo, userID string) (*Users, error) {
	userInfo := &Users{}
	_, err := ab.data.DB.Context(ctx).Where("id = ?", userID).Get(userInfo)
	if err != nil {
		err = errors.InternalServer(reason.DatabaseError).WithError(err).WithStack()
		return nil, err
	}
	return userInfo, nil
}

func (ab *assetBunRepo) GetRealPublishScore(ctx context.Context, userID string, score int) int {
	groups, _ := ab.GetVIPInfo(ctx, userID)
	ratio := groups.BasePublishScoreRatio + uint64(groups.Infos.PublishScoreRatio)
	if ratio > 100 {
		ratio = 100
	}
	return int(math.Round(float64(score) * (float64(ratio) / 100.0)))
}

func (ab *assetBunRepo) OffsetScore(ctx context.Context, userID string, offsetNum int) error {
	userInfo, err := GetAbUser(ctx, ab, userID)
	userInfo.Score += offsetNum
	_, err = ab.data.DB.Context(ctx).Where("id = ?", userID).Cols("score").Update(userInfo)
	if err != nil {
		return err
	}
	return nil
}

func (ab *assetBunRepo) SubScore(ctx context.Context, userID string, subNum int) error {
	userInfo, err := GetAbUser(ctx, ab, userID)
	userInfo.Score -= subNum
	_, err = ab.data.DB.Context(ctx).Where("id = ?", userID).Cols("score").Update(userInfo)
	if err != nil {
		return err
	}
	return nil
}

func (ab *assetBunRepo) GetScore(ctx context.Context, userID string) (score int, err error) {
	userInfo, err := GetAbUser(ctx, ab, userID)
	if err != nil {
		return 0, err
	}
	return userInfo.Score, nil
}

// 同步Answer用户数据到AssetBun
func SyncUserToAB(ctx context.Context, engine *xorm.Engine, user *entity.User) {
	_, _ = engine.Transaction(func(session *xorm.Session) (interface{}, error) {
		session = session.Context(ctx)

		// 从UserSync表中获取用户
		userSync := new(Users)
		userSync.ID = user.ID
		userSync.CreatedAt = user.CreatedAt
		userSync.UpdatedAt = user.UpdatedAt
		userSync.DeletedAt = user.DeletedAt
		userSync.Nick = user.DisplayName
		if user.IsAdmin {
			userSync.GroupID = 1
		}
		userSync.Password = user.Pass
		if user.MailStatus == entity.EmailStatusAvailable {
			userSync.Status = 0
		}
		userSync.Email = user.EMail
		userSync.Avatar = user.Avatar
		if _, err := session.Insert(userSync); err != nil {
			return nil, err
		}

		// 提交事务
		if err := session.Commit(); err != nil {
			return nil, err
		}
		return nil, nil
	})
}

func UpdateEmail(ctx context.Context, engine *xorm.Engine, userID, email string) {
	_, _ = engine.Transaction(func(session *xorm.Session) (interface{}, error) {
		session = session.Context(ctx)
		_, err := engine.Context(ctx).Where("id = ?", userID).Update(&Users{Email: email})
		if err != nil {
			return nil, err
		}
		return nil, nil
	})

}

func UpdatePassword(ctx context.Context, engine *xorm.Engine, userID, pass string) {
	_, _ = engine.Transaction(func(session *xorm.Session) (interface{}, error) {
		session = session.Context(ctx)
		_, err := engine.Context(ctx).Where("id = ?", userID).Cols("password").Update(&Users{Password: pass})
		if err != nil {
			return nil, err
		}
		return nil, nil
	})
}

func UpdateEmailStatus(ctx context.Context, engine *xorm.Engine, userID string, emailStatus int) {
	_, _ = engine.Transaction(func(session *xorm.Session) (interface{}, error) {
		session = session.Context(ctx)
		status := 1
		if emailStatus == entity.EmailStatusToBeVerified {
			status = 1
		} else if emailStatus == entity.EmailStatusAvailable {
			status = 0
		}
		cond := &Users{Status: status}
		_, err := engine.Context(ctx).Where("id = ?", userID).Cols("status").Update(cond)
		if err != nil {
			return nil, err
		}
		return nil, nil
	})
}

func SyncUsers(ctx context.Context, engine *xorm.Engine) {
	_, _ = engine.Transaction(func(session *xorm.Session) (interface{}, error) {
		session = session.Context(ctx)
		users := make([]Users, 0)
		if err := session.Find(&users); err != nil {
			return nil, err
		}

		// 遍历User表中的记录
		for _, user := range users {
			// 根据email查找UserSync表中的记录
			userSync := new(entity.User)
			has, err := session.Where("e_mail = ?", user.Email).Get(userSync)
			if err != nil {
				return nil, err
			} else if has {
				// 如果UserSync表中有对应的记录，更新UserSync表中的其他字段
				// 假设我们要同步的字段是Nickname
				userSync.ID = user.ID
				userSync.Pass = user.Password
				userSync.IsAdmin = user.GroupID == 1
				userSync.CreatedAt = user.CreatedAt
				userSync.UpdatedAt = user.UpdatedAt
				userSync.DeletedAt = user.DeletedAt
				if user.Status == 0 {
					userSync.MailStatus = entity.EmailStatusAvailable
					userSync.Status = 1
					userSync.Rank = 1
				}
				if _, err := session.ID(userSync.ID).Update(userSync); err != nil {
					return nil, err
				}
			} else {
				has, err = session.Where("username = ?", user.Nick).Get(userSync)
				nickName := user.Nick
				if has {
					nickName += "_answer"
				}
				userSync.ID = user.ID
				// 如果UserSync表中没有对应的记录，创建新记录
				userSync.EMail = user.Email
				userSync.CreatedAt = user.CreatedAt
				userSync.UpdatedAt = user.UpdatedAt
				userSync.DeletedAt = user.DeletedAt
				userSync.Username = nickName
				userSync.DisplayName = nickName
				userSync.Pass = user.Password
				userSync.IsAdmin = user.GroupID == 1
				if user.Status == 0 {
					userSync.MailStatus = entity.EmailStatusAvailable
					userSync.Status = 1
					userSync.Rank = 1
				}
				if _, err := session.Insert(userSync); err != nil {
					return nil, err
				}
				// 插入角色数据
				roleType := 1
				if userSync.IsAdmin {
					roleType = 2
				}
				userRole := &entity.UserRoleRel{
					UserID: user.ID,
					RoleID: roleType,
				}
				engine.Context(ctx).Insert(userRole)
			}
		}

		// 提交事务
		if err := session.Commit(); err != nil {
			return nil, err
		}
		return nil, nil
	})
}

// 同步assetbun与answer的所有用户数据表，一般为answer init时候进行
func (ab *assetBunRepo) SyncUsers(ctx context.Context) {
	SyncUsers(ctx, ab.data.DB)
}
