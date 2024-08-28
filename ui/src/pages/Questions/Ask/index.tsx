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
import { Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import dayjs from 'dayjs';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';

import { usePageTags, usePromptWithUnload } from '@/hooks';
import { Editor, EditorRef, TagSelector } from '@/components';
import type * as Type from '@/common/interface';
import {
  ContentType,
  DRAFT_QUESTION_STORAGE_KEY,
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
  const [blockState, setBlockState] = useState(false);
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
        setBlockState(true);
      } else {
        setBlockState(false);
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
      setBlockState(true);
    } else {
      removeDraft();
      setBlockState(false);
    }
  }, [formData]);

  usePromptWithUnload({
    when: blockState,
  });
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
  useEffect(() => {
    if (!isEdit) {
      return;
    }
    questionDetail(qid).then((res) => {
      setAcceptedID(res.accepted_answer_id);
      formData.title.value = res.title;
      formData.content.value = res.content;
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
    setFormData({
      ...formData,
      content: { ...formData.content, value, errorMsg: '' },
    });
  };
  const handleTagsChange = (value) =>
    setFormData({
      ...formData,
      tags: { ...formData.tags, value, errorMsg: '' },
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
    setBlockState(false);
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
    setBlockState(false);
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
  return (
    <div className="pt-4 mb-5">
      <h3 className="mb-4">
        {isEdit
          ? t(`${AskEditTitleTypeQuery[contentType]}`)
          : t(`${AskTitleTypeQuery[contentType]}`)}
      </h3>
      <Row>
        <Col className="page-main flex-auto">
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
              <Form.Control
                defaultValue={JSON.stringify(formData.tags.value)}
                isInvalid={formData.tags.isInvalid}
                hidden
              />
              <TagSelector
                value={formData.tags.value}
                onChange={handleTagsChange}
                showRequiredTag
                maxTagLength={5}
              />
              <Form.Control.Feedback type="invalid">
                {formData.tags.errorMsg}
              </Form.Control.Feedback>
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
                {isPayType ? t(`attention`) : ''}
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
        <Col className="page-right-side mt-4 mt-xl-0">
          <Card>
            <Card.Header>
              {t('title', { keyPrefix: 'how_to_format' })}
            </Card.Header>
            <Card.Body
              className="fmt small"
              dangerouslySetInnerHTML={{
                __html: t('desc', { keyPrefix: 'how_to_format' }),
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Ask;
