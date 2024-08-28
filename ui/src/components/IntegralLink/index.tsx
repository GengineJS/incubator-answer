import { Icon } from '@/components';
import { hasPayType } from '@/common/constants';
// import { loggedUserInfoStore } from '@/stores';

const IntegralLink = ({ score, t, contentType, isPay = false }) => {
  if (score <= 0) {
    return null;
  }
  // const user = loggedUserInfoStore((state) => state.user);
  // const offsetScore = score - user.score;

  const handleClick = (e) => {
    e.preventDefault();
    window.open(`https://cloud.assetbun.com/buy?tab=2&buy=${score}`, '_blank');
  };
  const isPayType = hasPayType(contentType);
  return (
    <a
      className="badge-tag rounded-5 ms-2"
      href="./"
      target="_blank"
      rel="noreferrer"
      style={{ color: 'gold' }}
      onClick={handleClick}>
      {isPayType ||
        (isPay ? (
          <Icon name="unlock-fill me-1" />
        ) : (
          <Icon name="lock-fill me-1" />
        ))}
      {score}
      {`${t('integral')}(${score / 10}¥)`}
    </a>
  );
};

export default IntegralLink;
