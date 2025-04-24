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

package util

import (
	"embed"
	"fmt"
	"gopkg.in/yaml.v3"
	"path/filepath"
	"strings"
)

type Info struct {
	SlugName string `yaml:"slug_name"`
	Type     string `yaml:"type"`
	Version  string `yaml:"version"`
	Author   string `yaml:"author"`
	Link     string `yaml:"link"`
}

func (c *Info) GetInfo(info embed.FS) *Info {
	yamlFile, err := info.ReadFile("info.yaml")
	if err != nil {
		fmt.Println(err)
	}
	err = yaml.Unmarshal(yamlFile, c)
	if err != nil {
		fmt.Println(err)
	}
	return c
}

// IsImageFile 根据文件名判断是否为图片
func IsImageFile(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	switch ext {
	case ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp":
		return true
	default:
		return false
	}
}

func IsImageExcludeGif(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	switch ext {
	case ".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp":
		return true
	default:
		return false
	}
}

// IsPngFile 根据文件名判断是否为PNG图片
func IsPngFile(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	switch ext {
	case ".png":
		return true
	default:
		return false
	}
}

func IsGifFile(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	switch ext {
	case ".gif":
		return true
	default:
		return false
	}
}

// IsVideoFile 根据文件名判断是否为视频
func IsVideoFile(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	switch ext {
	case ".mp4", ".avi", ".mov", ".wmv", ".flv", ".mkv", ".3gp", ".m4v", ".webm", ".mpg", ".mpeg":
		return true
	default:
		return false
	}
}
