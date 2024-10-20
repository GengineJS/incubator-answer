package assetbun

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/apache/incubator-answer/internal/base/constant"
	"github.com/apache/incubator-answer/internal/base/data"
	"github.com/apache/incubator-answer/internal/base/reason"
	"github.com/apache/incubator-answer/internal/entity"
	"github.com/apache/incubator-answer/internal/repo/unique"
	"github.com/apache/incubator-answer/internal/schema"
	"github.com/apache/incubator-answer/internal/service/assetbun"
	"github.com/apache/incubator-answer/internal/service/notice_queue"
	"github.com/apache/incubator-answer/pkg/htmltext"
	"github.com/gin-gonic/gin"
	"github.com/segmentfault/pacman/errors"
	"github.com/speps/go-hashids"
	"math"
	"strconv"
	"time"
	"xorm.io/xorm"
)

// 定义请求的URL
var assetBunAPIURL = []string{"http://localhost:5212/api/v3", "https://cloud.assetbun.com/api/v3"}
var serviceURL = []string{"localhost", "ai.assetbun.com"}

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

func GetAbUser(ctx context.Context, ab *assetBunRepo, userID string) (*assetbun.Users, error) {
	userInfo := &assetbun.Users{}
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

func createRefFile(ctx context.Context, engine *xorm.Engine, user *assetbun.Users) error {
	defaultFolder := &assetbun.Folders{}
	defaultFolder.Name = "/"
	defaultFolder.OwnerID = user.ID
	defaultFolder.CreatedAt = time.Now()
	defaultFolder.UpdatedAt = time.Now()
	_, err := engine.Context(ctx).Insert(defaultFolder)

	settings := &assetbun.Settings{}
	_, err = engine.Context(ctx).Where("name = ?", "initial_files").Get(settings)
	if err != nil {
		return err
	}
	if settings.Value != "" {
		initialFileIDs := make([]uint, 0)
		if err := json.Unmarshal([]byte(settings.Value), &initialFileIDs); err != nil {
			return err
		}
		files := make([]*assetbun.Files, 0)
		for _, id := range initialFileIDs {
			file := &assetbun.Files{}
			engine.Context(ctx).Where("id = ?", id).Get(file)
			saveFile := &assetbun.Files{}
			saveFile.CreatedAt = time.Now()
			saveFile.UpdatedAt = time.Now()
			saveFile.UserID = user.ID
			saveFile.FolderID = defaultFolder.ID
			saveFile.Name = file.Name
			saveFile.SourceName = file.SourceName
			saveFile.PicInfo = file.PicInfo
			saveFile.PolicyID = file.PolicyID
			saveFile.MetaData = file.MetaData
			saveFile.Size = file.Size
			user.Storage += saveFile.Size
			files = append(files, saveFile)
		}
		if len(files) > 0 {
			_, err = engine.Context(ctx).InsertMulti(files)
		}
	}
	return nil
}

// 同步Answer用户数据到AssetBun
func SyncUserToAB(ctx context.Context, engine *xorm.Engine, user *entity.User) {
	// 从UserSync表中获取用户
	userSync := new(assetbun.Users)
	userSync.ID = user.ID
	userSync.CreatedAt = user.CreatedAt
	userSync.UpdatedAt = user.UpdatedAt
	userSync.DeletedAt = user.DeletedAt
	userSync.Nick = user.DisplayName
	// 普通用户
	userSync.GroupID = 2
	if user.IsAdmin {
		userSync.GroupID = 1
	}
	userSync.Password = user.Pass
	if user.MailStatus == int(entity.EmailStatusAvailable) {
		// 0：Active 账户正常状态
		// 1：NotActivicated 未激活
		// 2：Baned 被封禁
		// 3：OveruseBaned 超额使用被封禁
		userSync.Status = 0
	}
	userSync.Email = user.EMail
	userSync.Avatar = user.Avatar
	userSync.Storage = 0
	userSync.Options = "{}"
	createRefFile(ctx, engine, userSync)
	engine.Context(ctx).Insert(userSync)
}

func UpdateEmail(ctx context.Context, engine *xorm.Engine, userID, email string) {
	_, _ = engine.Transaction(func(session *xorm.Session) (interface{}, error) {
		session = session.Context(ctx)
		_, err := engine.Context(ctx).Where("id = ?", userID).Update(&assetbun.Users{Email: email})
		if err != nil {
			return nil, err
		}
		return nil, nil
	})

}

func UpdatePassword(ctx context.Context, engine *xorm.Engine, userID, pass string) {
	_, _ = engine.Transaction(func(session *xorm.Session) (interface{}, error) {
		session = session.Context(ctx)
		_, err := engine.Context(ctx).Where("id = ?", userID).Cols("password").Update(&assetbun.Users{Password: pass})
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
		cond := &assetbun.Users{Status: status}
		_, err := engine.Context(ctx).Where("id = ?", userID).Cols("status").Update(cond)
		if err != nil {
			return nil, err
		}
		return nil, nil
	})
}

// ID类型
const (
	ShareID  = iota // 分享
	UserID          // 用户
	FileID          // 文件ID
	FolderID        // 目录ID
	TagID           // 标签ID
	PolicyID        // 存储策略ID
	SourceLinkID
)

// HashEncode 对给定数据计算HashID
func HashEncode(v []int) (string, error) {
	hd := hashids.NewData()
	hd.Salt = "I64ZDekUUHT4HMyEiK9emnQD4eFZeDgXHR8WrV97o7PFCFwv432FoOVTqwwDCVtK"

	h, err := hashids.NewWithData(hd)
	if err != nil {
		return "", err
	}

	id, err := h.Encode(v)
	if err != nil {
		return "", err
	}
	return id, nil
}

// HashID 计算数据库内主键对应的HashID
func HashID(id int, t int) string {
	v, _ := HashEncode([]int{int(id), t})
	return v
}

func SyncShares(ctx context.Context, engine *xorm.Engine) {
	_, _ = engine.Transaction(func(session *xorm.Session) (interface{}, error) {
		session = session.Context(ctx)
		shares := make([]assetbun.Shares, 0)
		if err := session.Find(&shares); err != nil {
			return nil, err
		}
		uniqueIDRepo := unique.NewUniqueIDRepo(&data.Data{DB: engine})
		currentTime := time.Now()
		// 遍历share表中的记录
		for _, share := range shares {
			file := &assetbun.Files{}
			getFile, err := session.ID(share.SourceID).Get(file)
			// 已过期，被删除，过期，报错的查询不创建question条目
			if !share.DeletedAt.IsZero() || (share.Expires != nil && currentTime.After(*share.Expires)) || !getFile || err != nil {
				continue
			}
			question := &entity.Question{}
			q1Id, _ := uniqueIDRepo.GenUniqueIDStr(ctx, entity.Question{}.TableName())
			question.ID = q1Id
			question.UserID = strconv.Itoa(share.UserID)
			question.Score = share.Score // req.Score
			sid, _ := strconv.Atoi(share.ID)
			question.Title = share.SourceName
			hashedID := HashID(sid, ShareID)
			baseURL := "https://cloud.assetbun.com/s/"
			// 使用fmt.Sprintf来创建带有动态href属性的<a>标签
			link := fmt.Sprintf(`<a href="%s%s" target="_blank">点击访问资源地址</a>`, baseURL, hashedID)
			question.OriginalText = baseURL + hashedID
			question.ParsedText = link
			// question.ParsedText = req.HTML
			question.AcceptedAnswerID = "0"
			question.LastAnswerID = "0"
			question.LastEditUserID = "0"
			//question.PostUpdateTime = nil
			question.Status = entity.QuestionStatusPending
			question.RevisionID = "0"
			question.CreatedAt = share.CreatedAt
			question.UpdatedAt = share.CreatedAt
			question.PostUpdateTime = share.CreatedAt
			question.Pin = entity.QuestionUnPin
			question.Show = entity.QuestionHide
			if share.Status == 3 {
				question.Status = entity.QuestionStatusAvailable
				question.Show = entity.QuestionShow
			}
			question.ContentType = int(entity.TypeAssetBun)
			if _, err := session.Insert(question); err != nil {
				return nil, err
			}
			srcLink := `https://ai.assetbun.com/questions/` + question.ID + `/` + htmltext.UrlTitle(question.Title) + `?content_type=3`
			_, _ = session.ID(share.ID).Cols("source_link").Update(&assetbun.Shares{SourceLink: srcLink})
		}
		// 提交事务
		if err := session.Commit(); err != nil {
			return nil, err
		}
		return nil, nil
	})
}

func SyncUsers(ctx context.Context, engine *xorm.Engine) {
	_, _ = engine.Transaction(func(session *xorm.Session) (interface{}, error) {
		session = session.Context(ctx)
		users := make([]assetbun.Users, 0)
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
