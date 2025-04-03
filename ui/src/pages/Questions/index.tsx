import { FC, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
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
import { getUrlQuestionType, isAssetBunPageType } from '@/common/functions';

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

  useEffect(() => {
    getAppSettings().then((value) => {
      setPageSize(value.pageSize);
    });
  }, []);

  // Effect to handle contentType and page reset
  useEffect(() => {
    const typeFromUrl = getUrlQuestionType();
    if (typeFromUrl !== contentType) {
      setContentType(typeFromUrl);
      setCurPage(1); // Reset to first page on content type change
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

  // Effect to handle question list data
  useEffect(() => {
    if (listData) {
      setIsLoading(false);
      setQuestionList((prev) => {
        if (curPage === 1) {
          return listData; // Reset list for first page
        }
        return {
          ...listData,
          list: [...(prev?.list || []), ...listData.list],
        };
      });
    }
  }, [listData, curPage]);

  const handleLoadMore = () => {
    if (
      (questionList?.list?.length || 0) < (questionList?.count || 0) &&
      !isLoading
    ) {
      setCurPage((prev) => prev + 1);
    }
  };

  const hasMore =
    (questionList?.list?.length || 0) < (questionList?.count || 0);

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

  return (
    <Row className="pt-4 mb-5">
      <Col className="page-main flex-auto">
        <InfiniteScroll
          dataLength={questionList?.list?.length || 0}
          next={handleLoadMore}
          hasMore={hasMore}
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
            data={questionList}
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
