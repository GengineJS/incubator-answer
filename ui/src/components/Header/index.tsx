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

import { FC, memo, useState, useEffect, useRef } from 'react';
import {
  Navbar,
  Container,
  Nav,
  Form,
  FormControl,
  Button,
  Col,
  Dropdown,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  useSearchParams,
  Link,
  useNavigate,
  useLocation,
  useMatch,
} from 'react-router-dom';

import classnames from 'classnames';

import { userCenter, floppyNavigation } from '@/utils';
import {
  loggedUserInfoStore,
  siteInfoStore,
  brandingStore,
  loginSettingStore,
  themeSettingStore,
  sideNavStore,
} from '@/stores';
import { logout, useQueryNotificationStatus } from '@/services';
import {
  assetBunName,
  assetBunSearch,
  ContentType,
  IframeMsgType,
} from '@/common/constants';
import {
  appendArrayResources,
  appendSingleResources,
  closeNavbarIfOpen,
  getAssetBunLoginHost,
  getTargetRootAssetBunHost,
  iframeManager,
  isAssetBunPageType,
} from '@/common/functions';

import NavItems from './components/NavItems';

import './index.scss';

const cdn = 'https://cdn.jsdelivr.net/npm/vditor@3.10.8';
const Header: FC = () => {
  iframeManager.initIframe();
  const navigate = useNavigate();
  const location = useLocation();
  const [urlSearch] = useSearchParams();
  const q = urlSearch.get('q');
  const { user, clear: clearUserStore } = loggedUserInfoStore();
  const { t } = useTranslation();
  const [searchStr, setSearch] = useState('');
  const siteInfo = siteInfoStore((state) => state.siteInfo);
  const brandingInfo = brandingStore((state) => state.branding);
  const loginSetting = loginSettingStore((state) => state.login);
  const { updateReview, updateVisible } = sideNavStore();
  const { data: redDot } = useQueryNotificationStatus();
  const isAssetBun = isAssetBunPageType();
  /**
   * Automatically append `tag` information when creating a question
   */
  const tagMatch = useMatch('/tags/:slugName');
  let askUrl = '/questions/ask';
  if (tagMatch && tagMatch.params.slugName) {
    askUrl = `${askUrl}?tags=${encodeURIComponent(tagMatch.params.slugName)}&content_type=`;
  } else {
    askUrl += `?content_type=`;
  }
  useEffect(() => {
    updateReview({
      can_revision: Boolean(redDot?.can_revision),
      revision: Number(redDot?.revision),
    });
  }, [redDot]);
  const handleInput = (val) => {
    setSearch(val);
  };
  const handleSearch = (evt) => {
    evt.preventDefault();
    if (!searchStr) {
      return;
    }
    const searchUrl = isAssetBun
      ? `/search?q=${encodeURIComponent(searchStr)}&${assetBunSearch}`
      : `/search?q=${encodeURIComponent(searchStr)}`;
    navigate(searchUrl);
  };

  // 如果登录了，并且它是资产包子云盘的page type就要跳转
  const hasOpened = useRef(false);
  useEffect(() => {
    if (
      isAssetBun &&
      user.e_mail &&
      user.mail_status === 1 &&
      !hasOpened.current
    ) {
      hasOpened.current = true;
      const loginState = localStorage.getItem('loginState');
      if (loginState && loginState === 'true') {
        localStorage.removeItem('loginState');
        return;
      }
      // 获取当前 URL 中的 redirect 参数
      const urlParams = new URLSearchParams(window.location.search);
      // 资产包子云盘的重定向
      const redirect = urlParams.get('ab_redirect');
      iframeManager.onLoaded(() => {
        iframeManager.postMsg(
          {
            email: user.e_mail!,
            password: '',
            type: IframeMsgType.IS_LOGIN,
          },
          (code: number) => {
            if (code === 10) {
              logout().then(() => {
                clearUserStore();
                window.open(getAssetBunLoginHost(), '_self');
              });
              return;
            }

            // 构建新的 URL
            let targetUrl = getTargetRootAssetBunHost();
            if (redirect && redirect !== '/login') {
              const decodedRedirect = decodeURIComponent(redirect);
              targetUrl = `${targetUrl}${decodedRedirect}`;
            }

            window.open(targetUrl, '_self');
          },
        );
      });
    }
  }, [isAssetBun, user.e_mail, user.mail_status]);

  const handleLogout = async (evt) => {
    evt.preventDefault();
    iframeManager.postMsg(
      {
        email: user.e_mail!,
        password: '',
        type: IframeMsgType.LOGOUT,
      },
      () => {
        logout().then(() => {
          clearUserStore();
          window.location.replace(window.location.href);
        });
      },
    );
  };

  // const vditorRef = useRef(null);
  useEffect(() => {
    const isLoaded = localStorage.getItem('vditorLoaded') === '1';
    if (isLoaded) {
      return;
    }

    // 预先加载下vditor，避免进入编辑界面时等待太长
    appendSingleResources(
      'https://cdn.jsdelivr.net/npm/vditor@3.10.8/dist/index.min.css',
      'https://cdn.jsdelivr.net/npm/vditor@3.10.8/dist/index.min.js',
      (ele) => {
        document.head.removeChild(ele);
        localStorage.setItem('vditorLoaded', '1');
      },
      true,
      false,
    );
    appendArrayResources(
      [`${cdn}/dist/css/content-theme`],
      [
        `${cdn}/dist/js/icons/ant.js`,
        // `${cdn}/dist/js/echarts/echarts.min.js?v=5.5.1`,
        `${cdn}/dist/js/i18n/zh_CN.js`,
        // `https://cdn.jsdelivr.net/npm/d3@6.7.0`,
        // `${cdn}/dist/method.min.js`,
        // `${cdn}/dist/js/abcjs/abcjs_basic.min.js`,
        // `${cdn}/dist/js/flowchart.js/flowchart.min.js`,
        // `${cdn}/dist/js/graphviz/viz.js`,
        `${cdn}/dist/js/highlight.js/highlight.min.js?v=11.7.0`,
        // `${cdn}/dist/js/markmap/markmap.min.js`,
        `${cdn}/dist/js/mermaid/mermaid.min.js`,
        // `${cdn}/dist/js/plantuml/plantuml-encoder.min.js`,
        // `${cdn}/dist/js/smiles-drawer/smiles-drawer.min.js?v=2.1.7`,
        // `${cdn}/dist/js/highlight.js/third-languages.js?v=1.0.1`,
        // `https://cdn.jsdelivr.net/npm/markmap-view@0.14.3`,
        `${cdn}/dist/js/lute/lute.min.js`,
      ],
      true,
    );
  }, []);

  useEffect(() => {
    if (q && location.pathname === '/search') {
      handleInput(q);
    }
  }, [q]);

  useEffect(() => {
    closeNavbarIfOpen();

    // clear search input when navigate to other page
    if (location.pathname !== '/search' && searchStr) {
      setSearch('');
    }
  }, [location.pathname]);

  let navbarStyle = 'theme-colored';
  const { theme, theme_config } = themeSettingStore((_) => _);
  if (theme_config?.[theme]?.navbar_style) {
    navbarStyle = `theme-${theme_config[theme].navbar_style}`;
  }
  const toHomeUrl = isAssetBun ? window.location : '/';
  // const style = {
  //   display: 'none',
  // };
  return (
    <>
      {/* <div id="vditorHidden" ref={vditorRef} style={style} className="vditor" /> */}
      <Navbar
        variant={navbarStyle === 'theme-colored' ? 'dark' : ''}
        expand="lg"
        className={classnames('sticky-top', navbarStyle)}
        id="header">
        <Container className="d-flex align-items-center">
          <Navbar.Toggle
            aria-controls="navBarContent"
            className="answer-navBar me-2"
            id="navBarToggle"
            onClick={() => {
              updateVisible();
            }}
          />

          <div className="d-flex justify-content-between align-items-center nav-grow flex-nowrap">
            <Navbar.Brand
              to={toHomeUrl}
              as={Link}
              className="lh-1 me-0 me-sm-5 p-0">
              {brandingInfo.logo ? (
                <>
                  <img
                    className="d-none d-lg-block logo me-0"
                    src={brandingInfo.logo}
                    alt={siteInfo.name}
                  />

                  <img
                    className="lg-none logo me-0"
                    src={brandingInfo.mobile_logo || brandingInfo.logo}
                    alt={siteInfo.name}
                  />
                </>
              ) : (
                <span>
                  {isAssetBun ? assetBunName : siteInfo.name}
                  {isAssetBun || <sup>AI</sup>}
                </span>
              )}
            </Navbar.Brand>

            {/* mobile nav */}
            <div className="d-flex lg-none align-items-center flex-lg-nowrap">
              {user?.username ? (
                <NavItems
                  redDot={redDot}
                  userInfo={user}
                  logOut={(e) => handleLogout(e)}
                />
              ) : (
                <>
                  <Button
                    variant="link"
                    className={classnames('me-2', {
                      'link-light': navbarStyle === 'theme-colored',
                      'link-primary': navbarStyle !== 'theme-colored',
                    })}
                    onClick={() => floppyNavigation.storageLoginRedirect()}
                    href={userCenter.getLoginUrl()}>
                    {t('btns.login')}
                  </Button>
                  {loginSetting.allow_new_registrations && (
                    <Button
                      variant={
                        navbarStyle === 'theme-colored' ? 'light' : 'primary'
                      }
                      href={userCenter.getSignUpUrl()}>
                      {t('btns.signup')}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          <Navbar.Collapse id="navBarContent" className="me-auto">
            <hr className="hr lg-none mb-3" style={{ marginTop: '12px' }} />
            <Col lg={8} className="ps-0">
              <Form
                action="/search"
                className="w-100 maxw-400"
                onSubmit={handleSearch}>
                <FormControl
                  type="search"
                  placeholder={t('header.search.placeholder')}
                  className="placeholder-search"
                  value={searchStr}
                  name="q"
                  onChange={(e) => handleInput(e.target.value)}
                />
              </Form>
            </Col>

            <Nav.Item className="lg-none mt-3 pb-1">
              <Dropdown>
                <Dropdown.Toggle
                  className="text-capitalize text-nowrap btn btn-light"
                  variant="light"
                  id="dropdown-basic">
                  {t('btns.add_publish')}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    href={
                      isAssetBun
                        ? `${askUrl}${ContentType.QUESTION}&${assetBunSearch}`
                        : `${askUrl}${ContentType.QUESTION}`
                    }>
                    {t('header.nav.question')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    href={
                      isAssetBun
                        ? `${askUrl}${ContentType.ARTICLE}&${assetBunSearch}`
                        : `${askUrl}${ContentType.ARTICLE}`
                    }>
                    {t('header.nav.article')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    href={
                      isAssetBun
                        ? `${askUrl}${ContentType.BOUNTY}&${assetBunSearch}`
                        : `${askUrl}${ContentType.BOUNTY}`
                    }>
                    {t('header.nav.bounty')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    target="_blank"
                    href="https://cloud.assetbun.com">
                    {t('header.nav.assetbun')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav.Item>
            {/* pc nav */}
            <Col
              lg={4}
              className="d-none d-lg-flex justify-content-start justify-content-sm-end">
              {user?.username ? (
                <Nav className="d-flex align-items-center flex-lg-nowrap">
                  <Nav.Item className="me-3">
                    <Dropdown>
                      <Dropdown.Toggle
                        className="text-capitalize text-nowrap btn btn-light"
                        variant="light"
                        id="dropdown-basic">
                        {t('btns.add_publish')}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          href={
                            isAssetBun
                              ? `${askUrl}${ContentType.QUESTION}&${assetBunSearch}`
                              : `${askUrl}${ContentType.QUESTION}`
                          }>
                          {t('header.nav.question')}
                        </Dropdown.Item>
                        <Dropdown.Item
                          href={
                            isAssetBun
                              ? `${askUrl}${ContentType.ARTICLE}&${assetBunSearch}`
                              : `${askUrl}${ContentType.ARTICLE}`
                          }>
                          {t('header.nav.article')}
                        </Dropdown.Item>
                        <Dropdown.Item
                          href={
                            isAssetBun
                              ? `${askUrl}${ContentType.BOUNTY}&${assetBunSearch}`
                              : `${askUrl}${ContentType.BOUNTY}`
                          }>
                          {t('header.nav.bounty')}
                        </Dropdown.Item>
                        <Dropdown.Item
                          target="_blank"
                          href="https://cloud.assetbun.com">
                          {t('header.nav.assetbun')}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Nav.Item>

                  <NavItems
                    redDot={redDot}
                    userInfo={user}
                    logOut={handleLogout}
                  />
                </Nav>
              ) : (
                <>
                  <Button
                    variant="link"
                    className={classnames('me-2', {
                      'link-light': navbarStyle === 'theme-colored',
                      'link-primary': navbarStyle !== 'theme-colored',
                    })}
                    onClick={() => floppyNavigation.storageLoginRedirect()}
                    href={userCenter.getLoginUrl()}>
                    {t('btns.login')}
                  </Button>
                  {loginSetting.allow_new_registrations && (
                    <Button
                      variant={
                        navbarStyle === 'theme-colored' ? 'light' : 'primary'
                      }
                      href={userCenter.getSignUpUrl()}>
                      {t('btns.signup')}
                    </Button>
                  )}
                </>
              )}
            </Col>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default memo(Header);
