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

package entity

import "time"

type ContractInfo struct {
	Id               int       `json:"id" xorm:"'id' pk autoincr"`
	Title            string    `json:"title" xorm:"'title' varchar(255)"`              // 称号
	RedeemRankPoints int       `json:"redeem_rank_points" xorm:"'redeem_rank_points'"` // 多少贡献值可以兑换该称号
	RankToPoint      float64   `json:"rank_to_point" xorm:"'rank_to_point'"`           // 兑换1积分需要多少贡献值
	BackgroundImage  string    `json:"background_image" xorm:"'background_image' varchar(255)"`
	Description      string    `json:"description" xorm:"'description' varchar(255)"`
	CreatedAt        time.Time `json:"-" xorm:"created_at"`
	UpdatedAt        time.Time `json:"-" xorm:"updated_at"`
	DeletedAt        time.Time `json:"-" xorm:"deleted_at"`
	Rank             int       `json:"rank" xorm:"'rank'"`   // 多少贡献换多少积分的贡献值部分
	Point            int       `json:"point" xorm:"'point'"` // 多少贡献换多少积分的积分部分
}

// TableName contract_list table name
func (ContractInfo) TableName() string {
	return "contract_info"
}

type ContractStatus int

const (
	ContractPending     ContractStatus = iota // 待处理
	ContractEffective                         // 生效
	ContractRejected                          // 已拒绝
	ContractDisabled                          // 禁用
	ContractExpired                           // 过期
	ContractTransferred                       // 转移
	ContractDeleted                           // 删除
)

// Contract contract
type Contract struct {
	Id             int            `json:"id" xorm:"'id' pk autoincr"`
	UserId         int            `json:"user_id" xorm:"'user_id' index"`                   // 用户ID索引
	ContractInfoId int            `json:"contract_info_id" xorm:"'contract_info_id' index"` // 签约ID索引
	StartTime      time.Time      `json:"start_time" xorm:"'start_time'"`
	EndTime        time.Time      `json:"end_time" xorm:"'end_time'"`
	Status         ContractStatus `json:"status" xorm:"'status' INT"`
	CreatedAt      time.Time      `json:"-" xorm:"created_at"`
	UpdatedAt      time.Time      `json:"-" xorm:"updated_at"`
	DeletedAt      time.Time      `json:"-" xorm:"deleted_at"`
	// 添加嵌套对象
	ContractInfo *ContractInfo `json:"contract_info" xorm:"-"`
	User         *User         `json:"-" xorm:"-"`
}

// TableName contract table name
func (Contract) TableName() string {
	return "contract"
}
