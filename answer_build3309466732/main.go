package main

import (
	answercmd "github.com/apache/incubator-answer/cmd"

  // remote plugins
	_ "github.com/apache/incubator-answer-plugins/connector-github"
	_ "github.com/apache/incubator-answer-plugins/storage-aliyunoss"
	_ "github.com/apache/incubator-answer-plugins/cache-redis"
	_ "github.com/apache/incubator-answer-plugins/editor-chart"
	_ "github.com/apache/incubator-answer-plugins/editor-formula"

  // local plugins
)

func main() {
	answercmd.Main()
}
