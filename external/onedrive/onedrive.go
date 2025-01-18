/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package onedrive

import (
	"bytes"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/apache/incubator-answer-plugins/storage-aliyunoss/i18n"
	"github.com/apache/incubator-answer/external/util"
	"github.com/apache/incubator-answer/external/util/request"
	"github.com/apache/incubator-answer/plugin"
)

const (
	// 10MB
	defaultMaxFileSize int64 = 10 * 1024 * 1024
)

type Storage struct {
	Config *StorageConfig
}

type StorageConfig struct {
	Endpoint        string `json:"endpoint"`
	BucketName      string `json:"bucket_name"`
	ObjectKeyPrefix string `json:"object_key_prefix"`
	AccessKeyID     string `json:"access_key_id"`
	AccessKeySecret string `json:"access_key_secret"`
	VisitUrlPrefix  string `json:"visit_url_prefix"`
	MaxFileSize     string `json:"max_file_size"`
}

// ProgressCompose 表示单个进度项
type ProgressCompose struct {
	Size    int64   // 总字节数
	Loaded  int64   // 已加载的字节数
	Percent float64 // 加载百分比 (0.0 到 1.0)
	// FromCache bool    // 是否来自缓存 (可选)
}

// UploadProgress 表示总的上传进度
type UploadProgress struct {
	Total  ProgressCompose   // 总进度
	Chunks []ProgressCompose // 各分块的进度 (可选)
}

type Progress struct {
	total  float64
	loaded float64
}

func init() {
	plugin.Register(&Storage{
		Config: &StorageConfig{},
	})
}

func (s *Storage) Info() plugin.Info {
	info := &util.Info{}
	info.SlugName = "onedrive"
	info.Type = "storage"
	info.Version = "OneDirve"
	info.Author = "xiangkuizheng"
	info.Link = "https://assetbun.com"

	return plugin.Info{
		Name:        plugin.MakeTranslator(i18n.InfoName),
		SlugName:    info.SlugName,
		Description: plugin.MakeTranslator(i18n.InfoDescription),
		Author:      info.Author,
		Version:     info.Version,
		Link:        info.Link,
	}
}

// TaskData 结构体表示要发送的数据
type TaskData struct {
	Path         string `json:"path"`
	Size         int64  `json:"size"`
	Name         string `json:"name"`
	GetLink      bool   `json:"get_link"`
	Tag          string `json:"tag"`
	PolicyID     string `json:"policy_id"`     // 假设 policy_id 是整数类型
	LastModified int64  `json:"last_modified"` // 假设 last_modified 是 Unix 时间戳
}

// 定义与JSON结构相匹配的Go结构体
type UploadSessionResponse struct {
	Code int    `json:"code"`
	Data Data   `json:"data"`
	Msg  string `json:"msg"`
}

type Data struct {
	SessionID  string   `json:"sessionID"`
	ChunkSize  int      `json:"chunkSize"`
	Expires    int64    `json:"expires"`
	UploadURLs []string `json:"uploadURLs"`
	FileLink   string   `json:"fileLink"`
	FileID     string   `json:"fileID"`
}

type RespBody struct {
	// http code
	Code int `json:"code"`
	// response message
	Message string `json:"msg"`
	// response data
	Data interface{} `json:"data"`
}

// OneDriveCallback OneDrive 客户端回调正文
type OneDriveCallback struct {
	Permalink bool `form:"permalink"`
}

// ShareCreateService 创建新分享服务
type ShareCreateService struct {
	SourceID        string `json:"id" binding:"required"`
	IsDir           bool   `json:"is_dir"`
	QuestHide       bool   `json:"is_hide"`
	Password        string `json:"password" binding:"max=255"`
	RemainDownloads int    `json:"downloads"`
	Expire          int    `json:"expire"`
	Score           int    `json:"score" binding:"gte=0"`
	Preview         bool   `json:"preview"`
	SourceLink      string `json:"sourceLink"`
}

