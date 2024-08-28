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

import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

import classnames from 'classnames';

import { siteInfoStore } from '@/stores';
import { isAssetBunPageType } from '@/common/functions';
import { assetBunName } from '@/common/constants';

interface Props {
  as?: React.ElementType;
  className?: string;
}

const Index: FC<Props> = ({ as: Component = 'h3', className = 'mb-5' }) => {
  const { t } = useTranslation();
  const { name: siteName } = siteInfoStore((_) => _.siteInfo);
  const isAssetBun = isAssetBunPageType();
  const site_name = isAssetBun ? assetBunName : siteName;
  return (
    <Component className={classnames('text-center', className)}>
      {t('website_welcome', { site_name })}
      {isAssetBun || <sup>AI</sup>}
    </Component>
  );
};

export default memo(Index);
