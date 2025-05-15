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

import { FC } from 'react';
import { Col, Nav } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import classnames from 'classnames';

import { ContentType } from '@/common/constants';
import { loggedUserInfoStore, sideNavStore } from '@/stores';
import { Icon } from '@/components';
import './index.scss';
import { closeNavbarIfOpen, getUrlQuestionType } from '@/common/functions';

const Index: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user: userInfo } = loggedUserInfoStore();
  const { visible, can_revision, revision, show_users, recommend_tags } =
    sideNavStore();
  const contentType = getUrlQuestionType();
  const isEnglish = userInfo && userInfo.language === 'en_US';
  const handleNavClick = (e, path) => {
    e.preventDefault();
    closeNavbarIfOpen();
    navigate(path);
  };
  return (
    <Col
      xl={2}
      lg={3}
      md={12}
      className={classnames(
        'position-relative',
        visible ? '' : 'd-none d-lg-block',
      )}
      id="sideNav">
      <div className="nav-wrap pt-4">
        <Nav variant="pills" className="flex-column">
          <NavLink
            to={`/questions?content_type=${ContentType.ARTICLE}`}
            onClick={closeNavbarIfOpen}
            className={({ isActive }) =>
              (isActive && contentType === ContentType.ARTICLE) ||
              pathname === '/'
                ? 'nav-link active'
                : 'nav-link'
            }>
            <Icon name="book-half" className="me-2" />
            <span>{t('header.nav.article')}</span>
          </NavLink>

          <NavLink
            to={`/questions?content_type=${ContentType.QUESTION}`}
            onClick={closeNavbarIfOpen}
            className={({ isActive }) =>
              isActive && contentType === ContentType.QUESTION
                ? 'nav-link active'
                : 'nav-link'
            }>
            <Icon name="question-circle-fill" className="me-2" />
            <span>{t('header.nav.question')}</span>
          </NavLink>
          <Nav.Link
            href={`/questions?content_type=${ContentType.BOUNTY}`}
            active={contentType === ContentType.BOUNTY}
            onClick={(e) =>
              handleNavClick(e, `/questions?content_type=${ContentType.BOUNTY}`)
            }>
            <Icon name="currency-bitcoin" className="me-2" />
            <span>{t('header.nav.bounty')}</span>
          </Nav.Link>
          <Nav.Link
            href={`/questions?content_type=${ContentType.ASSETBUN}`}
            active={contentType === ContentType.ASSETBUN}
            onClick={(e) =>
              handleNavClick(
                e,
                `/questions?content_type=${ContentType.ASSETBUN}`,
              )
            }>
            <Icon name="cloud-fill" className="me-2" />
            <span>{t('header.nav.assetbun')}</span>
          </Nav.Link>

          <Nav.Link
            href="/tags"
            active={pathname === '/tags'}
            onClick={(e) => handleNavClick(e, '/tags')}>
            <Icon name="tags-fill" className="me-2" />
            <span>{t('header.nav.tag')}</span>
          </Nav.Link>
          {show_users && (
            <NavLink to="/users" className="nav-link">
              <Icon name="people-fill" className="me-2" />
              <span>{t('header.nav.user')}</span>
            </NavLink>
          )}

          {recommend_tags && (
            <>
              <div className="py-2 px-3 mt-3 small fw-bold">
                {t('header.nav.recommend_tags')}
              </div>
              {Object.entries(recommend_tags[0]).map(([key, value], index) => (
                <NavLink
                  key={`/tags/${key}`}
                  to={`/tags/${key}`}
                  className="nav-link">
                  <Icon name={`${index + 1}-square-fill`} className="me-2" />
                  <span>{(value as string[])[isEnglish ? 1 : 0] || key}</span>
                </NavLink>
              ))}
            </>
          )}

          {can_revision || userInfo?.role_id === 2 ? (
            <>
              <div className="py-2 px-3 mt-3 small fw-bold">
                {t('header.nav.moderation')}
              </div>
              {can_revision && (
                <NavLink to="/review" className="nav-link">
                  <span>{t('header.nav.review')}</span>
                  <span className="float-end">
                    {revision > 99 ? '99+' : revision > 0 ? revision : ''}
                  </span>
                </NavLink>
              )}

              {userInfo?.role_id === 2 ? (
                <NavLink to="/admin" className="nav-link">
                  {t('header.nav.admin')}
                </NavLink>
              ) : null}
            </>
          ) : null}
        </Nav>
      </div>
      <div className="side-nav-right-line" />
    </Col>
  );
};

export default Index;
