// src/api/authApi.js

import apiClient from './apiClient'; // 1. 우리가 만든 '전화기 본체' (axios 인스턴스)

/**
 * 1. 로그인 요청 (FastAPI의 OAuth2 표준 방식)
 * * 🚨 [중요!] 🚨
 * FastAPI의 'OAuth2PasswordRequestForm'은 JSON이 아니라
 * 'application/x-www-form-urlencoded' (폼 데이터) 형식으로 받음!
 * * @param {string} email - 사용자가 입력한 이메일
 * @param {string} password - 사용자가 입력한 비밀번호
 */
export const loginUser = async (email, password) => {
  // 2. 'URLSearchParams'를 사용해 '폼 데이터' 형식 생성
  const formData = new URLSearchParams();
  formData.append('username', email);    // FastAPI는 'username' 필드로 받음
  formData.append('password', password);

  // 3. 'apiClient'로 진짜 /login API 호출
  //    (apiClient가 'response.data'만 반환하도록 설정되어 있음)
  return apiClient.post('/auth/login', formData, {
    // 4. [필수] 헤더를 '폼 데이터'용으로 설정
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  // (성공 시, { access_token: "...", token_type: "bearer" } 객체를 반환)
};

/**
 * 2. 회원가입 요청
 * @param {object} userData - { email, name, gender, birthdate, password }
 */
export const signupUser = async (userData) => {
  // '회원가입' API는 JSON을 받으므로, 그냥 객체를 보냄
  return apiClient.post('/auth/signup', userData);
  // (성공 시, { id: 1, email: "...", ... } 같은 User 객체를 반환)
};

/**
 * [추가] 이메일 중복 확인
 * @param {string} email 
 */
export const checkEmailDuplicate = async (email) => {
  return apiClient.get(`/auth/check-email?email=${email}`);
};


// --- [추가] 아이디/비밀번호 찾기 API ---

/**
 * 3. 아이디(이메일) 찾기 요청
 * @param {string} name - 사용자 이름
 * @param {string} birthdate - 사용자 생년월일 (YYYY-MM-DD)
 */
export const findUserId = async (name, birthdate) => {
  // (FastAPI 서버에 '/auth/find-id' 엔드포인트를 만들어야 함!)
  return apiClient.post('/auth/find-id', { user_name: name, birthdate });
};

/**
 * 4. 비밀번호 재설정을 위한 사용자 확인
 * @param {string} name 
 * @param {string} birthdate 
 * @param {string} email 
 */
export const findUserPassword = async (name, birthdate, email) => {
  // (FastAPI 서버에 '/auth/find-password-verify' 엔드포인트를 만들어야 함!)
  return apiClient.post('/auth/find-password-verify', { user_name: name, birthdate, user_email: email });
};

/**
 * 5. 비밀번호 재설정 인증 코드 확인
 * @param {string} email 
 * @param {string} code 
 */
export const verifyPasswordResetCode = async (email, code) => {
  return apiClient.post('/auth/verify-password-reset-code', { email, code });
};

/**
 * 5. 새 비밀번호 저장
 * @param {string} email 
 * @param {string} newPassword 
 */
export const resetUserPassword = async (email, newPassword) => {
  // (FastAPI 서버에 '/auth/reset-password' 엔드포인트를 만들어야 함!)
  return apiClient.post('/auth/reset-password', { email, password: newPassword });
};

/**
 * 6. 이메일 인증 요청
 * @param {string} email 
 */
export const verifyUserEmail = async (email) => {
  // (FastAPI 서버에 '/auth/verify-email' 엔드포인트를 만들어야 함!)
  return apiClient.post('/auth/verify-email', { email });
};

/**
 * 7. [추가!] 이메일 인증 코드 요청
 * @param {string} email 
 */
export const requestVerificationCode = async (email) => {
  return apiClient.post('/auth/request-verification', { email });
};

/**
 * 8. [추가!] 회원 탈퇴 (소프트 삭제)
 */
export const deleteAccount = async () => {
  return apiClient.delete('/auth/me');
};