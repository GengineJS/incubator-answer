import { ContentType } from '@/common/constants';

export function getUrlQueryParam(key: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}

export function getUrlQuestionType(key: string = 'content_type'): number {
  const param = getUrlQueryParam(key);
  return param ? parseInt(param, 10) : ContentType.QUESTION;
}
