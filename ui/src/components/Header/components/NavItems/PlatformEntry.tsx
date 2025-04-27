import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { getLoggedUserInfo, updateUserContract } from '@/services';
import { formatNumber } from '@/common/functions';
import { useToast } from '@/hooks';

const notEnoughKey = 'not_enough';
const defaultKey = 'default';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const PlatformEntryModal = ({ show, onHide, onEntry }) => {
  const [userRank, setUserRank] = useState(0);
  const { t } = useTranslation('translation', { keyPrefix: 'ranks' });
  const [contractList, setContractList] = useState<any>([]);
  const [, setContracted] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState(''); // 当前选中的选项
  const isNotEnoughRef = useRef(false);
  const isOptionDefaultRef = useRef(false);
  const contractedMap = useRef(new Map());
  const Toast = useToast();
  useEffect(() => {
    getLoggedUserInfo().then((resp) => {
      const userRankVal = resp.rank;
      setContractList(resp.contract_list);
      setContracted(resp.contracted);
      isNotEnoughRef.current = false;
      isOptionDefaultRef.current = false;
      if (resp.contract) {
        setSelectedOption(resp.contract.contract_info.title);
      } else if (resp.contract_list && resp.contract_list.length) {
        const firstLevel = resp.contract_list[0];
        if (userRankVal < firstLevel.redeem_rank_points) {
          isNotEnoughRef.current = true;
          setSelectedOption(notEnoughKey);
        } else {
          isOptionDefaultRef.current = true;
          setSelectedOption(defaultKey);
        }
      }
      resp.contract_list.forEach((contract) => {
        if (resp.contracted) {
          resp.contracted.forEach((contracted) => {
            if (
              contracted.contract_info_id === contract.id &&
              contracted.status === 1
            ) {
              contractedMap.current.set(contract.title, contract);
            }
          });
        }
      });
      setUserRank(userRankVal);
    });
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault(); // 阻止表单默认提交行为
  };
  const entryAction = () => {
    if (selectedOption !== defaultKey && selectedOption !== notEnoughKey) {
      onEntry();
      const selected = contractList.find((opt) => opt.title === selectedOption);
      updateUserContract({
        contract_info_id: selected.id,
      })
        .then(() => {
          Toast.onShow({
            msg: t('update', { keyPrefix: 'toast' }),
            variant: 'success',
          });
        })
        .catch(() => {
          Toast.onShow({
            msg: t('failed', { keyPrefix: 'toast' }),
            variant: 'warning',
          });
        });
    }
    onHide();
  };

  // const [changeScore, setChangeScore] = useState(0); // 当前选项所需声望
  return (
    <Modal centered show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('platform_entry_title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group controlId="reputation">
            <Form.Label>{t('creator_level_selection')}</Form.Label>
            <Form.Control
              as="select"
              value={selectedOption} // 当前选中的选项
              onChange={(e) => {
                const selected = contractList.find(
                  (opt) => opt.title === e.target.value,
                );
                // @ts-ignore
                setSelectedOption(selected.title); // 更新选中的选项
              }}>
              {/* 如果没有可访问的选项，则显示提示 */}
              {isOptionDefaultRef.current && (
                <option value="default" disabled>
                  {t('default_option')}
                </option>
              )}
              {isNotEnoughRef.current && (
                <option value="not_enough" disabled>
                  {t('not_enough_option')}
                </option>
              )}
              {contractList.map((option) => (
                <option
                  key={option.title}
                  value={option.title}
                  disabled={
                    userRank < option.redeem_rank_points &&
                    !contractedMap.current.has(option.title)
                  } // 根据用户声望禁用选项
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: `${t('contract_option', {
                        title: option.title,
                        redeem_rank_points: formatNumber(
                          option.redeem_rank_points,
                          5,
                        ),
                        rank_to_point: formatNumber(
                          option.rank,
                          3 - (option.point.toString().length - 1),
                          false,
                        ),
                        ratio: option.point,
                      })}${contractedMap.current.has(option.title) ? t('entered') : ''}`,
                    }}
                  />
                </option>
              ))}
            </Form.Control>
            <Form.Text className="text-muted">
              {t('platform_entry_tip')}
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t('close')}
        </Button>
        <Button
          variant="primary"
          disabled={isNotEnoughRef.current}
          onClick={entryAction}>
          {t('entry')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
