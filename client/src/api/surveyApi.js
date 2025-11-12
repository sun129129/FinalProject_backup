// src/api/surveyApi.js

import apiClient from './apiClient'; // '전화기 본체' (axios 인스턴스)

// ----------------------------------------------------------------------
// ❗️ [신규 추가] 1. (GET) '키워드' 목록 전체 가져오기
// (백엔드: GET /api/v1/survey/keywords)
// ----------------------------------------------------------------------
export const getKeywordList = () => {
  return apiClient.get('/survey/keywords');
  // (성공 시, [{ keyword_id: 1, keyword_nm: "피로/활력" }, ...])
};

// ----------------------------------------------------------------------
// ❗️ [수정] 2. (GET) '선택된 키워드'의 질문 목록만 가져오기
// (백엔드: GET /api/v1/survey/questions?ids=1,2,3)
// ----------------------------------------------------------------------
/**
 * @param {number[]} keywordIds - (예: [1, 3, 5])
 */
export const getQuestionsByKeywords = (keywordIds) => {
  if (!keywordIds || keywordIds.length === 0) {
    // ID가 없으면 API를 호출하지 않고 빈 배열을 반환 (Promise)
    return Promise.resolve({ data: [] });
  }

  // ID 배열 [1, 3, 5] -> "1,3,5" 문자열로 변환
  const idString = keywordIds.join(',');

  // 쿼리 파라미터로 전송
  return apiClient.get(`/survey/questions?ids=${idString}`);
  // (성공 시, [{ question_id: 101, question: "...", keyword_id: 1, keyword_nm: "피로/활력" }, ...])
};

// ----------------------------------------------------------------------
// [변경 없음] 3. (POST) 설문 답변 제출하기
// (백엔드: POST /api/v1/survey/submit)
// ----------------------------------------------------------------------
/**
 * @param {Array} answers - [{ question_id: 101, answer: 2 }, ...]
 */
export const submitSurveyAnswers = (answers) => {
  // 'answers' 배열 자체를 body로 전송 (FastAPI가 List[schemas.AnswerSubmit]를 기대)
  return apiClient.post('/survey/submit', answers);
  // (성공 시, { message: "..." })
};

// ----------------------------------------------------------------------
// [변경 없음] 4. (GET) 설문 결과(점수) 가져오기
// (백엔드: GET /api/v1/survey/results)
// ----------------------------------------------------------------------
export const getSurveyResults = () => {
  return apiClient.get('/survey/results');
  // (성공 시, [{ keyword_id: 1, keyword_nm: "피로", survey_score: 85.0 }, ...])
};

// ----------------------------------------------------------------------
// ❗️ [삭제] 기존 getSurveyQuestions는 getQuestionsByKeywords로 대체됨
// ----------------------------------------------------------------------
/*
export const getSurveyQuestions = () => {
  return apiClient.get('/survey/questions');
};
*/