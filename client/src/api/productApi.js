// src/api/productApi.js
import apiClient from './apiClient';

/**
 * [프론트엔드 API] 제품(영양제) 자연어 검색
 * 
 * 백엔드의 'POST /api/v1/products/natural-search' 엔드포인트를 호출하여 제품을 검색합니다.
 * 
 * @param {string} query - 사용자가 입력한 자연어 검색어.
 * @returns {Promise<object>} 검색 유형(`search_type`)과 결과 데이터(`data`)를 포함하는 객체를 Promise로 반환합니다.
 * 
 * [개발자 안내]
 * - 백엔드 API는 사용자의 질의를 '추천형', '정보형' 등으로 분류하고,
 *   그에 맞는 구조의 데이터를 반환합니다.
 * - 이 함수는 백엔드가 반환하는 `NaturalSearchResponse` 스키마 전체를 반환합니다.
 *   호출하는 컴포넌트(예: `SearchScreen.jsx`)에서 `response.search_type`에 따라
 *   결과를 다르게 처리해야 합니다.
 */
export const searchProducts = (query) => {
  // 검색어가 비어있을 경우 API 호출 없이 빈 응답 객체를 즉시 반환합니다.
  if (!query || query.trim() === '') {
    return Promise.resolve({ search_type: 'unknown', data: [], message: '검색어를 입력해주세요.' });
  }

  // apiClient를 사용하여 POST 요청을 보냅니다.
  // 요청 바디에 `{ "query": "검색어" }` 형식으로 담아 보냅니다.
  return apiClient.post('/products/natural-search', { query });
};
