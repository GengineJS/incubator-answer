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

import create from 'zustand';

type reviewData = {
  can_revision: boolean;
  revision: number;
};

type recommend = {
  // key是链接，value[0]是中文描述，value[1]是英文
  recommend_tags: any;
  show_users: boolean;
};
interface ErrorCodeType {
  visible: boolean;
  can_revision: boolean;
  show_users: boolean;
  recommend_tags: any;
  revision: number;
  updateVisible: () => void;
  updateRecommend: (recommend: recommend) => void;
  updateReview: (params: reviewData) => void;
}

const Index = create<ErrorCodeType>((set) => ({
  visible: false,
  can_revision: false,
  show_users: false,
  recommend_tags: null,
  revision: 0,
  updateVisible: () => {
    set((state) => {
      return { visible: !state.visible };
    });
  },
  updateReview: (params: reviewData) => {
    set(() => {
      return { ...params };
    });
  },
  updateRecommend: (params: recommend) => {
    set(() => {
      return {
        show_users: params.show_users,
        recommend_tags: params.recommend_tags,
      };
    });
  },
}));

export default Index;
