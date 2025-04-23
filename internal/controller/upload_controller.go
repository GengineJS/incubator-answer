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

package controller

import (
	"fmt"
	"image"
	"mime/multipart"
	"net/url"

	"github.com/apache/incubator-answer/internal/base/handler"
	"github.com/apache/incubator-answer/internal/base/reason"
	"github.com/apache/incubator-answer/internal/schema"
	"github.com/apache/incubator-answer/internal/service/uploader"
	"github.com/apache/incubator-answer/pkg/converter"
	"github.com/gin-gonic/gin"
	"github.com/segmentfault/pacman/errors"
)

const (
	// file is uploaded by markdown(or something else) editor
	fileFromPost = "post"
	// file is used to change the user's avatar
	fileFromAvatar = "avatar"
	// file is logo/icon images
	fileFromBranding = "branding"
)

// UploadController upload controller
type UploadController struct {
	uploaderService uploader.UploaderService
}

// NewUploadController new controller
func NewUploadController(uploaderService uploader.UploaderService) *UploadController {
	return &UploadController{
		uploaderService: uploaderService,
	}
}

func appendDimensionsToURL(imageURL string, width, height int) string {
	u, err := url.Parse(imageURL)
	if err != nil {
		return imageURL // 如果解析失败，返回原始 URL
	}
	query := u.Query()
	query.Set("width", fmt.Sprintf("%d", width))
	query.Set("height", fmt.Sprintf("%d", height))
	u.RawQuery = query.Encode()
	return u.String()
}

func getImageDimensionsFromFile(file multipart.File) (int, int, error) {
	// 使用 image.DecodeConfig 获取图片的宽高
	config, _, err := image.DecodeConfig(file)
	if err != nil {
		return 0, 0, err
	}
	return config.Width, config.Height, nil
}

func isImageContentType(contentType string) bool {
	switch contentType {
	case "image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp",
		"image/tiff", "image/svg+xml", "image/x-icon", "image/heic", "image/avif":
		return true
	default:
		return false
	}
}

// UploadFile upload file
// @Summary upload file
// @Description upload file
// @Tags Upload
// @Accept multipart/form-data
// @Security ApiKeyAuth
// @Param source formData string true "identify the source of the file upload" Enums(post, avatar, branding)
// @Param file formData file true "file"
// @Success 200 {object} handler.RespBody{data=string}
// @Router /answer/api/v1/file [post]
func (uc *UploadController) UploadFile(ctx *gin.Context) {
	var (
		url string
		err error
	)

	source := ctx.PostForm("source")
	isVditor := ctx.PostForm("isVditor")
	name := ctx.PostForm("name")

	// 获取上传的文件
	file, header, err := ctx.Request.FormFile("file")
	if err != nil {
		handler.HandleResponse(ctx, errors.BadRequest(reason.UploadFileSourceUnsupported), nil)
		return
	}
	defer file.Close()

	// 检查文件是否为图片
	contentType := header.Header.Get("Content-Type")
	width, height := 0, 0
	if isImageContentType(contentType) {
		// 如果是图片文件，获取宽高
		width, height, _ = getImageDimensionsFromFile(file)
	}

	switch source {
	case fileFromAvatar:
		url, err = uc.uploaderService.UploadAvatarFile(ctx)
	case fileFromPost:
		url, err = uc.uploaderService.UploadPostFile(ctx)
	case fileFromBranding:
		url, err = uc.uploaderService.UploadBrandingFile(ctx)
	default:
		handler.HandleResponse(ctx, errors.BadRequest(reason.UploadFileSourceUnsupported), nil)
		return
	}
	if err != nil {
		handler.HandleResponse(ctx, err, nil)
		return
	}
	if width > 0 && height > 0 {
		// 将宽高信息附加到 URL 中
		url = appendDimensionsToURL(url, width, height)
	}
	if isVditor == "true" {
		responseData := map[string]interface{}{
			"succMap": make(map[string]string), // 更具体的类型
		}
		responseData["succMap"].(map[string]string)[name] = url
		handler.HandleResponse(ctx, err, responseData)
		return
	}
	handler.HandleResponse(ctx, err, url)
}

// PostRender render post content
// @Summary render post content
// @Description render post content
// @Tags Upload
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param data body schema.PostRenderReq true "PostRenderReq"
// @Success 200 {object} handler.RespBody
// @Router /answer/api/v1/post/render [post]
func (uc *UploadController) PostRender(ctx *gin.Context) {
	req := &schema.PostRenderReq{}
	if handler.BindAndCheck(ctx, req) {
		return
	}
	handler.HandleResponse(ctx, nil, converter.Markdown2HTML(req.Content))
}
