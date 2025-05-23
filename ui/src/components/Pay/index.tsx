import { hasPayCanOpenType, isModerator } from '@/common/constants';
import { pathFactory } from '@/router/pathFactory';
import { Modal } from '@/components';
import { buyQuestion } from '@/services';

// useTranslation('translation', { keyPrefix: 'question' });
const handleOpenPayScore = (
  t,
  navigate,
  user,
  question,
  login_detail,
  path = '',
  submit: any = null,
  cancel: any = null,
) => {
  const contentType = question.content_type;
  const isPayType = hasPayCanOpenType(contentType);
  const integral = question.score;
  const isLogin = user && user.access_token;
  if ((!isPayType && integral && !isLogin) || (login_detail && !isLogin)) {
    navigate('/users/login');
    return;
  }
  path =
    path ||
    pathFactory.questionLanding(
      question.id,
      `${question.url_title}`,
      question.content_type,
    );
  if (
    isPayType ||
    !integral ||
    isModerator(question, user) ||
    question.buyer_user_ids.indexOf(user.id) !== -1
  ) {
    navigate(path);
  } else if (integral > 0) {
    Modal.confirm({
      title: t('score_payment'),
      content: t('is_score_payment'),
      cancelBtnVariant: 'link',
      confirmBtnVariant: 'danger',
      confirmText: t('unlock'),
      onConfirm: () => {
        if (user.score >= integral) {
          buyQuestion({
            user_id: user.id!,
            question_id: question.id! || question.question_id,
          })
            .then(() => {
              navigate(path);
            })
            .catch((reason) => {
              console.error(reason);
            });
        } else {
          window.open(
            `https://cloud.assetbun.com/buy?tab=2&buy=${integral - user.score}`,
            '_blank',
          );
          if (submit) submit();
        }
      },
      onCancel: () => {
        if (cancel) cancel();
      },
    });
  }
};

export default handleOpenPayScore;
