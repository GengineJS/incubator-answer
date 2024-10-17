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

import { useState, useEffect } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import classNames from 'classnames';
import unionBy from 'lodash/unionBy';

import * as Types from '@/common/interface';
import { Icon, ImgViewer, Modal } from '@/components';
import { usePageUsers, useReportModal, useCaptchaModal } from '@/hooks';
import {
  matchedUsers,
  parseUserInfo,
  scrollToElementTop,
  bgFadeOut,
} from '@/utils';
import { tryNormalLogged } from '@/utils/guard';
import { useCaptchaPlugin } from '@/utils/pluginKit';
import {
  useQueryComments,
  addComment,
  deleteComment,
  updateComment,
  postVote,
  addAIComment,
} from '@/services';
import { commentReplyStore, loggedUserInfoStore } from '@/stores';
import AILoading from '../AILoding';
import { SseService } from '@/common/functions';

import { Form, ActionBar, Reply } from './components';

import './index.scss';

const Comment = ({ objectId, isObjectAI = false, mode, commentId }) => {
  const pageUsers = usePageUsers();
  const [pageIndex, setPageIndex] = useState(0);
  const [visibleComment, setVisibleComment] = useState(false);
  const { id: currentReplyId, update: updateCurrentReplyId } =
    commentReplyStore();
  const pageSize = pageIndex === 0 ? 3 : 15;
  const { data, mutate } = useQueryComments({
    object_id: objectId,
    comment_id: commentId,
    page: pageIndex,
    page_size: pageSize,
  });
  const [comments, setComments] = useState<any>([]);
  const [aiLoading, setAILoading] = useState(false);
  const userInfo = loggedUserInfoStore((state) => state.user);
  SseService.GetInstance().addAICallback('AIComment', (eve) => {
    if (!aiLoading) {
      return;
    }
    const info = eve.data;
    const answerInfo = JSON.parse(info);
    if (answerInfo.user_id === userInfo.id) {
      SseService.GetInstance().removeAIEventListener();
      setAILoading(false);
      window.location.reload();
    }
  });
  const reportModal = useReportModal();

  const addCaptcha = useCaptchaModal('comment');
  const editCaptcha = useCaptchaPlugin('edit');
  const dCaptcha = useCaptchaPlugin('delete');
  const vCaptcha = useCaptchaPlugin('vote');

  const { t } = useTranslation('translation', { keyPrefix: 'comment' });

  useEffect(() => {
    if (pageIndex === 0 && commentId && comments.length !== 0) {
      setTimeout(() => {
        const el = document.getElementById(commentId);
        scrollToElementTop(el);
        bgFadeOut(el);
      }, 100);
    }

    return () => {
      updateCurrentReplyId('');
    };
  }, [comments]);

  useEffect(() => {
    if (!data) {
      return;
    }
    if (data.count <= 3) {
      data.list.sort((a, b) => a.created_at - b.created_at);
    }
    if (pageIndex === 1 || pageIndex === 0) {
      setComments(data?.list);
    } else {
      setComments([...comments, ...data.list]);
    }
    const user: Types.PageUser[] = [];
    data.list.forEach((item) => {
      user.push({
        id: item.user_id,
        displayName: item.user_display_name,
        userName: item.username,
      });
      user.push({
        id: item.reply_comment_id,
        displayName: item.reply_user_display_name,
        userName: item.username,
      });
    });
    pageUsers.setUsers(user);
  }, [data]);

  const handleReply = (id) => {
    if (!tryNormalLogged(true)) {
      return;
    }
    comments.forEach((item) => {
      if (item.comment_id === id) {
        updateCurrentReplyId(id);
      }
    });
  };

  const handleEdit = (id) => {
    setComments(
      comments.map((item) => {
        if (item.comment_id === id) {
          item.showEdit = !item.showEdit;
        }
        return item;
      }),
    );
  };

  const submitUpdateComment = (params, item) => {
    const up = {
      ...params,
      comment_id: item.comment_id,
      captcha_code: undefined,
      captcha_id: undefined,
    };
    editCaptcha?.resolveCaptchaReq(up);

    return updateComment(up)
      .then(async (res) => {
        await editCaptcha?.close();
        setComments(
          comments.map((comment) => {
            if (comment.comment_id === item.comment_id) {
              comment.showEdit = false;
              comment.parsed_text = res.parsed_text;
              comment.original_text = res.original_text;
            }
            return comment;
          }),
        );
      })
      .catch((err) => {
        if (err.isError) {
          const captchaErr = editCaptcha?.handleCaptchaError(err.list);
          // If it is not a CAPTCHA error, leave it to the subsequent error handling logic to continue processing.
          if (!(captchaErr && err.list.length === 1)) {
            return Promise.reject(err);
          }
        }
        return Promise.resolve();
      });
  };

  const submitAddComment = (params, item) => {
    const req = {
      ...params,
      captcha_code: undefined,
      captcha_id: undefined,
    };
    addCaptcha?.resolveCaptchaReq(req);

    return (item.isAI ? addAIComment(req) : addComment(req))
      .then(async (res) => {
        await addCaptcha?.close();
        if (item.type === 'reply') {
          const index = comments.findIndex(
            (comment) => comment.comment_id === item.comment_id,
          );
          updateCurrentReplyId('');
          comments.splice(index + 1, 0, res);
          setComments([...comments]);
        } else {
          setComments([
            ...comments.map((comment) => {
              if (comment.comment_id === item.comment_id) {
                updateCurrentReplyId('');
              }
              return comment;
            }),
            res,
          ]);
        }

        setVisibleComment(false);
        if (item.isAI) {
          SseService.GetInstance().removeAIEventListener();
          setAILoading(false);
        }
      })
      .catch((ex) => {
        if (ex.isError) {
          const captchaErr = addCaptcha?.handleCaptchaError(ex.list);
          // If it is not a CAPTCHA error, leave it to the subsequent error handling logic to continue processing.
          if (!(captchaErr && ex.list.length === 1)) {
            return Promise.reject(ex);
          }
        }
        return Promise.resolve();
      });
  };

  const handleSendReply = (item) => {
    const users = matchedUsers(item.value);
    const userNames = unionBy(users.map((user) => user.userName));
    const commentMarkDown = parseUserInfo(item.value);

    const params = {
      object_id: objectId,
      original_text: commentMarkDown,
      mention_username_list: userNames,
      ...(item.type === 'reply'
        ? {
            reply_comment_id: item.comment_id,
          }
        : {}),
    };

    if (item.type === 'edit') {
      if (!editCaptcha) {
        return submitUpdateComment(params, item);
      }
      return editCaptcha.check(() => submitUpdateComment(params, item));
    }

    if (!addCaptcha) {
      return submitAddComment(params, item);
    }

    return addCaptcha.check(() => submitAddComment(params, item));
  };

  const submitDeleteComment = (id) => {
    const imgCode = { captcha_id: undefined, captcha_code: undefined };
    dCaptcha?.resolveCaptchaReq(imgCode);

    deleteComment(id, imgCode)
      .then(async () => {
        await dCaptcha?.close();
        if (pageIndex === 0) {
          mutate();
        }
        setComments(comments.filter((item) => item.comment_id !== id));
      })
      .catch((ex) => {
        if (ex.isError) {
          dCaptcha?.handleCaptchaError(ex.list);
        }
      });
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: t('title', { keyPrefix: 'delete' }),
      content: t('other', { keyPrefix: 'delete' }),
      confirmBtnVariant: 'danger',
      confirmText: t('delete', { keyPrefix: 'btns' }),
      onConfirm: () => {
        if (!dCaptcha) {
          submitDeleteComment(id);
          return;
        }
        dCaptcha.check(() => {
          submitDeleteComment(id);
        });
      },
    });
  };

  const submitVoteComment = (id, is_cancel) => {
    const imgCode: Types.ImgCodeReq = {
      captcha_id: undefined,
      captcha_code: undefined,
    };
    vCaptcha?.resolveCaptchaReq(imgCode);

    postVote(
      {
        object_id: id,
        is_cancel,
        ...imgCode,
      },
      'up',
    )
      .then(async () => {
        await vCaptcha?.close();
        setComments(
          comments.map((item) => {
            if (item.comment_id === id) {
              item.vote_count = is_cancel
                ? item.vote_count - 1
                : item.vote_count + 1;
              item.is_vote = !is_cancel;
            }
            return item;
          }),
        );
      })
      .catch((ex) => {
        if (ex.isError) {
          vCaptcha?.handleCaptchaError(ex.list);
        }
      });
  };
  const handleVote = (id, is_cancel) => {
    if (!tryNormalLogged(true)) {
      return;
    }

    if (!vCaptcha) {
      submitVoteComment(id, is_cancel);
      return;
    }

    vCaptcha.check(() => {
      submitVoteComment(id, is_cancel);
    });
  };

  const handleAction = ({ action }, item) => {
    if (!tryNormalLogged(true)) {
      return;
    }
    if (action === 'report') {
      reportModal.onShow({
        id: item.comment_id,
        type: 'comment',
        action: 'flag',
      });
    } else if (action === 'delete') {
      handleDelete(item.comment_id);
    } else if (action === 'edit') {
      handleEdit(item.comment_id);
    }
  };

  const handleCancel = (id) => {
    setComments(
      comments.map((item) => {
        if (item.comment_id === id) {
          item.showEdit = false;
          updateCurrentReplyId('');
        }
        return item;
      }),
    );
  };
  let aiCommented = false;
  return (
    <div
      className={classNames(
        'comments-wrap',
        comments.length > 0 && 'bg-light px-3 py-2 rounded',
      )}>
      <AILoading loading={aiLoading} color="#3f51b5" />
      {comments.map((item) => {
        // eslint-disable-next-line no-lone-blocks
        {
          if (!aiCommented) aiCommented = item.is_ai;
        }
        return (
          <div
            key={item.comment_id}
            id={item.comment_id}
            className="py-2 comment-item">
            {item.showEdit ? (
              <Form
                className="mt-2"
                value={item.original_text}
                type="edit"
                mode={mode}
                onSendReply={(value) =>
                  handleSendReply({ ...item, value, type: 'edit' })
                }
                onCancel={() => handleCancel(item.comment_id)}
              />
            ) : (
              <div className="d-block">
                {item.reply_user_display_name && (
                  <Link to="." className="small me-1 text-nowrap">
                    @{item.reply_user_display_name}
                  </Link>
                )}
                {item.is_ai ? (
                  <ImgViewer>
                    <article
                      className="fmt small text-break text-wrap"
                      dangerouslySetInnerHTML={{ __html: item.parsed_text }}
                    />
                  </ImgViewer>
                ) : (
                  <div
                    className="fmt small text-break text-wrap"
                    dangerouslySetInnerHTML={{ __html: item.parsed_text }}
                  />
                )}
                {item.is_ai && (
                  <div className="fmt fs-7 small text-secondary text-break text-wrap">
                    ({t('ai_commented')})
                  </div>
                )}
              </div>
            )}

            {currentReplyId === item.comment_id ? (
              <Reply
                userName={item.user_display_name}
                mode={mode}
                onSendReply={(value) =>
                  handleSendReply({ ...item, value, type: 'reply' })
                }
                onCancel={() => handleCancel(item.comment_id)}
              />
            ) : null}
            {item.showEdit || currentReplyId === item.comment_id ? null : (
              <ActionBar
                nickName={item.user_display_name}
                username={item.username}
                createdAt={item.created_at}
                voteCount={item.vote_count}
                mode={mode}
                aiReplied={item.ai_replied}
                isAI={item.is_ai}
                isVote={item.is_vote}
                memberActions={item.member_actions}
                userStatus={item.user_status}
                onReply={() => {
                  handleReply(item.comment_id);
                }}
                onAIReply={() => {
                  SseService.GetInstance().addAIEventListener();
                  setAILoading(true);
                  handleSendReply({
                    ...item,
                    value: 'AIReply',
                    type: 'reply',
                    isAI: true,
                  });
                }}
                onAction={(action) => handleAction(action, item)}
                onVote={(e) => {
                  e.preventDefault();
                  handleVote(item.comment_id, item.is_vote);
                }}
              />
            )}
          </div>
        );
      })}

      <div
        className={classNames(
          comments.length > 0 && 'py-2 d-flex align-items-left',
        )}>
        <Button
          variant="link"
          className="p-0 me-3 btn-no-border"
          size="sm"
          onClick={() => {
            if (tryNormalLogged(true)) {
              setVisibleComment(!visibleComment);
            }
          }}>
          {mode !== 'question'
            ? t('btn_add_comment')
            : t('btn_add_subject_comment')}
        </Button>
        {mode !== 'question' &&
          !isObjectAI &&
          (!aiCommented ? (
            <Button
              variant="link"
              className="p-0 btn-no-border"
              size="sm"
              onClick={() => {
                if (tryNormalLogged(true)) {
                  SseService.GetInstance().addAIEventListener();
                  setAILoading(true);
                  handleSendReply({
                    value: 'AIReply',
                    type: 'comment',
                    isAI: true,
                  });
                }
              }}>
              {t('btn_ai_add_comment')}
            </Button>
          ) : (
            <div className="lh-1 m-0">
              <Badge bg="secondary" pill>
                <Icon name="check-circle-fill  me-1" />
                {t('btn_dis_ai_reply')}
              </Badge>
            </div>
          ))}
        {data &&
          (pageIndex || 1) < Math.ceil((data?.count || 0) / pageSize) && (
            <Button
              variant="link"
              size="sm"
              className="p-0 ms-3 btn-no-border"
              onClick={() => {
                setPageIndex(pageIndex + 1);
              }}>
              {t('show_more', {
                count:
                  data.count - (pageIndex === 0 ? 3 : pageIndex * pageSize),
              })}
            </Button>
          )}
      </div>

      {visibleComment && (
        <Form
          mode={mode}
          className={classNames(
            'mt-2',
            comments.length <= 0 && 'bg-light p-3 rounded',
          )}
          onSendReply={(value) => handleSendReply({ value, type: 'comment' })}
          onCancel={() => setVisibleComment(!visibleComment)}
        />
      )}
    </div>
  );
};

export default Comment;
