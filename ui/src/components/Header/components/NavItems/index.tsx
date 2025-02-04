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

import { FC, memo, useEffect, useState } from 'react';
import { Nav, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';

import type * as Type from '@/common/interface';
import { Avatar, Icon } from '@/components';
import { floppyNavigation } from '@/utils';
import { userCenterStore } from '@/stores';
import {
  getTargetRootAssetBunHost,
  isAssetBunPageType,
} from '@/common/functions';
import { assetBunSearch } from '@/common/constants';
import { RankToPointsModal } from '@/components/Header/components/NavItems/RankToScore';
import { getLoggedUserInfo } from '@/services';
import { useToast } from '@/hooks';
import { PlatformEntryModal } from '@/components/Header/components/NavItems/PlatformEntry';

interface Props {
  redDot: Type.NotificationStatus | undefined;
  userInfo: Type.UserInfoRes;
  logOut: (e) => void;
}

const deleteParams = (param: string) => {
  const params = new URLSearchParams(window.location.search);
  params.delete(param);
  const newUrl = params.values.length
    ? `${window.location.pathname}?${params.toString()}`
    : `${window.location.pathname}`;
  window.history.replaceState(null, '', newUrl);
};

const Index: FC<Props> = ({ redDot, userInfo, logOut }) => {
  const [modalRSShow, setModalRSShow] = useState(false);
  const [platformEntryShow, setPlatformEntryShow] = useState(false);
  const [validRankScore, setValidRankScore] = useState(false);
  const Toast = useToast();

  const handleRSShow = () => setModalRSShow(true);
  const handleRSClose = () => setModalRSShow(false);

  const handlePlatformEntryShow = () => setPlatformEntryShow(true);
  const handlePlatformEntryClose = () => setPlatformEntryShow(false);

  const handleExchange = () => {};
  const handleEntryPlatform = () => {};
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const { agent: ucAgent } = userCenterStore();
  const handleLinkClick = (evt) => {
    if (floppyNavigation.shouldProcessLinkClick(evt)) {
      evt.preventDefault();
      const href = evt.currentTarget.getAttribute('href');
      navigate(href);
    }
  };
  const handleRankToScore = () => {
    if (!validRankScore) {
      Toast.onShow({
        msg: t('need_entry', { keyPrefix: 'toast' }),
        variant: 'warning',
      });
      return;
    }
    handleRSShow();
  };
  const isAssetBun = isAssetBunPageType();
  let inboxUrl = '/users/notifications/inbox';
  let achievementUrl = '/users/notifications/achievement';
  if (isAssetBun) {
    inboxUrl += `?${assetBunSearch}`;
    achievementUrl += `?${assetBunSearch}`;
  }

  const openRankRefDialog = (isValid) => {
    const params = new URLSearchParams(window.location.search);
    const rank_score = params.get('rank_score');
    const platform_entry = params.get('take_entry');
    if (rank_score && rank_score === 'true') {
      // 从URL中移除rank_score参数
      deleteParams('rank_score');
      if (!isValid) {
        Toast.onShow({
          msg: t('need_entry', { keyPrefix: 'toast' }),
          variant: 'warning',
        });
        return;
      }
      handleRSShow();
    } else if (platform_entry && platform_entry === 'true') {
      deleteParams('take_entry');
      handlePlatformEntryShow();
    }
  };
  useEffect(() => {
    getLoggedUserInfo().then((resp) => {
      const rank_score_val = resp.rank_score;
      const isValid = rank_score_val > 0 || resp.contract;
      setValidRankScore(isValid);
      openRankRefDialog(isValid);
    });
  }, []);

  return (
    <>
      <RankToPointsModal
        show={modalRSShow}
        onHide={handleRSClose}
        onExchange={handleExchange}
      />
      <PlatformEntryModal
        show={platformEntryShow}
        onHide={handlePlatformEntryClose}
        onEntry={handleEntryPlatform}
      />
      <Nav className="flex-row">
        <Nav.Link
          as={NavLink}
          to={inboxUrl}
          title={t('inbox', { keyPrefix: 'notifications' })}
          className="icon-link d-flex align-items-center justify-content-center p-0 me-3 position-relative">
          <Icon name="bell-fill" className="fs-4" />
          {(redDot?.inbox || 0) > 0 && (
            <div className="unread-dot bg-danger">
              <span className="visually-hidden">
                {t('new_alerts', { keyPrefix: 'notifications' })}
              </span>
            </div>
          )}
        </Nav.Link>

        <Nav.Link
          as={NavLink}
          to={achievementUrl}
          title={t('achievement', { keyPrefix: 'notifications' })}
          className="icon-link d-flex align-items-center justify-content-center p-0 me-3 position-relative">
          <Icon name="trophy-fill" className="fs-4" />
          {(redDot?.achievement || 0) > 0 && (
            <div className="unread-dot bg-danger">
              <span className="visually-hidden">
                {t('new_alerts', { keyPrefix: 'notifications' })}
              </span>
            </div>
          )}
        </Nav.Link>
      </Nav>

      <Dropdown align="end">
        <Dropdown.Toggle
          variant="success"
          id="dropdown-basic"
          as="a"
          role="button"
          className="no-toggle pointer">
          <Avatar
            size="36px"
            avatar={userInfo?.avatar}
            alt={userInfo?.display_name}
            searchStr="s=96"
          />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item
            href={
              isAssetBun
                ? `/users/${userInfo.username}?${assetBunSearch}`
                : `/users/${userInfo.username}`
            }
            onClick={handleLinkClick}>
            {t('header.nav.profile')}
          </Dropdown.Item>
          <Dropdown.Item
            href={
              isAssetBun
                ? `/users/${userInfo.username}/bookmarks?${assetBunSearch}`
                : `/users/${userInfo.username}/bookmarks`
            }
            onClick={handleLinkClick}>
            {t('header.nav.bookmark')}
          </Dropdown.Item>
          <Dropdown.Item
            href={
              isAssetBun
                ? `/users/settings/profile?${assetBunSearch}`
                : `/users/settings/profile`
            }
            onClick={handleLinkClick}>
            {t('header.nav.setting')}
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item
            onClick={() => {
              const rootHost = getTargetRootAssetBunHost();
              window.open(`${rootHost}/setting?verify=true`, '_blank');
            }}>
            {t('header.nav.realName')}
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              handlePlatformEntryShow();
            }}>
            {t('header.nav.platformEntry')}
          </Dropdown.Item>
          <Dropdown.Item onClick={handleRankToScore}>
            {t('header.nav.rankToScore')}
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              const rootHost = getTargetRootAssetBunHost();
              window.open(`${rootHost}/setting?extract=true`, '_blank');
            }}>
            {t('header.nav.withdrawal')}
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="/users/logout" onClick={(e) => logOut(e)}>
            {t('header.nav.logout')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {/* Dropdown for user center agent info */}
      {ucAgent?.enabled &&
      (ucAgent?.agent_info?.url ||
        ucAgent?.agent_info?.control_center?.length) ? (
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="success"
            id="dropdown-uca"
            as="span"
            className="no-toggle">
            <Nav>
              <Icon
                name="grid-3x3-gap-fill"
                className="nav-link pointer p-0 fs-4 ms-3"
              />
            </Nav>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {ucAgent.agent_info.url ? (
              <Dropdown.Item href={ucAgent.agent_info.url}>
                {ucAgent.agent_info.name}
              </Dropdown.Item>
            ) : null}
            {ucAgent.agent_info.url &&
            ucAgent.agent_info.control_center?.length ? (
              <Dropdown.Divider />
            ) : null}
            {ucAgent.agent_info.control_center?.map((ctrl) => {
              return (
                <Dropdown.Item key={ctrl.name} href={ctrl.url}>
                  {ctrl.label}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      ) : null}
    </>
  );
};

export default memo(Index);
