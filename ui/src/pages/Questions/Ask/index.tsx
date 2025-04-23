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

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import dayjs from 'dayjs';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';

import { usePageTags } from '@/hooks';
import { Editor, EditorRef, TagSelector } from '@/components';
import type * as Type from '@/common/interface';
import {
  ContentType,
  DRAFT_QUESTION_STORAGE_KEY,
  ExternalPayContentType,
  hasPayType,
} from '@/common/constants';
import {
  saveQuestion,
  questionDetail,
  modifyQuestion,
  useQueryRevisions,
  queryQuestionByTitle,
  getTagsBySlugName,
  saveQuestionWithAnswer,
} from '@/services';
import {
  handleFormError,
  SaveDraft,
  storageExpires,
  scrollToElementTop,
} from '@/utils';
import { pathFactory } from '@/router/pathFactory';
import { useCaptchaPlugin } from '@/utils/pluginKit';
import { getUrlQuestionType } from '@/common/functions';
import {
  AskEditTitleTypeQuery,
  AskIntegralTypeQuery,
  AskPostContentTypeQuery,
  AskTitleTypeQuery,
} from '@/common/i18n';
import { loggedUserInfoStore } from '@/stores';

import SearchQuestion from './components/SearchQuestion';

interface FormDataItem {
  title: Type.FormValue<string>;
  integral: Type.FormValue<number>;
  tags: Type.FormValue<Type.Tag[]>;
  content: Type.FormValue<string>;
  answer_content: Type.FormValue<string>;
  edit_summary: Type.FormValue<string>;
  covers: Type.FormValue<string[]>;
  cover_min_size: Type.FormValue<number>;
}

const saveDraft = new SaveDraft({ type: 'question' });

