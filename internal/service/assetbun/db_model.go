package assetbun

import "time"

type Folders struct {
	ID        int64     `xorm:"not null pk autoincr BIGINT(20) id"`
	CreatedAt time.Time `xorm:"created TIMESTAMP created_at"`
	UpdatedAt time.Time `xorm:"updated TIMESTAMP updated_at"`
	DeletedAt time.Time `xorm:"TIMESTAMP deleted_at"`
	Name      string    `xorm:"not null default '' VARCHAR(255) name"`
	OwnerID   string    `xorm:"not null default 0 BIGINT(20) owner_id"`
	PolicyID  int64     `xorm:"not null default 0 BIGINT(20) policy_id"`
}

type Files struct {
	ID         string    `xorm:"not null pk autoincr BIGINT(20) id"`
	CreatedAt  time.Time `xorm:"created TIMESTAMP created_at"`
	UpdatedAt  time.Time `xorm:"updated TIMESTAMP updated_at"`
	DeletedAt  time.Time `xorm:"TIMESTAMP deleted_at"`
	Name       string    `xorm:"not null default '' VARCHAR(255) name"`
	SourceName string    `xorm:"not null default '' VARCHAR(255) source_name"`
	UserID     string    `xorm:"not null default 0 BIGINT(20) user_id"`
	PicInfo    string    `xorm:"not null default '' VARCHAR(255) pic_info"`
	Size       int64     `xorm:"not null default 0 BIGINT(20) size"`
	FolderID   int64     `xorm:"not null default 0 BIGINT(20) folder_id"`
	PolicyID   int       `xorm:"not null default 3 BIGINT(20) policy_id"`
	MetaData   string    `xorm:"not null default '' VARCHAR(255) metadata"`
}

type Shares struct {
	ID              string     `xorm:"not null pk autoincr BIGINT(20) id"`
	CreatedAt       time.Time  `xorm:"created TIMESTAMP created_at"`
	UpdatedAt       time.Time  `xorm:"updated TIMESTAMP updated_at"`
	DeletedAt       time.Time  `xorm:"TIMESTAMP deleted_at"`
	Password        string     `xorm:"not null default '' VARCHAR(255) password"`
	IsDir           bool       `xorm:"not null default 0 TINYINT(4) is_dir"`
	UserID          int        `xorm:"not null default 0 BIGINT(20) user_id"`
	SourceID        int        `xorm:"not null default 0 BIGINT(20) source_id"`
	Views           int        `xorm:"not null default 0 BIGINT(20) views"`
	Downloads       int        `xorm:"not null default 0 BIGINT(20) downloads"`
	RemainDownloads int        `xorm:"not null default 0 BIGINT(20) remain_downloads"`
	Expires         *time.Time `xorm:"TIMESTAMP expires"`
	Score           int        `xorm:"not null default 0 BIGINT(20) score"`
	PreviewEnabled  bool       `xorm:"not null default 0 TINYINT(4) preview_enabled"`
	SourceName      string     `xorm:"not null default '' VARCHAR(255) source_name"`
	SourceLink      string     `xorm:"not null default '' VARCHAR(255) source_link"`
	Status          uint       `xorm:"not null default 1 INT(11) status"`
	FailReason      string     `xorm:"not null default '' VARCHAR(255) fail_reason"`
}

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
	Status          int   `xorm:"not null default 1 TINYINT(4) status"`
	AuditFree       bool  `xorm:"not null default 0 TINYINT(4) audit_free"`
	Storage         int64 `xorm:"not null default 0 BIGINT(20) storage"`
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

// 一些基础配置，比如积分分享到账比率等
type Settings struct {
	Id    int64 `xorm:"pk autoincr"`
	Name  string
	Value string
}

// Group 用户组模型
type Groups struct {
	Id            int64 `xorm:"pk autoincr"`
	Name          string
	Policies      string
	MaxStorage    uint64
	ShareEnabled  bool `xorm:"index"`
	WebDAVEnabled bool `xorm:"index"`
	SpeedLimit    int
	// 积分分享到账的基础比率，默认为70%
	BasePublishScoreRatio uint64 `xorm:"-"`
	// 购买一积分需要多少钱，需要除以100才是兑换的比率，如：为10，则购买1积分需要0.1元
	Price   uint64 `xorm:"-"`
	Options string
	Infos   GroupOption `xorm:"-"`
}

// GroupOption 用户组其他配置
type GroupOption struct {
	ArchiveDownload    bool   `json:"archive_download"`
	ArchiveTask        bool   `json:"archive_task"`
	CompressSize       uint64 `json:"compress_size"`
	DecompressSize     uint64 `json:"decompress_size"`
	OneTimeDownload    bool   `json:"one_time_download"`
	ShareDownload      bool   `json:"share_download"`
	ShareFree          bool   `json:"share_free"`
	PublishScoreRatio  uint   `json:"publish_score_ratio"`
	DownloadScoreRatio uint   `json:"download_score_ratio"`
	Aria2              bool   `json:"aria2"`
	Relocate           bool   `json:"relocate"`
	SourceBatchSize    int    `json:"source_batch"`
	RedirectedSource   bool   `json:"redirected_source"`
	Aria2BatchSize     int    `json:"aria2_batch"`
	SelectNode         bool   `json:"select_node"`
	AdvanceDelete      bool   `json:"advance_delete"`
}
