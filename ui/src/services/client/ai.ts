import request from '@/utils/request';

export const postAIAnswer = (qid) => {
  return request.post('/answer/api/v1/question/recover', {
    question_id: qid,
  });
};
