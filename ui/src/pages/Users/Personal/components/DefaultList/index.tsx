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

import { FC, memo } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { FormatTime, Tag, BaseUserCard, Counts } from '@/components';
import { pathFactory } from '@/router/pathFactory';
import { isModerator, QueryContentTypeFromStr } from '@/common/constants';
import IntegralLink from '@/components/IntegralLink';
import { loggedUserInfoStore } from '@/stores';
import handleOpenPayScore from '@/components/Pay';

interface Props {
  visible: boolean;
  tabName: string;
  data: any[];
}

const Index: FC<Props> = ({ visible, tabName, data }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'personal' });
  const { t: qt } = useTranslation('translation', { keyPrefix: 'question' });
  const userInfo = loggedUserInfoStore((state) => state.user);
  const navigate = useNavigate();
  if (!visible) {
    return null;
  }

  return (
    <ListGroup className="rounded-0">
      {data.map((item) => {
        return (
          <ListGroupItem
            className="py-3 px-0 bg-transparent border-start-0 border-end-0"
            key={
              tabName === 'questions' ||
              tabName === 'articles' ||
              tabName === 'assetbuns' ||
              tabName === 'bounties'
                ? item.question_id
                : item.id
            }>
            <h6 className="mb-2">
              <Link
                className="text-break"
                to="."
                onClick={(event) => {
                  event.preventDefault();
                  handleOpenPayScore(
                    qt,
                    navigate,
                    userInfo,
                    item,
                    pathFactory.questionLanding(
                      tabName === 'questions' ||
                        tabName === 'articles' ||
                        tabName === 'assetbuns' ||
                        tabName === 'bounties'
                        ? item.question_id
                        : item.id,
                      item.url_title,
                      QueryContentTypeFromStr[tabName],
                    ),
                  );
                }}>
                {item.title}
                <IntegralLink
                  score={item.score}
                  t={t}
                  contentType={item.content_type}
                  isPay={
                    isModerator(item, userInfo) ||
                    item.buyer_user_ids.indexOf(userInfo.id) !== -1
                  }
                />
                {(tabName === 'questions' ||
                  tabName === 'articles' ||
                  tabName === 'assetbuns' ||
                  tabName === 'bounties') &&
                item.status === 'closed'
                  ? ` [${t('closed', { keyPrefix: 'question' })}]`
                  : null}
              </Link>
            </h6>
            <div className="d-flex flex-wrap align-items-center small text-secondary mb-2">
              {tabName === 'bookmarks' && (
                <>
                  <BaseUserCard data={item.user_info} showAvatar={false} />
                  <span className="split-dot" />
                </>
              )}

              <FormatTime
                time={
                  tabName === 'bookmarks' ? item.create_time : item.created_at
                }
                className="me-3"
                preFix={t('asked')}
              />

              <Counts
                isAccepted={Number(item.accepted_answer_id) > 0}
                data={{
                  votes: item.vote_count,
                  answers: item.answer_count,
                  views: item.view_count,
                  score: item.score,
                }}
              />
            </div>
            <div>
              {item.tags?.map((tag) => {
                return <Tag className="me-1" key={tag.slug_name} data={tag} />;
              })}
            </div>
          </ListGroupItem>
        );
      })}
    </ListGroup>
  );
};

export default memo(Index);