var ctxUUIDKey = "ctxUuidKey"

func (s *Storage) UploadFile(ctx *plugin.GinContext, source plugin.UploadSource) (resp plugin.UploadFileResponse) {
	//logFile := filepath.Join("./", "app.log") // 假设日志文件在项目根目录下的 logs 文件夹中
	//err := util.InitGlobalLogger(logFile)
	// if err != nil {
	// 	log.Fatalf("create logger failed: %v", err)
	// }

	resp = plugin.UploadFileResponse{}
	file, err := ctx.FormFile("file")
	path := ctx.PostForm("path")
	tag := ctx.PostForm("tag")
	host := ctx.PostForm("host")
	userName := ctx.PostForm("userName")
	maxWidth := ctx.PostForm("maxWidth")
	// util.GlobalLogger.Info("OneDrive参数列表: ", path, tag, host, userName, maxWidth)
	if err != nil {
		resp.OriginalError = fmt.Errorf("get upload file failed: %v", err)
		resp.DisplayErrorMsg = plugin.MakeTranslator(i18n.ErrFileNotFound)
		// util.GlobalLogger.Error(err)
		return resp
	}

	if file.Size > s.maxFileSizeLimit() {
		resp.OriginalError = fmt.Errorf("file size too large")
		resp.DisplayErrorMsg = plugin.MakeTranslator(i18n.ErrOverFileSizeLimit)
		return resp
	}

	src, err := file.Open()
	if err != nil {
		ctx.String(http.StatusInternalServerError, "Error opening file: %s", err.Error())
		// util.GlobalLogger.Error(err)
		return
	}
	defer src.Close()
	var buf bytes.Buffer
	if !util.IsImageFile(file.Filename) {
		// 使用 io.Copy 从 file 复制数据到 buf
		if _, err := io.Copy(&buf, src); err != nil {
			// util.GlobalLogger.Error(err)
			return
		}
	} else {
		// Decode the image
		//img, _, err := image.Decode(src)
		//if err != nil {
		//	ctx.String(http.StatusInternalServerError, "Error decoding image: %s", err.Error())
		//	return
		//}
		markText := "@" + userName
		// userInfo, exist := ctx.Get(ctxUUIDKey)

		currWidth, err := strconv.Atoi(maxWidth)
		if err != nil {
			// util.GlobalLogger.Error(err)
			currWidth = 550
		}
		// Add watermark
		buffer, _ := request.GenerateThumbnailWithWatermark(file, currWidth, markText)
		buf = *buffer
	}
	//fileHeader, err := bufferToMultipartFile(buf, file.Filename, contentType)
	//if err != nil {
	//	ctx.String(http.StatusInternalServerError, "Error converting buffer to multipart file header: %s", err.Error())
	//	return
	//}

	taskData := TaskData{
		Path:         path,
		Tag:          tag,
		GetLink:      true,
		Size:         int64(buf.Len()),
		Name:         file.Filename,
		PolicyID:     "yZuZ",
		LastModified: time.Now().Unix(), // this.task.file.lastModified 的示例值 (Unix 时间戳)
	}
	sessionToken, _ := ctx.Cookie("cloudreve-session")
	body, _ := json.Marshal(taskData)
	// 创建请求体
	bodyRes := bytes.NewBuffer(body)
	headers := map[string]string{
		"Content-Type": "application/json",
	}
	// 创建Cookies
	cookies := []*http.Cookie{
		&http.Cookie{Name: "cloudreve-session", Value: sessionToken, Path: "/", HttpOnly: true, Secure: true},
	}
	respRes, err := request.PutAction(host+"/api/v3/file/upload", bodyRes, headers, cookies)
	if err != nil {
		// util.GlobalLogger.Error(err)
		fmt.Println("Error:", err)
		return
	}
	defer respRes.Body.Close()

	// 读取响应
	responseBody, err := ioutil.ReadAll(respRes.Body)
	if err != nil {
		// util.GlobalLogger.Error(err)
		fmt.Println("Error reading response:", err)
		return
	}

	respVal := string(responseBody)
	// 打印响应状态和内容
	// fmt.Println("UploadSessionResponse status:", respRes.Status)
	// fmt.Println("UploadSessionResponse body:", respVal)
	var response UploadSessionResponse
	err = json.Unmarshal([]byte(respVal), &response)
	if err != nil {
		// util.GlobalLogger.Error(err)
		fmt.Println("Error convert response:", err)
		return
	}
	// util.GlobalLogger.Info("创建UploadSession: ", respVal)
	if response.Code == 0 {
		if response.Data.FileLink != "" {
			resp.FullURL = response.Data.FileLink
		} else {
			uploadUrl := response.Data.UploadURLs[0]
			if util.IsImageFile(taskData.Name) || util.IsVideoFile(taskData.Name) {
				// request.UploadChunksFromBuffer(ctx, uploadUrl, buf, response.Data.SessionID, host)
				resp.FullURL = request.UploadChunksFromBuffer(ctx, uploadUrl, &buf, response.Data.SessionID, host) // request.UploadChunksFromFile(ctx, uploadUrl, fileHeader, response.Data.SessionID, host)
			} else {
				go request.UploadChunksFromBuffer(ctx, uploadUrl, &buf, response.Data.SessionID, host)
				shareCreate := ShareCreateService{
					SourceID:        response.Data.FileID,
					IsDir:           false,
					QuestHide:       true,
					RemainDownloads: -1,
					Preview:         true,
					Score:           0,
				}
				body, _ = json.Marshal(shareCreate)
				// 创建请求体
				bodyRes = bytes.NewBuffer(body)
				respRes, err := request.PostAction(host+"/api/v3/share", bodyRes, headers, cookies)
				if err != nil {
					fmt.Println("Error:", err)
					return
				}
				defer respRes.Body.Close()
				responseBody, err = ioutil.ReadAll(respRes.Body)
				if err != nil {
					fmt.Println("Error reading response:", err)
					return
				}

				respVal = string(responseBody)
				var response RespBody
				err = json.Unmarshal([]byte(respVal), &response)
				resp.FullURL = response.Data.(string)
			}
		}
		// if resp.Data

		// var uploadProgress UploadProgress
		//chunks, _ := GetChunks(file, int64(response.Data.ChunkSize))
		//chunkProgress, uploadProgress := InitChunkProgresses(file, chunks)
		//for i := 0; i < len(chunks); i++ {
		//	if chunkProgress[i].Loaded < len(chunks[i]) || len(chunks[i]) == 0 {
		//
		//	}
		//}
	}
	return resp
}

