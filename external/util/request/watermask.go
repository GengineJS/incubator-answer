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

// DrawTextOnImage 将文本绘制到已有的image.Image上，并将文本放置在图片的左下角
func DrawTextOnImage(img draw.Image, text string, fontPath string, fontSize float64, textColor color.Color) error {
	// Read the font data.
	fontBytes, err := os.ReadFile(fontPath)
	if err != nil {
		return err
	}
	f, err := truetype.Parse(fontBytes)
	if err != nil {
		return err
	}

	// Create the font.Face.
	h := font.HintingNone
	face := truetype.NewFace(f, &truetype.Options{
		Size:    fontSize,
		DPI:     72, // 假设DPI为72，可以根据需要调整
		Hinting: h,
	})

	// Create the font.Drawer.
	d := &font.Drawer{
		Dst:  img,
		Src:  image.NewUniform(textColor),
		Face: face,
	}

	// Measure the text width and height.
	// textWidth := d.MeasureString(text)
	textHeight := face.Metrics().Height.Ceil()

	// Calculate the position for the bottom-left corner.
	bounds := img.Bounds()
	x := bounds.Min.X + 10
	y := bounds.Max.Y - textHeight

	// Draw the text.
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
