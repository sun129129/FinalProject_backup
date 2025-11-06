// src/hooks/useAuth.js

import { useUserStore } from '../store/userStore';

/**
 * Auth 관련 상태와 함수를 쉽게 가져다 쓰기 위한 커스텀 훅
 */
export const useAuth = () => {
  // [수정] 스토어의 전체 상태를 구독하여 모든 변경에 반응하도록 합니다.
  const { user, token, login, logout } = useUserStore();

  // '로그인 여부'를 boolean 값으로 편하게 계산
  const isLoggedIn = !!user; // user 객체가 있으면 true, null이면 false

  // 객체로 묶어서 반환
  return {
    user,
    token,
    isLoggedIn,
    login,
    logout,
  };
};

/*
  [사용 예시]
  
  ❌ [기존]
  const user = useUserStore((state) => state.user);
  const login = useUserStore((state) => state.login);

  ✅ [이 훅 사용 시]
  const { user, login } = useAuth();
*/