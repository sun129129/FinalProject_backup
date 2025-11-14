// src/routes/index.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// ------------- 상대 경로 -------------

// 1. 우리가 만든 페이지 컴포넌트들을 모두 가져오기
import Home from '../features/auth/Home';
import Login from '../features/auth/Login';
import SignupInfo from '../features/auth/SignupInfo';
import SignupEmail from '../features/auth/SignupEmail';
import FindAccountMenu from '../features/auth/FindAccountMenu';
import FindId from '../features/auth/FindId';
import FindPassword from '../features/auth/FindPassword';
import ResetPassword from '../features/auth/ResetPassword';

// Dashboard 및 Survey
import Dashboard from '../features/dashboard/Dashboard';
import Survey from '../features/survey/Survey';
import SupplementOCR from '../features/intake/SupplementOCR'; // OCR 컴포넌트 추가
import MySupplements from '../features/intake/MySupplements.jsx'; // 내 영양제 페이지

// 마이페이지 관련 컴포넌트들 (새로운 경로)
import MyPage from '../features/mypage/MyPage.jsx';
import ChangePassword from '../features/mypage/ChangePassword.jsx';
import DeleteAccount from '../features/mypage/DeleteAccounts.jsx';
import VerifyCurrentPassword from '../features/mypage/VerifyCurrentPassword.jsx';

// 2. 주소(path)와 컴포넌트(element)를 짝지어주기
const AppRoutes = () => {
  return (
    <Routes>
      {/* --- 인증 관련 페이지 (로그인 없이 접근 가능) --- */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupInfo />} />
      <Route path="/signup/email" element={<SignupEmail />} />
      <Route path="/find-account" element={<FindAccountMenu />} />
      <Route path="/find-id" element={<FindId />} />
      <Route path="/find-password" element={<FindPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* --- 로그인해야 보이는 페이지 (보호된 라우트) --- */}
      {/* 💡 Note: 실제 서비스에서는 이 라우트들을 <ProtectedRoute> 등으로 감싸서
           로그인 여부를 체크하는 로직이 추가되어야 합니다. */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/survey" element={<Survey />} />
      <Route path="/intake-ocr" element={<SupplementOCR />} /> {/* OCR 페이지 라우트 추가 */}
      <Route path="/my-supplements" element={<MySupplements />} /> {/* 내 영양제 페이지 라우트 추가 */}

      {/* 🔑 마이페이지 라우트: 중첩 라우트 사용 (Nesting) */}
      {/* /mypage로 접근하면 MyPage가 기본으로 보임 (index) */}
      <Route path="/mypage">
          <Route index element={<MyPage />} /> {/* /mypage */}
          <Route path="change-password" element={<ChangePassword />} /> {/* /mypage/change-password */}
          <Route path="delete-account" element={<DeleteAccount />} /> {/* /mypage/delete-account */}
          <Route path="verify-current-password" element={<VerifyCurrentPassword />} /> {/* /mypage/verify-current-password */}
      </Route>

      {/* 404 Not Found 페이지 (일치하는 주소가 없을 때) */}
      <Route path="*" element={        <div className="p-10 text-center">
          <h1 className="text-xl font-bold">404 - 페이지를 찾을 수 없습니다.</h1>
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes;