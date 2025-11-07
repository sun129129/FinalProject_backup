// src/api/surveyApi.js

import apiClient from './apiClient'; // '전화기 본체' (axios 인스턴스)

/**
 * 1. (GET) 설문 질문 목록 가져오기
 * (apiClient가 자동으로 '로그인 토큰'을 헤더에 실어 보냄)
 */
export const getSurveyQuestions = () => {
  return apiClient.get('/survey/questions');
  // (성공 시, [{ question_id: 101, question: "..." }, ...])
};

/**
 * 2. (POST) 설문 답변 제출하기
 * @param {Array} answers - [{ question_id: 101, answer: 1 }, ...]
 */
export const submitSurveyAnswers = (answers) => {
  return apiClient.post('/survey/submit', answers);
  // (성공 시, { message: "..." })
};

/**
 * 3. (GET) 설문 결과(점수) 가져오기
 * (LLM이 분석한 'product_score' 테이블의 점수)
 */
export const getSurveyResults = () => {
  return apiClient.get('/survey/results');
  // (성공 시, [{ keyword_id: 1, keyword_nm: "피로", survey_score: 85.0 }, ...])
};