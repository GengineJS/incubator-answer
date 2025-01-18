package request

import (
	"flag"
	"github.com/golang/freetype/truetype"
	"golang.org/x/image/draw"
	"golang.org/x/image/font"
	"golang.org/x/image/font/basicfont"
	"golang.org/x/image/math/fixed"
	"image"
	"image/color"
	"os"
)

var (
	dpi      = flag.Float64("dpi", 72, "screen resolution in Dots Per Inch")
	fontfile = flag.String("fontfile", "../../testdata/luxisr.ttf", "filename of the ttf font")
	hinting  = flag.String("hinting", "none", "none | full")
	size     = flag.Float64("size", 12, "font size in points")
	spacing  = flag.Float64("spacing", 1.5, "line spacing (e.g. 2 means double spaced)")
	wonb     = flag.Bool("whiteonblack", false, "white text on a black background")
)

// AddWatermark 在给定的图像上添加文字水印
func AddWatermark(img draw.Image, watermarkText string) {
	margin := 10
	bounds := img.Bounds()
	point := fixed.Point26_6{
		X: fixed.I(margin),                // 距离左边的距离
		Y: fixed.I(bounds.Max.Y - margin), // 距离底部的距离
	}
	d := &font.Drawer{
		Dst:  img,
		Src:  image.NewUniform(color.RGBA{255, 255, 255, 128}), // 半透明白色文字
		Face: basicfont.Face7x13,
		Dot:  point,
	}
	d.DrawString(watermarkText)
}

// DrawImageOnImageWithHeight 将目标图绘制到底图之上，位置默认为左下角，并按指定高度等比例绘制
// baseImage: 底图
// targetImagePath: 目标图的路径
// targetHeight: 目标图的高度
// mode: 绘制模式（draw.Src, draw.Over, draw.SrcOver, draw.DstOver等）
func DrawImageOnImageWithHeight(baseImage draw.Image, targetImagePath string, targetHeight int) (width, height int) {
	// 打开目标图
	targetFile, err := os.Open(targetImagePath)
	if err != nil {
		return 0, 0
	}
	defer targetFile.Close()

	targetImage, _, err := image.Decode(targetFile)
	if err != nil {
		return 0, 0
	}

	// 计算等比例的宽度
	targetBounds := targetImage.Bounds()
	widthRatio := float64(targetBounds.Dx()) / float64(targetBounds.Dy())
	targetWidth := int(float64(targetHeight) * widthRatio)

	// 创建一个等比例缩放后的目标图
	resizedTarget := image.NewRGBA(image.Rect(0, 0, targetWidth, targetHeight))
	draw.NearestNeighbor.Scale(resizedTarget, resizedTarget.Bounds(), targetImage, targetBounds, draw.Over, nil)

	// 计算目标图在底图上的绘制区域，位置默认为左下角
	baseBounds := baseImage.Bounds()
	position := image.Point{
		X: baseBounds.Min.X + 10,
		Y: baseBounds.Max.Y - targetHeight - 10,
	}

	// 将目标图绘制到底图上
	draw.Draw(baseImage, resizedTarget.Bounds().Add(position), resizedTarget, image.ZP, draw.Over)

	return targetWidth, targetHeight
}

// DrawTextOnImage 将文本绘制到已有的image.Image上，并将文本放置在图片的左下角，同时添加文本轮廓
func DrawTextOnImage(img draw.Image, text string, fontPath string, fontSize float64, marginLeft int) error {
	// 读取字体文件
	fontBytes, err := os.ReadFile(fontPath)
	if err != nil {
		return err
	}
	f, err := truetype.Parse(fontBytes)
	if err != nil {
		return err
	}

	// 创建字体面
	h := font.HintingNone
	face := truetype.NewFace(f, &truetype.Options{
		Size:    fontSize,
		DPI:     72, // 假设DPI为72，可以根据需要调整
		Hinting: h,
	})

	// 设置文本颜色和轮廓颜色
	textColor := color.RGBA{255, 255, 255, 255}    // 白色
	outlineColor := color.RGBA{210, 210, 210, 255} // 轮廓颜色
	outlineWidth := 2                              // 轮廓宽度

	// 创建字体绘制器
	d := &font.Drawer{
		Dst:  img,
		Src:  image.NewUniform(textColor),
		Face: face,
	}

	// 计算文本高度
	textHeight := face.Metrics().Height.Ceil()

	// 计算文本位置
	bounds := img.Bounds()
	x := bounds.Min.X + 10 + marginLeft
	y := bounds.Max.Y - textHeight

	// 绘制文本轮廓
	for dx := -outlineWidth; dx <= outlineWidth; dx++ {
		for dy := -outlineWidth; dy <= outlineWidth; dy++ {
			if dx == 0 && dy == 0 {
				continue // 跳过中心位置
			}
			d.Src = image.NewUniform(outlineColor)
			d.Dot = fixed.P(x+dx, y+dy)
			d.DrawString(text)
		}
	}

	// 绘制文本
	d.Src = image.NewUniform(textColor)
	d.Dot = fixed.P(x, y)
	d.DrawString(text)

	return nil
}

// loadFontFile 从文件路径加载字体文件
//func loadFontFile(fontPath string) ([]byte, error) {
//	fontBytes, err := ioutil.ReadFile(fontPath)
//	if err != nil {
//		return nil, err
//	}
//	return fontBytes, nil
//}
