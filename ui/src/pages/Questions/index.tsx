import { FC, useEffect, useRef, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useMatch, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-extraneous-dependencies
import InfiniteScroll from 'react-infinite-scroll-component';

import { usePageTags } from '@/hooks';
import {
  FollowingTags,
  QuestionList,
  HotQuestions,
  CustomSidebar,
} from '@/components';
import {
  siteInfoStore,
  loggedUserInfoStore,
  loginSettingStore,
} from '@/stores';
import { getAppSettings, useQuestionList } from '@/services';
import * as Type from '@/common/interface';
import { userCenter, floppyNavigation, Storage } from '@/utils';
import {
  I18nContentType,
  QUESTIONS_ORDER_STORAGE_KEY,
} from '@/common/constants';
import {
  QUESTION_ORDER_KEYS,
  TYPE_ORDER_KEYS,
} from '@/components/QuestionList';
import {
  getUrlQuestionType,
  historyManager,
  isAssetBunPageType,
} from '@/common/functions';
import { TypeHistoryResult } from '@/common/interface';

const Questions: FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'question' });
  const { t: t2 } = useTranslation('translation');
  const { user: loggedUser } = loggedUserInfoStore((_) => _);
  const [urlSearchParams] = useSearchParams();
  const storageOrder = Storage.get(QUESTIONS_ORDER_STORAGE_KEY);
  const curOrder =
    urlSearchParams.get('order') || storageOrder || QUESTION_ORDER_KEYS[0];

  if (curOrder !== storageOrder) {
    Storage.set(QUESTIONS_ORDER_STORAGE_KEY, curOrder);
  }

  const [pageSize, setPageSize] = useState(20);
  const [curPage, setCurPage] = useState(1);
  const curOrderType = urlSearchParams.get('order_type') || TYPE_ORDER_KEYS[0];

  const [contentType, setContentType] = useState(getUrlQuestionType());
  const [questionList, setQuestionList] = useState<Type.ListResult>();
  const [isLoading, setIsLoading] = useState(true);
  const [questionsHistory, setQuestionsHistory] = useState<{
    [key: number]: TypeHistoryResult;
  }>(historyManager.getData() || {});
  const loadedHistoryRef = useRef(false);
  useEffect(() => {
    getAppSettings().then((value) => {
      setPageSize(value.pageSize);
    });
    loadedHistoryRef.current = true;
    return () => {};
  }, []);

  // Effect to handle contentType and page reset
  useEffect(() => {
    const typeFromUrl = getUrlQuestionType();
    if (typeFromUrl !== contentType) {
      setContentType(typeFromUrl);
      const qHistory = questionsHistory[typeFromUrl];
      setCurPage(qHistory ? qHistory.page : 1); // Reset to first page on content type change
      // setUseHistory(true);
      setQuestionList(undefined); // Clear previous list
    }
  }, [urlSearchParams, contentType]);

  const reqParams: Type.QueryQuestionsReq = {
    page_size: pageSize,
    page: curPage,
    order: curOrder as Type.QuestionOrderBy,
    order_type: curOrderType,
    content_type: contentType,
  };

  const { data: listData } = useQuestionList(reqParams);

  useEffect(() => {
    if (loadedHistoryRef.current) {
      return;
    }
    setQuestionsHistory(() => {
      // Storage.set(QUESTION_HISTORY_KEY, {});
      historyManager.setData({});
      return {};
    });

    setCurPage(1);
  }, [curOrder, curOrderType]);

  // Effect to handle question list data
  useEffect(() => {
    if (listData) {
      let currPageVal = curPage;
      // 从其它页面路由过来的
      if (loadedHistoryRef.current) {
        loadedHistoryRef.current = false;
        if (questionsHistory[contentType]) {
          currPageVal = questionsHistory[contentType].page;
          setCurPage(currPageVal);
        }
      }
      setIsLoading(false);
      setQuestionsHistory((prev) => {
        const contentInfo = prev[contentType] || {
          page: 1,
          contentType,
          data: {},
        };
        const currList =
          contentInfo.page === currPageVal
            ? contentInfo?.data.list || listData.list
            : [...(contentInfo?.data.list || []), ...listData.list];
        // if (useHistory) {
        //   setUseHistory(false);
        // }
        // Update history records for the current contentType
        const lastData = {
          ...prev,
          [contentType]: {
            data: {
              list: currList,
              count: listData.count,
            },
            contentType,
            page: currPageVal,
          },
        };
        // Storage.set(QUESTION_HISTORY_KEY, lastData);
        historyManager.setData(lastData);
        return lastData;
        // return prev;
      });

      // Only update the question list with the latest data
      // @ts-ignore
      setQuestionList((prev) => {
        if (curPage === 1) {
          // Clear previous list for the first page
          return {
            list: listData.list,
            count: listData.count,
          };
        }
        // Append new data when loading more
        return {
          ...prev,
          list: [...(prev?.list || []), ...listData.list],
        };
      });
    }
  }, [listData, curPage]);

  // Use stored questions history or the current question list
  const displayedQuestionList = questionsHistory[contentType]
    ? questionsHistory[contentType].data
    : questionList;
  const handleLoadMore = () => {
    if (
      (displayedQuestionList?.list?.length || 0) <
        (displayedQuestionList?.count || 0) &&
      !isLoading
    ) {
      setCurPage((prev) => prev + 1);
    }
  };

  const isIndexPage = useMatch('/');
  // @ts-ignore
  let pageTitle = t(I18nContentType[reqParams.content_type], {
    keyPrefix: 'page_title',
  });
  let slogan = '';
  const { siteInfo } = siteInfoStore();
  if (isIndexPage) {
    pageTitle = `${siteInfo.name}`;
    slogan = `${siteInfo.short_description}`;
  }
  const { login: loginSetting } = loginSettingStore();
  const isAssetBun = isAssetBunPageType();
  usePageTags({ title: pageTitle, subtitle: slogan });

  const hasMore =
    (displayedQuestionList?.list?.length || 0) <
    (displayedQuestionList?.count || 0);
  return (
    <Row className="pt-4 mb-5">
      <Col className="page-main flex-auto">
        <InfiniteScroll
          dataLength={displayedQuestionList?.list?.length || 0}
          next={handleLoadMore} // Disable automatic loading
          hasMore={false} // Disable automatic loading
          loader={
            <div
              style={{ color: 'rgb(85, 117, 246)' }}
              className="text-center py-3">
              {t('loading')}
            </div>
          }
          scrollThreshold="95%"
          style={{ overflow: 'visible' }}>
          <QuestionList
            source="questions"
            data={displayedQuestionList}
            isPageList={false}
            order={curOrder}
            orderList={
              loggedUser.username
                ? QUESTION_ORDER_KEYS
                : QUESTION_ORDER_KEYS.filter((key) => key !== 'recommend')
            }
            isLoading={isLoading}
          />
        </InfiniteScroll>
        {hasMore && (
          <div className="d-flex justify-content-center align-items-center py-3">
            <Button
              variant="link"
              className="btn-no-border"
              onClick={handleLoadMore}>
              {t2('show_more', { keyPrefix: 'notifications' })}
            </Button>
          </div>
        )}
      </Col>
      <Col className="page-right-side mt-4 mt-xl-0">
        <CustomSidebar />
        {!loggedUser.username && (
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">
                {t2('website_welcome', { site_name: siteInfo.name })}
                {isAssetBun || <sup>AI</sup>}
              </h5>
              <p className="card-text">{siteInfo.description}</p>
              <Link
                to={userCenter.getLoginUrl()}
                className="btn btn-primary"
                onClick={floppyNavigation.handleRouteLinkClick}>
                {t('login', { keyPrefix: 'btns' })}
              </Link>
              {loginSetting.allow_new_registrations ? (
                <Link
                  to={userCenter.getSignUpUrl()}
                  className="btn btn-link ms-2"
                  onClick={floppyNavigation.handleRouteLinkClick}>
                  {t('signup', { keyPrefix: 'btns' })}
                </Link>
              ) : null}
            </div>
          </div>
        )}
        {loggedUser.access_token && <FollowingTags />}
        <HotQuestions />
      </Col>
    </Row>
  );
};

export default Questions;