const Ask = () => {
  const initFormData = {
    title: {
      value: '',
      isInvalid: false,
      errorMsg: '',
    },
    integral: {
      value: 0,
      isInvalid: false,
      errorMsg: '',
    },
    tags: {
      value: [],
      isInvalid: false,
      errorMsg: '',
    },
    covers: {
      value: [],
      isInvalid: false,
      errorMsg: '',
    },
    cover_min_size: {
      value: 180000,
      isInvalid: false,
      errorMsg: '',
    },
    content: {
      value: '',
      isInvalid: false,
      errorMsg: '',
    },
    answer_content: {
      value: '',
      isInvalid: false,
      errorMsg: '',
    },
    edit_summary: {
      value: '',
      isInvalid: false,
      errorMsg: '',
    },
  };
  const { t } = useTranslation('translation', { keyPrefix: 'ask' });
  const [formData, setFormData] = useState<FormDataItem>(initFormData);
  const [immData, setImmData] = useState<FormDataItem>(initFormData);
  const [checked, setCheckState] = useState(false);
  // const [setBlockState] = useState(false); // blockState,
  const [focusType, setForceType] = useState('');
  const [hasDraft, setHasDraft] = useState(false);
  const resetForm = () => {
    setFormData(initFormData);
    setCheckState(false);
    setForceType('');
  };
  const [similarQuestions, setSimilarQuestions] = useState([]);

  const editorRef = useRef<EditorRef>({
    getHtml: () => '',
  });
  const editorRef2 = useRef<EditorRef>({
    getHtml: () => '',
  });

  const { qid } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initQueryTags = () => {
    const queryTags = searchParams.get('tags');
    if (!queryTags) {
      return;
    }
    getTagsBySlugName(queryTags).then((tags) => {
      // eslint-disable-next-line
      handleTagsChange(tags);
    });
  };

  const isEdit = qid !== undefined;

  const saveCaptcha = useCaptchaPlugin('question');
  const editCaptcha = useCaptchaPlugin('edit');

  const removeDraft = () => {
    saveDraft.save.cancel();
    saveDraft.remove();
    setHasDraft(false);
  };

  useEffect(() => {
    if (!qid) {
      initQueryTags();
      const draft = storageExpires.get(DRAFT_QUESTION_STORAGE_KEY);
      if (draft) {
        formData.title.value = draft.title;
        formData.content.value = draft.content;
        formData.tags.value = draft.tags;
        formData.answer_content.value = draft.answer_content;
        setCheckState(Boolean(draft.answer_content));
        setHasDraft(true);
        setFormData({ ...formData });
      } else {
        resetForm();
      }
    }
    return () => {
      resetForm();
    };
  }, [qid]);

  useEffect(() => {
    const { title, tags, content, answer_content } = formData;
    const { title: editTitle, tags: editTags, content: editContent } = immData;

    // edited
    if (qid) {
      if (
        editTitle.value !== title.value ||
        editContent.value !== content.value ||
        !isEqual(
          editTags.value.map((v) => v.slug_name),
          tags.value.map((v) => v.slug_name),
        )
      ) {
        // setBlockState(true);
      } else {
        // setBlockState(false);
      }
      return;
    }
    // write
    if (
      title.value ||
      tags.value.length > 0 ||
      content.value ||
      answer_content.value
    ) {
      // save draft
      saveDraft.save({
        params: {
          title: title.value,
          tags: tags.value,
          content: content.value,
          answer_content: answer_content.value,
        },
        callback: () => setHasDraft(true),
      });
      // setBlockState(true);
    } else {
      removeDraft();
      // setBlockState(false);
    }
  }, [formData]);

  // TODO: 未保存的提示
  // usePromptWithUnload({
  //   when: blockState,
  // });
  const contentType = getUrlQuestionType();
  const { data: revisions = [] } = useQueryRevisions(qid);
  const { score } = loggedUserInfoStore((state) => state.user);
  const isPayType = hasPayType();
  const [currIntegral, setCurrIntegral] = useState(
    contentType === ContentType.QUESTION || contentType === ContentType.BOUNTY
      ? score
      : 1000,
  );
  // const [beginIntegral, setBeginIntergral] = useState(0);
  let contentPlaceHolder = '';
  if (contentType === ContentType.BOUNTY) {
    // 项目需求模板
    contentPlaceHolder = '请详细描述你的项目需求，项目周期及交付方式';
  }
  const [acceptedID, setAcceptedID] = useState('');
  const [isCustomCover, setIsCustomCover] = useState(false); // 是否自定义封面
  const [imageUrls, setImageUrls] = useState<string[]>([]); // 提取的图片 URL
  useEffect(() => {
    if (!isEdit) {
      return;
    }
    questionDetail(qid).then((res) => {
      setAcceptedID(res.accepted_answer_id);
      formData.title.value = res.title;
      formData.content.value = res.content;
      formData.covers.value = (res.covers || []).map((coverUrl) => {
        // 使用 decodeURIComponent 解码整个 URL
        // 或者使用 replace 方法替换 &amp; 为 &
        return decodeURIComponent(coverUrl).replace(/&amp;/g, '&');
      });
      formData.cover_min_size.value = res.cover_min_size || 0;
      setIsCustomCover(!formData.cover_min_size.value);
      formData.tags.value = res.tags.map((item) => {
        return {
          ...item,
          parsed_text: '',
          original_text: '',
        };
      });
      formData.integral.value = res.score;
      // setBeginIntergral(res.score);
      if (
        contentType === ContentType.QUESTION ||
        contentType === ContentType.BOUNTY
      ) {
        setCurrIntegral(currIntegral + res.score);
      }
      setImmData({ ...formData });
      setFormData({ ...formData });
    });
  }, [qid]);

  const querySimilarQuestions = useCallback(
    debounce((title) => {
      queryQuestionByTitle(title).then((res) => {
        setSimilarQuestions(res);
      });
    }, 400),
    [],
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      title: { ...formData.title, value: e.currentTarget.value, errorMsg: '' },
    });
    if (e.currentTarget.value.length >= 10) {
      querySimilarQuestions(e.currentTarget.value);
    }
    if (e.currentTarget.value.length === 0) {
      setSimilarQuestions([]);
    }
  };
  const handleIntegralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currInput = parseInt(e.currentTarget.value, 10);
    setFormData({
      ...formData,
      integral: {
        ...formData.integral,
        value: Math.max(0, Math.min(currInput, currIntegral)),
        errorMsg: '',
      },
    });
  };
  const handleContentChange = (value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      content: { ...prevFormData.content, value, errorMsg: '' },
    }));
  };
  const handleTagsChange = (value) =>
    setFormData({
      ...formData,
      tags: { isInvalid: false, value, errorMsg: '' },
    });

  const handleAnswerChange = (value: string) =>
    setFormData({
      ...formData,
      answer_content: { ...formData.answer_content, value, errorMsg: '' },
    });

  const handleSummaryChange = (evt: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({
      ...formData,
      edit_summary: {
        ...formData.edit_summary,
        value: evt.currentTarget.value,
      },
    });

  const deleteDraft = () => {
    const res = window.confirm(t('discard_confirm', { keyPrefix: 'draft' }));
    if (res) {
      removeDraft();
      resetForm();
    }
  };

  const submitModifyQuestion = (params) => {
    // setBlockState(false);
    const ep = {
      ...params,
      id: qid,
      edit_summary: formData.edit_summary.value,
    };
    const imgCode = editCaptcha?.getCaptcha();
    if (imgCode?.verify) {
      ep.captcha_code = imgCode.captcha_code;
      ep.captcha_id = imgCode.captcha_id;
    }
    modifyQuestion(ep)
      .then(async (res) => {
        await editCaptcha?.close();
        navigate(
          pathFactory.questionLanding(qid, res?.url_title, contentType),
          {
            state: { isReview: res?.wait_for_review },
          },
        );
      })
      .catch((err) => {
        if (err.isError) {
          editCaptcha?.handleCaptchaError(err.list);
          const data = handleFormError(err, formData);
          setFormData({ ...data });
          const ele = document.getElementById(err.list[0].error_field);
          scrollToElementTop(ele);
        }
      });
  };

  const submitQuestion = async (params) => {
    // setBlockState(false);
    const imgCode = saveCaptcha?.getCaptcha();
    if (imgCode?.verify) {
      params.captcha_code = imgCode.captcha_code;
      params.captcha_id = imgCode.captcha_id;
    }
    let res;
    if (checked) {
      res = await saveQuestionWithAnswer({
        ...params,
        answer_content: formData.answer_content.value,
      }).catch((err) => {
        if (err.isError) {
          const captchaErr = saveCaptcha?.handleCaptchaError(err.list);
          if (!(captchaErr && err.list.length === 1)) {
            const data = handleFormError(err, formData);
            setFormData({ ...data });
            const ele = document.getElementById(err.list[0].error_field);
            scrollToElementTop(ele);
          }
        }
      });
    } else {
      res = await saveQuestion(params).catch((err) => {
        if (err.isError) {
          const captchaErr = saveCaptcha?.handleCaptchaError(err.list);
          if (!(captchaErr && err.list.length === 1)) {
            const data = handleFormError(err, formData);
            setFormData({ ...data });
            const ele = document.getElementById(err.list[0].error_field);
            scrollToElementTop(ele);
          }
        }
      });
    }

    const id = res?.id || res?.question?.id;
    if (id) {
      await saveCaptcha?.close();
      if (checked) {
        navigate(
          pathFactory.questionLanding(
            id,
            res?.question?.url_title,
            contentType,
          ),
        );
      } else {
        navigate(pathFactory.questionLanding(id, res?.url_title, contentType));
      }
    }
    removeDraft();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const params: Type.QuestionParams = {
      title: formData.title.value,
      content: formData.content.value,
      tags: formData.tags.value,
      score: formData.integral.value,
      content_type: getUrlQuestionType(),
      cover_min_size: formData.cover_min_size.value,
      covers: formData.covers.value,
    };

    if (isEdit) {
      if (!editCaptcha) {
        submitModifyQuestion(params);
        return;
      }
      editCaptcha.check(() => submitModifyQuestion(params));
    } else {
      if (!saveCaptcha) {
        submitQuestion(params);
        return;
      }
      saveCaptcha?.check(async () => {
        submitQuestion(params);
      });
    }
  };
  const backPage = () => {
    navigate(-1);
  };

  const handleSelectedRevision = (e) => {
    const index = e.target.value;
    const revision = revisions[index];
    formData.content.value = revision.content?.content || '';
    setImmData({ ...formData });
    setFormData({ ...formData });
  };
  const bool = similarQuestions.length > 0 && !isEdit;
  let pageTitle = t('ask_a_question', { keyPrefix: 'page_title' });
  if (isEdit) {
    pageTitle = t('edit_question', { keyPrefix: 'page_title' });
  }
  usePageTags({
    title: pageTitle,
  });

  // 提取内容中的图片 URL
  useEffect(() => {
    const extractImageUrls = (content: string) => {
      const regex = /!\[.*?\]\((.*?)\)/g; // 匹配 Markdown 图片
      return Array.from(content.matchAll(regex), (match) => match[1]);
    };

    const urls = extractImageUrls(formData.content.value);
    setImageUrls(urls);
  }, [formData.content.value]);

  const handleCustomCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { checked } = e.target;
    setIsCustomCover(!checked); // 如果勾选，则关闭自定义封面
    setFormData((prevFormData) => ({
      ...prevFormData,
      cover_min_size: {
        ...prevFormData.cover_min_size,
        value: checked ? 180000 : 0, // 勾选时设置为系统自动选取封面
      },
    }));
  };

  const handleCoverSelectionChange = (selectedUrls: string[]) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      covers: {
        ...prevFormData.covers,
        value: selectedUrls,
      },
    }));
  };

  return (
    <div className="pt-4 mb-5">
      <h3 className="mb-4">
        {isEdit
          ? t(`${AskEditTitleTypeQuery[contentType]}`)
          : t(`${AskTitleTypeQuery[contentType]}`)}
      </h3>
      <Row>
        <Col className="page-editor-main flex-auto">
          <Form noValidate onSubmit={handleSubmit}>
            {isEdit && (
              <Form.Group controlId="revision" className="mb-3">
                <Form.Label>{t('form.fields.revision.label')}</Form.Label>
                <Form.Select onChange={handleSelectedRevision}>
                  {revisions.map(({ reason, create_at, user_info }, index) => {
                    const date = dayjs(create_at * 1000)
                      .tz()
                      .format(t('long_date_with_time', { keyPrefix: 'dates' }));
                    return (
                      <option key={`${create_at}`} value={index}>
                        {`${date} - ${user_info.display_name} - ${
                          reason ||
                          (index === revisions.length - 1
                            ? t('default_first_reason')
                            : t('default_reason'))
                        }`}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            )}

            <Form.Group controlId="title" className="mb-3">
              <Form.Label>{t('form.fields.title.label')}</Form.Label>
              <Form.Control
                type="text"
                value={formData.title.value}
                isInvalid={formData.title.isInvalid}
                onChange={handleTitleChange}
                placeholder={t(
                  `form.fields.${AskTitleTypeQuery[contentType]}.placeholder`,
                )}
                autoFocus
                contentEditable
              />

              <Form.Control.Feedback type="invalid">
                {formData.title.errorMsg}
              </Form.Control.Feedback>
              {bool && <SearchQuestion similarQuestions={similarQuestions} />}
            </Form.Group>

            <Form.Group controlId="content">
              <Form.Label>{t('form.fields.body.label')}</Form.Label>
              <Form.Control
                defaultValue={formData.content.value}
                isInvalid={formData.content.isInvalid}
                hidden
              />
              <Editor
                value={formData.content.value}
                onChange={handleContentChange}
                cacheKey={qid || `vditor_qid${contentType}`}
                className={classNames(
                  'form-control p-0',
                  focusType === 'content' && 'focus',
                )}
                onFocus={() => {
                  setForceType('content');
                }}
                onBlur={() => {
                  setForceType('');
                }}
                editorPlaceholder={contentPlaceHolder}
                ref={editorRef}
              />
              <Form.Control.Feedback type="invalid">
                {formData.content.errorMsg}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="tags" className="my-3">
              <Form.Label>{t('form.fields.tags.label')}</Form.Label>
              <TagSelector
                value={formData.tags.value}
                onChange={handleTagsChange}
                showRequiredTag
                maxTagLength={5}
                isInvalid={formData.tags.isInvalid}
                errMsg={formData.tags.errorMsg}
              />
            </Form.Group>
            <Form.Group controlId="integral" className="mb-3">
              <Form.Label>{t('form.fields.integral.label')}</Form.Label>
              <Form.Control
                type="number"
                min={0}
                max={currIntegral}
                step={1}
                value={formData.integral.value}
                isInvalid={formData.integral.isInvalid}
                onChange={handleIntegralChange}
                disabled={!!acceptedID && acceptedID !== '0' && isPayType} //! !(acceptedID && isPayType && beginIntegral)
              />
              <Form.Text>
                {t(`${AskIntegralTypeQuery[contentType]}`)}
                <a
                  href="https://cloud.assetbun.com/buy?tab=2"
                  target="_blank"
                  rel="noopener noreferrer">
                  {`${t(`recharge`)} `}
                </a>
                {isPayType && ExternalPayContentType.indexOf(contentType) === -1
                  ? t(`attention`)
                  : ''}
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                {formData.integral.errorMsg}
              </Form.Control.Feedback>
            </Form.Group>
            {isEdit && (
              <Form.Group controlId="edit_summary" className="my-3">
                <Form.Label>{t('form.fields.edit_summary.label')}</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={formData.edit_summary.value}
                  isInvalid={formData.edit_summary.isInvalid}
                  placeholder={t('form.fields.edit_summary.placeholder')}
                  onChange={handleSummaryChange}
                  contentEditable
                />
                <Form.Control.Feedback type="invalid">
                  {formData.edit_summary.errorMsg}
                </Form.Control.Feedback>
              </Form.Group>
            )}

            {/* 自定义封面复选框 */}
            <Form.Group controlId="customCover" className="my-3">
              <Form.Check
                type="checkbox"
                label={t('form.fields.custom_cover.label')}
                checked={!isCustomCover}
                onChange={handleCustomCoverChange}
              />
            </Form.Group>

            {/* 自定义封面选择 */}
            {isCustomCover && (
              <Form.Group controlId="coverSelection" className="my-3">
                <Form.Label>{t('form.fields.select_cover.label')}</Form.Label>
                <div
                  className="d-flex flex-nowrap"
                  style={{
                    overflowX: 'auto', // 允许横向滚动
                    scrollbarWidth: 'none', // 隐藏滚动条（适用于 Firefox）
                    msOverflowStyle: 'none', // 隐藏滚动条（适用于 IE 和 Edge）
                    padding: '4px', // 可选：为内容添加一些内边距
                  }}>
                  {imageUrls.map((url, index) => (
                    <div
                      // eslint-disable-next-line react/no-array-index-key
                      key={`cover_${index}`}
                      className="me-2 mb-2 position-relative">
                      {/* 隐藏的 checkbox */}
                      <Form.Check
                        type="checkbox"
                        id={`cover-${index}`}
                        label="" // 确保没有额外的文本标签影响布局
                        style={{ display: 'none' }} // 直接隐藏整个 Form.Check 输入部分
                        checked={formData.covers.value.includes(url)}
                        onChange={(e) => {
                          const selectedUrls = e.target.checked
                            ? [...formData.covers.value, url]
                            : formData.covers.value.filter(
                                (item) => item !== url,
                              );
                          handleCoverSelectionChange(selectedUrls);
                        }}
                      />
                      {/* 图片作为独立的 label */}
                      <label
                        htmlFor={`cover-${index}`}
                        style={{ cursor: 'pointer', display: 'inline-block' }}>
                        <img
                          src={url}
                          alt={`Cover ${index + 1}`}
                          style={{
                            width: '120px',
                            height: '80px',
                            objectFit: 'cover',
                            border: formData.covers.value.includes(url)
                              ? '3px solid #007bff'
                              : '1px solid #ccc',
                            borderRadius: '4px',
                          }}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </Form.Group>
            )}

            {!checked && (
              <div className="mt-3">
                <Button type="submit" className="me-2">
                  {isEdit
                    ? t('btn_save_edits')
                    : t(`${AskPostContentTypeQuery[contentType]}`)}
                </Button>
                {isEdit && (
                  <Button variant="link" onClick={backPage}>
                    {t('cancel', { keyPrefix: 'btns' })}
                  </Button>
                )}

                {hasDraft && (
                  <Button variant="link" onClick={deleteDraft}>
                    {t('discard_draft', { keyPrefix: 'btns' })}
                  </Button>
                )}
              </div>
            )}
            {!isEdit && (
              <>
                <Form.Check
                  className="mt-5"
                  checked={checked}
                  type="checkbox"
                  label={t('answer_question')}
                  onChange={(e) => setCheckState(e.target.checked)}
                  id="radio-answer"
                />
                {checked && (
                  <Form.Group controlId="answer" className="mt-4">
                    <Form.Label>{t('form.fields.answer.label')}</Form.Label>
                    <Editor
                      value={formData.answer_content.value}
                      onChange={handleAnswerChange}
                      ref={editorRef2}
                      cacheKey={`vditor_qid_answer${contentType}`}
                      className={classNames(
                        'form-control p-0',
                        focusType === 'answer' && 'focus',
                      )}
                      onFocus={() => {
                        setForceType('answer');
                      }}
                      onBlur={() => {
                        setForceType('');
                      }}
                    />
                    <Form.Control
                      type="text"
                      isInvalid={formData.answer_content.isInvalid}
                      hidden
                    />
                    <Form.Control.Feedback type="invalid">
                      {formData.answer_content.errorMsg}
                    </Form.Control.Feedback>
                  </Form.Group>
                )}
              </>
            )}
            {checked && (
              <div className="mt-3">
                <Button type="submit">{t('post_question&answer')}</Button>
                {hasDraft && (
                  <Button variant="link" className="ms-2" onClick={deleteDraft}>
                    {t('discard_draft', { keyPrefix: 'btns' })}
                  </Button>
                )}
              </div>
            )}
          </Form>
        </Col>
        {/* <FormatPanel /> */}
      </Row>
    </div>
  );
};

export default Ask;
