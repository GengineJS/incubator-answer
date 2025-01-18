package request

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"github.com/apache/incubator-answer/external/util"
	"github.com/apache/incubator-answer/plugin"
	"golang.org/x/image/draw"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"mime/multipart"
	"net/http"
)

// PutAction 是一个执行HTTP PUT请求的函数
func PutAction(url string, body *bytes.Buffer, headers map[string]string, cookies []*http.Cookie) (*http.Response, error) {
	// 创建PUT请求
	req, err := http.NewRequest("PUT", url, body)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	// 设置请求头
	for key, value := range headers {
		req.Header.Set(key, value)
	}
	// 添加Cookies到请求
	for _, cookie := range cookies {
		req.AddCookie(cookie)
	}
	// 发送请求
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error sending request: %w", err)
	}

	return resp, nil
}

// PostAction 是一个执行HTTP PUT请求的函数
func PostAction(url string, body *bytes.Buffer, headers map[string]string, cookies []*http.Cookie) (*http.Response, error) {
	// 创建POST请求
	req, err := http.NewRequest("POST", url, body)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	// 设置请求头
	for key, value := range headers {
		req.Header.Set(key, value)
	}
	// 添加Cookies到请求
	for _, cookie := range cookies {
		req.AddCookie(cookie)
	}
	// 发送请求
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error sending request: %w", err)
	}

	return resp, nil
}

// GenerateThumbnailWithWatermark 生成缩略图并在其上添加水印
func GenerateThumbnailWithWatermark(fileHeader *multipart.FileHeader, maxWidth int, watermarkText string) (*bytes.Buffer, error) {
	file, err := fileHeader.Open()
	if err != nil {
		return nil, err
	}
	defer file.Close()

	img, _, err := image.Decode(file)
	if err != nil {
		return nil, err
	}

	originalBounds := img.Bounds()
	originalWidth := originalBounds.Dx()
	originalHeight := originalBounds.Dy()

	newWidth, newHeight := calculateNewSize(originalWidth, originalHeight, maxWidth)

	var thumbnail draw.Image
	if newWidth == originalWidth && newHeight == originalHeight {
		// 如果不需要调整大小，则直接使用原图
		thumbnail = image.NewRGBA(img.Bounds())
		draw.Copy(thumbnail, image.Point{}, img, img.Bounds(), draw.Src, nil)
	} else {
		// 创建新的图像并调整大小
		thumbnail = image.NewRGBA(image.Rect(0, 0, newWidth, newHeight))
		draw.CatmullRom.Scale(thumbnail, thumbnail.Bounds(), img, img.Bounds(), draw.Over, nil)
	}

	// 添加水印
	if watermarkText != "" {
		width, _ := DrawImageOnImageWithHeight(thumbnail, "./logo.png", 30)
		DrawTextOnImage(thumbnail, watermarkText, "./sySerif.ttf", 16, width)
	}

	// 将处理后的图像编码为 JPEG 格式
	buf := new(bytes.Buffer)
	if util.IsPngFile(fileHeader.Filename) {
		png.Encode(buf, thumbnail)
	} else {
		jpeg.Encode(buf, thumbnail, nil)
	}

	return buf, nil
}

// calculateNewSize 根据最大宽度计算新的尺寸，同时保持宽高比。
func calculateNewSize(originalWidth, originalHeight, maxWidth int) (int, int) {
	if originalWidth <= maxWidth {
		return originalWidth, originalHeight
	}
	ratio := float64(maxWidth) / float64(originalWidth)
	newWidth := maxWidth
	newHeight := int(float64(originalHeight) * ratio)
	return newWidth, newHeight
}

// UploadFileDirectly 一次性上传文件到 OneDrive
// fileHeader 是文件的 multipart.FileHeader 对象
// driveItemURL 是上传文件的目标 URL，通常是创建新文件或替换现有文件的 URL
func UploadFileDirectly(fileHeader *multipart.FileHeader, driveItemURL string) error {
	file, err := fileHeader.Open()
	if err != nil {
		return err
	}
	defer file.Close()

	// 读取整个文件内容
	fileContent, err := io.ReadAll(file)
	if err != nil {
		return err
	}

	// 构建上传请求
	req, err := http.NewRequest("PUT", driveItemURL, bytes.NewReader(fileContent))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/octet-stream") // 设置 Content-Type 为二进制流类型

	// 发送请求
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// 检查响应状态码
	if resp.StatusCode == 201 {
		// 201 Created，文件上传成功
		fmt.Println("File uploaded successfully")
		return nil
	} else {
		// 处理错误响应
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("error uploading file: %s", body)
	}
}