func (s *Storage) createObjectKey(originalFilename string, source plugin.UploadSource) string {
	ext := strings.ToLower(filepath.Ext(originalFilename))
	randomString := s.randomObjectKey()
	switch source {
	case plugin.UserAvatar:
		return s.Config.ObjectKeyPrefix + "avatar/" + randomString + ext
	case plugin.UserPost:
		return s.Config.ObjectKeyPrefix + "post/" + randomString + ext
	case plugin.AdminBranding:
		return s.Config.ObjectKeyPrefix + "branding/" + randomString + ext
	default:
		return s.Config.ObjectKeyPrefix + "other/" + randomString + ext
	}
}

func (s *Storage) randomObjectKey() string {
	bytes := make([]byte, 4)
	_, _ = rand.Read(bytes)
	return fmt.Sprintf("%d", time.Now().UnixNano()) + hex.EncodeToString(bytes)
}

func (s *Storage) CheckFileType(originalFilename string, source plugin.UploadSource) bool {
	ext := strings.ToLower(filepath.Ext(originalFilename))
	if _, ok := plugin.DefaultFileTypeCheckMapping[source][ext]; ok {
		return true
	}
	return false
}

func (s *Storage) maxFileSizeLimit() int64 {
	if len(s.Config.MaxFileSize) == 0 {
		return defaultMaxFileSize
	}
	limit, _ := strconv.Atoi(s.Config.MaxFileSize)
	if limit <= 0 {
		return defaultMaxFileSize
	}
	return int64(limit) * 1024 * 1024
}

