package assetbun

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