// UploadFileInChunks 将文件分块上传到 OneDrive
// fileHeader 是文件的 multipart.FileHeader 对象
// uploadUrl 是从 createUploadSession 调用中获取的上传 URL
func UploadFileInChunks(fileHeader *multipart.FileHeader, uploadUrl string) error {
	file, err := fileHeader.Open()
	if err != nil {
		// ctx.String(http.StatusInternalServerError, "Error opening file: %s", err.Error())
		return err
	}
	defer file.Close()
	fileSize := fileHeader.Size
	chunkSize := int64(327680) // 320KB
	buffer := make([]byte, chunkSize)

	for start := int64(0); start < fileSize; start += chunkSize {
		// 读取文件块
		n, err := file.Read(buffer)
		if err != nil && err != io.EOF {
			return err
		}
		chunk := buffer[:n]
		end := start + int64(n) - 1

		// 构建上传请求
		req, err := http.NewRequest("PUT", uploadUrl, bytes.NewReader(chunk))
		if err != nil {
			return err
		}
		req.Header.Set("Content-Range", fmt.Sprintf("bytes %d-%d/%d", start, end, fileSize))

		// 发送请求
		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			return err
		}
		defer resp.Body.Close()

		// 检查响应状态码
		if resp.StatusCode == 202 {
			// 202 Accepted，继续上传下一个块
			fmt.Printf("Chunk uploaded successfully: %d-%d\n", start, end)
		} else if resp.StatusCode == 201 {
			// 201 Created，文件上传完成
			fmt.Println("File uploaded successfully")
			return nil
		} else {
			// 处理错误响应
			body, _ := io.ReadAll(resp.Body)
			return fmt.Errorf("error uploading chunk: %s", body)
		}
	}

	return nil
}

// ChunkProgress 表示每个分块的加载进度
type ChunkProgress struct {
	Loaded int // 已加载的字节数
	Index  int // 分块的索引
}

// UploadCredential 表示上传凭证的响应结构
type UploadCredential struct {
	Data string `json:"data"`
}

// finishOneDriveUpload 发送完成 OneDrive 上传的请求
func finishOneDriveUpload(ctx context.Context, targetHost, sessionID string) (*UploadCredential, error) {
	url := fmt.Sprintf("%s/api/v3/callback/onedrive/finish/%s", targetHost, sessionID)

	// 请求数据
	data := map[string]bool{
		"permalink": true,
	}

	// 将请求数据编码为 JSON
	jsonData, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}

	// 创建请求
	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")

	// 发送请求
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// 解析响应
	var uploadCredential UploadCredential
	if err := json.NewDecoder(resp.Body).Decode(&uploadCredential); err != nil {
		return nil, err
	}

	return &uploadCredential, nil
}

func UploadChunksFromFile(ctx *plugin.GinContext, url string, file *multipart.FileHeader, sessionID string, host string) string {
	uploadUrl := url
	// 分块上传
	UploadFileInChunks(file, uploadUrl)
	// 直接上传没有成功
	// UploadFileDirectly(file, uploadUrl)
	uploadCredential, _ := finishOneDriveUpload(ctx, host, sessionID)
	return uploadCredential.Data
}

func UploadChunksFromBuffer(ctx *plugin.GinContext, url string, buf *bytes.Buffer, sessionID string, host string) string {
	uploadUrl := url
	// 分块上传
	UploadImageInChunks(buf, uploadUrl)
	// 直接上传没有成功
	// UploadFileDirectly(file, uploadUrl)
	uploadCredential, _ := finishOneDriveUpload(ctx, host, sessionID)
	return uploadCredential.Data
}

func UploadImageInChunks(imgBuffer *bytes.Buffer, uploadUrl string) error {
	// 首先将image对象编码为JPEG格式
	//var imgBuffer bytes.Buffer
	//if err := jpeg.Encode(&imgBuffer, img, nil); err != nil {
	//	return fmt.Errorf("failed to encode image: %v", err)
	//}

	const chunkSize = 327680 // 分块大小设置为 320KB
	imageSize := int64(imgBuffer.Len())
	bufferData := imgBuffer.Bytes()

	for start := int64(0); start < imageSize; start += chunkSize {
		end := start + int64(chunkSize)
		if end > imageSize {
			end = imageSize
		}
		chunk := bufferData[start:end]

		contentRange := fmt.Sprintf("bytes %d-%d/%d", start, end-1, imageSize)

		req, err := http.NewRequest("PUT", uploadUrl, bytes.NewReader(chunk))
		if err != nil {
			return fmt.Errorf("error creating request for chunk %d-%d: %v", start, end-1, err)
		}
		req.Header.Set("Content-Range", contentRange)

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			return fmt.Errorf("error uploading chunk %d-%d: %v", start, end-1, err)
		}
		defer resp.Body.Close()

		// 检查响应状态码
		if resp.StatusCode == http.StatusAccepted { // 202
			// 202 Accepted，继续上传下一个块
			fmt.Printf("Chunk uploaded successfully: %d-%d\n", start, end)
		} else if resp.StatusCode == http.StatusCreated { // 201
			// 201 Created，文件上传完成
			fmt.Println("File uploaded successfully")
			return nil
		} else {
			// 处理错误响应
			body, _ := io.ReadAll(resp.Body)
			return fmt.Errorf("error uploading chunk: %s", body)
		}
	}

	return nil
}
