// src/features/auth/SignupEmail.jsx (이메일 인증 '건너뛰기' 버전)

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Input from '../../components/common/Input.jsx';
import Checkbox from '../../components/common/Checkbox.jsx';
import Button from '../../components/common/Button.jsx';
import EyeOpenIcon from '../../assets/eye-open.svg';
import EyeClosedIcon from '../../assets/eye-closed.svg';

// 1. [수정!] 'signupUser'만 import (requestVerificationCode 삭제)
import { signupUser } from '../../api/authApi';

const SignupEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stepOneData = location.state?.stepOneData || null;

  // 2. 폼 상태
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  
  // 3. [수정!] '인증 코드' 관련 상태 모두 삭제 (또는 주석 처리)
  // const [verificationCode, setVerificationCode] = useState('');
  // const [showCodeInput, setShowCodeInput] = useState(false);
  // const [verifyLoading, setVerifyLoading] = useState(false);
  // const [verifyError, setVerifyError] = useState(null);
  
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // 5. 비밀번호 보기/일치 여부 로직
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const isPasswordMatch = password.length > 0 && password === passwordConfirm;
  const isPasswordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;
  const validationError = isPasswordMismatch ? '비밀번호가 일치하지 않습니다.' : null;

  // 6. [수정!] '이메일 인증 핸들러' 삭제 (또는 주석 처리)
  // const handleVerifyEmail = async () => { ... };

  // 7. '진짜' 최종 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stepOneData) {
      setSubmitError('필수 정보(1단계)가 누락되었습니다. 다시 시도해 주세요.');
      return;
    }
    
    // 8. [수정!] '인증' 관련 유효성 검사 모두 삭제!
    // if (!showCodeInput) return setSubmitError('이메일 인증을 먼저 진행해 주세요.');
    // if (verificationCode.length !== 6) return setSubmitError('인증 코드 6자리를 입력하세요.');
    if (!isPasswordMatch) return setSubmitError('비밀번호가 일치하지 않습니다.');
    if (!agreed) return setSubmitError('약관에 동의해야 합니다.');
    
    setSubmitLoading(true);
    setSubmitError(null);

    try {
      // 9. [수정!] 1단계 + 2단계 정보만 '합체' (verification_code 삭제)
      const fullUserData = {
        ...stepOneData, // { name, gender, birthdate }
        email: email,
        password: password,
        // verification_code: verificationCode, // 이 줄 삭제!
      };

      // 10. 'authApi.js'의 'signupUser' 호출!
      await signupUser(fullUserData);

      // (회원가입 성공!)
      alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      navigate('/login');

    } catch (err) {
      setSubmitError(err.message || '가입에 실패했습니다.');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  // 11. 비밀번호 토글 버튼
  const passwordVisibilityToggle = (
    <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} aria-label="비밀번호 보기 토글">
      <img src={isPasswordVisible ? EyeClosedIcon : EyeOpenIcon} alt="Toggle" className="w-5 h-5" />
    </button>
  );
  const confirmVisibilityToggle = (
    <button type="button" onClick={() => setIsConfirmVisible(!isConfirmVisible)} aria-label="비밀번호 확인 보기 토글">
      <img src={isConfirmVisible ? EyeClosedIcon : EyeOpenIcon} alt="Toggle" className="w-5 h-5" />
    </button>
  );

  return (
    <div className="flex flex-col min-h-full">
      <Header title="회원가입 (2/2)" showBackButton={true} />
      <div className="flex-grow p-6">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          
          <div> {/* 12. [수정!] 이메일 입력 (인증 버튼 삭제) */}
            <Input
              label="이메일 주소"
              type="email"
              placeholder="이메일을 입력해 주세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitLoading} // 'submitLoading'으로 변경
              error={submitError} // 'submitError'를 여기에 표시
              rightAccessory={null} // '인증' 버튼 삭제!
            />
            {/* 13. [수정!] '인증 코드' 입력창 및 메시지 모두 삭제! */}
          </div>
          
          <Input
            label="비밀번호"
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="8-20자의 영문/숫자/특수문자 조합"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightAccessory={passwordVisibilityToggle}
            disabled={submitLoading}
          />
          <div>
            <Input
              label="비밀번호 확인"
              type={isConfirmVisible ? 'text' : 'password'}
              placeholder="비밀번호를 다시 한번 입력해 주세요."
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)} // (오타 수정됨)
              rightAccessory={confirmVisibilityToggle}
              disabled={submitLoading}
              error={validationError} // '실시간 검증' 에러만 남김
            />
            {isPasswordMatch && (
              <p className="text-green-600 text-sm mt-1.5">
                비밀번호가 일치합니다. ✅
              </p>
            )}
          </div>

          <div className="mt-4">
            <Checkbox
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={submitLoading}
            >
              (필수) 이용약관 및 개인정보 취급 방침에 동의합니다.
            </Checkbox> {/* (오타 수정됨) */}
          </div>
          
          <div className="mt-4">
            <Button 
              type="submit" 
              variant="form"
              // 14. [수정!] 'disabled' 로직에서 '인증' 관련 모두 삭제!
              disabled={!isPasswordMatch || !agreed || submitLoading}
            >
              {submitLoading ? '가입 중...' : '동의하고 가입하기'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupEmail;

