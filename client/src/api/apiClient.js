// src/api/apiClient.js

import axios from 'axios';
import { useUserStore } from '../store/userStore'; // 1. Zustand 스토어 가져오기

// 2. FastAPI 서버의 기본 URL (http://127.0.0.1:8000)
//    (Vite는 'process'를 모르기 때문에, 이렇게 주소를 '직접' 적어줘야 해!)
const API_BASE_URL = 'http://127.0.0.1:8000'; // (여기가 7번째 줄 근처일 거야)

// 3. axios '인스턴스' 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 4. [핵심] '요청(Request) 가로채기' (인터셉터)
apiClient.interceptors.request.use(
  (config) => {
    // 5. Zustand 스토어에서 'token'을 꺼냄
    const { token } = useUserStore.getState();

    if (token) {
      // 6. [오타 수정 완료!] 토큰이 있으면, HTTP 헤더에 'Authorization'으로 실어 보냄
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 5. '응답(Response) 가로채기'
apiClient.interceptors.response.use(
  (response) => {
    // 200번대 응답은 'response.data'만 깔끔하게 반환
    return response.data;
  },
  async (error) => {
    // 401 (Unauthorized) 에러 (토큰 만료 등)가 떴을 때
    if (error.response?.status === 401) {
      // (지금은) 일단 '로그아웃' 시키고 로그인 페이지로 쫓아내기
      useUserStore.getState().logout();
      window.location.href = '/login'; 
    }
    
    // FastAPI가 보낸 에러 메시지({ "detail": "..." })를 뽑아내기
    const errorMessage = error.response?.data?.detail || error.message;
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;