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

package chart

import (
	"github.com/apache/incubator-answer-plugins/editor-chart/i18n"
	"github.com/apache/incubator-answer-plugins/util"
	"github.com/apache/incubator-answer/plugin"
)

type ChartPlugin struct {
}

func init() {
	plugin.Register(&ChartPlugin{})
}

func (d ChartPlugin) Info() plugin.Info {
	info := &util.Info{}
	info.SlugName = "chart_editor"
	info.Type = "editor"
	info.Version = "1.2.9"
	info.Author = "answerdev"
	info.Link = "https://github.com/apache/incubator-answer-plugins/tree/main/editor-chart"
	return plugin.Info{
		Name:        plugin.MakeTranslator(i18n.InfoName),
		SlugName:    info.SlugName,
		Description: plugin.MakeTranslator(i18n.InfoDescription),
		Author:      info.Author,
		Version:     info.Version,
		Link:        info.Link,
	}
}