func (s *Storage) ConfigFields() []plugin.ConfigField {
	return []plugin.ConfigField{
		{
			Name:        "endpoint",
			Type:        plugin.ConfigTypeInput,
			Title:       plugin.MakeTranslator(i18n.ConfigEndpointTitle),
			Description: plugin.MakeTranslator(i18n.ConfigEndpointDescription),
			Required:    true,
			UIOptions: plugin.ConfigFieldUIOptions{
				InputType: plugin.InputTypeText,
			},
			Value: s.Config.Endpoint,
		},
		{
			Name:        "bucket_name",
			Type:        plugin.ConfigTypeInput,
			Title:       plugin.MakeTranslator(i18n.ConfigBucketNameTitle),
			Description: plugin.MakeTranslator(i18n.ConfigBucketNameDescription),
			Required:    true,
			UIOptions: plugin.ConfigFieldUIOptions{
				InputType: plugin.InputTypeText,
			},
			Value: s.Config.BucketName,
		},
		{
			Name:        "object_key_prefix",
			Type:        plugin.ConfigTypeInput,
			Title:       plugin.MakeTranslator(i18n.ConfigObjectKeyPrefixTitle),
			Description: plugin.MakeTranslator(i18n.ConfigObjectKeyPrefixDescription),
			Required:    false,
			UIOptions: plugin.ConfigFieldUIOptions{
				InputType: plugin.InputTypeText,
			},
			Value: s.Config.ObjectKeyPrefix,
		},
		{
			Name:        "access_key_id",
			Type:        plugin.ConfigTypeInput,
			Title:       plugin.MakeTranslator(i18n.ConfigAccessKeyIdTitle),
			Description: plugin.MakeTranslator(i18n.ConfigAccessKeyIdDescription),
			Required:    true,
			UIOptions: plugin.ConfigFieldUIOptions{
				InputType: plugin.InputTypeText,
			},
			Value: s.Config.AccessKeyID,
		},
		{
			Name:        "access_key_secret",
			Type:        plugin.ConfigTypeInput,
			Title:       plugin.MakeTranslator(i18n.ConfigAccessKeySecretTitle),
			Description: plugin.MakeTranslator(i18n.ConfigAccessKeySecretDescription),
			Required:    true,
			UIOptions: plugin.ConfigFieldUIOptions{
				InputType: plugin.InputTypeText,
			},
			Value: s.Config.AccessKeySecret,
		},
		{
			Name:        "visit_url_prefix",
			Type:        plugin.ConfigTypeInput,
			Title:       plugin.MakeTranslator(i18n.ConfigVisitUrlPrefixTitle),
			Description: plugin.MakeTranslator(i18n.ConfigVisitUrlPrefixDescription),
			Required:    true,
			UIOptions: plugin.ConfigFieldUIOptions{
				InputType: plugin.InputTypeText,
			},
			Value: s.Config.VisitUrlPrefix,
		},
		{
			Name:        "max_file_size",
			Type:        plugin.ConfigTypeInput,
			Title:       plugin.MakeTranslator(i18n.ConfigMaxFileSizeTitle),
			Description: plugin.MakeTranslator(i18n.ConfigMaxFileSizeDescription),
			Required:    false,
			UIOptions: plugin.ConfigFieldUIOptions{
				InputType: plugin.InputTypeNumber,
			},
			Value: s.Config.MaxFileSize,
		},
	}
}

func (s *Storage) ConfigReceiver(config []byte) error {
	c := &StorageConfig{}
	_ = json.Unmarshal(config, c)
	s.Config = c
	return nil
}
