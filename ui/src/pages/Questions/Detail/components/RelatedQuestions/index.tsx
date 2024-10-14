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

import { memo, FC } from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components';
import { useSimilarQuestion } from '@/services';
import { RelatedContentQuery } from '@/common/i18n';
import IntegralLink from '@/components/IntegralLink';
import handleOpenPayScore from '@/components/Pay';
import { loggedUserInfoStore } from '@/stores';
import { getUrlQuestionType, isModerator } from '@/common/constants';

interface Props {
  id: string;
}
const Index: FC<Props> = ({ id }) => {
  const contentType = getUrlQuestionType();
  const { t } = useTranslation('translation', {
    keyPrefix: RelatedContentQuery[contentType],
  });
  const { t: qt } = useTranslation('translation', { keyPrefix: 'question' });
  const navigate = useNavigate();
  const user = loggedUserInfoStore((state) => state.user);
  const { data, isLoading } = useSimilarQuestion({
    question_id: id,
    page_size: 5,
    content_type: contentType,
  });

  if (isLoading) {
    return null;
  }

  return (
    <Card>
      <Card.Header>{t('title')}</Card.Header>
      <ListGroup variant="flush">
        {data?.list?.map((item) => {
          return (
            <ListGroup.Item
              action
              key={item.id}
              as={Link}
              onClick={(event) => {
                event.preventDefault();
                handleOpenPayScore(qt, navigate, user, item);
              }}
              to=".">
              <div className="link-dark">
                {item.title}
                <IntegralLink
                  score={item.score}
                  t={t}
                  contentType={item.content_type}
                  isPay={
                    isModerator(item, user) ||
                    item.buyer_user_ids.indexOf(user.id) !== -1
                  }
                />
              </div>
              {item.answer_count > 0 && (
                <div
                  className={`mt-1 small me-2 ${
                    item.accepted_answer_id > 0
                      ? 'link-success'
                      : 'link-secondary'
                  }`}>
                  <Icon
                    name={
                      item.accepted_answer_id > 0
                        ? 'check-circle-fill'
                        : 'chat-square-text-fill'
                    }
                    className="me-1"
                  />

                  <span>
                    {item.answer_count} {t('answers')}
                  </span>
                </div>
              )}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Card>
  );
};

export default memo(Index);
