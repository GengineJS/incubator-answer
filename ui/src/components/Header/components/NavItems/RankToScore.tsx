import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { Modal as RankConfirm } from '@/components';
import { getLoggedUserInfo, updateUserExchange } from '@/services';
import { useToast } from '@/hooks';

export const RankToPointsModal = ({ show, onHide, onExchange }) => {
  const [rankScore, setRankScore] = useState(0);
  const [userRank, setUserRank] = useState(0);
  const [changedScore, setChangedScore] = useState(0);
  const [changeScore, setChangeScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const { t } = useTranslation('translation', { keyPrefix: 'ranks' });
  const Toast = useToast();
  const currContract = useRef();
  const calculateMaxExchange = (uRank, rank2Point) => {
    const max = Math.floor(uRank / rank2Point);
    setMaxScore(max);
    return max;
  };
  useEffect(() => {
    getLoggedUserInfo().then((resp) => {
      const userRankVal = resp.rank;
      let rank_score_val = resp.rank_score;
      if (resp.contract) {
        rank_score_val = resp.contract.contract_info.rank_to_point;
      }
      currContract.current = resp.contract;
      setRankScore(rank_score_val);
      setUserRank(userRankVal);
      calculateMaxExchange(userRankVal, rank_score_val);
    });
  }, []);
  // useEffect(() => {
  //
  // }, [rankScore, userRank]);
  const handleExchange = () => {
    onHide();
    if (changedScore > 0) {
      onExchange(changedScore);
      RankConfirm.confirm({
        title: t('exchange_confirm'),
        centered: true,
        content: t('content_confirm', {
          rank: userRank,
          currScore: changedScore,
          remaining: userRank - changedScore * rankScore,
        }),
        cancelBtnVariant: 'link',
        confirmBtnVariant: 'danger',
        confirmText: t('confirm'),
        onConfirm: () => {
          updateUserExchange({
            exchange_rank: changedScore * rankScore,
            score: changedScore,
          })
            .then(() => {
              Toast.onShow({
                msg: t('update', { keyPrefix: 'toast' }),
                variant: 'success',
              });
            })
            .catch(() => {});
        },
      });
    } else {
      Toast.onShow({
        msg: t('rank_score_short', { keyPrefix: 'toast' }),
        variant: 'warning',
      });
    }
  };

  const onChanged = (e) => {
    const value = Math.floor(parseFloat(e.target.value));

    // 如果输入值是NaN或者无效值，则设置为0
    if (Number.isNaN(value) || value === undefined || value === null) {
      setChangedScore(0);
      setChangeScore(0);
    } else {
      // 确保输入值不会超过最大可兑换积分，并且不会小于0
      const newValue = Math.min(Math.max(0, value), maxScore);
      setChangedScore(newValue);
      setChangeScore(newValue);
    }
  };
  const handleFormSubmit = (e) => {
    e.preventDefault(); // 阻止表单默认提交行为
  };
  return (
    <Modal centered show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal_title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group controlId="reputation">
            <Form.Label>{t('exchange_val')}</Form.Label>
            <Form.Control
              type="number"
              placeholder={t('placeholder')}
              value={changeScore}
              onChange={(e) => {
                setChangeScore(Math.floor(parseFloat(e.target.value)));
              }}
              onBlur={onChanged}
              min={0}
              max={maxScore}
            />
            <Form.Text className="text-muted">
              {t('content', {
                rank: userRank,
                maxScore,
                remaining: userRank - changedScore * rankScore,
              })}
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t('close')}
        </Button>
        <Button variant="primary" onClick={handleExchange}>
          {t('exchange')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
