// src/store/userStore.js

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// 'persist' 미들웨어는 앱을 껐다 켜도 로그인 상태를
// 'localStorage'에 저장해서 기억하게 해주는 마법사야!
export const useUserStore = create(
  persist(
    (set) => ({
      // 1. 상태 (State)
      user: null, // 로그인한 사용자 정보 (예: { name: '홍길동', email: '...' })
      token: null, // 서버에서 받은 JWT 토큰

      // 2. 행동 (Actions)
      
      /**
       * 로그인 시 호출할 함수
       * @param {object} userData - 서버에서 받은 사용자 정보
       * @param {string} tokenData - 서버에서 받은 JWT 토큰
       */
      login: (userData, tokenData) =>
        set({
          user: userData,
          token: tokenData,
        }),

      /**
       * 로그아웃 시 호출할 함수
       */
      logout: () =>
        set({
          user: null,
          token: null,
        }),
    }),
    {
      name: 'user-storage', // localStorage에 저장될 때 사용될 키 이름
      storage: createJSONStorage(() => localStorage), // (선택) localStorage 사용
    }
  )
);