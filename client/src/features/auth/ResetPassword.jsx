import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Input from '../../components/common/Input';
import InputWithButton from '../../components/common/InputWithButton';
import Button from '../../components/common/Button'; // 1. 'SecondaryButton' 대신 'Button'
import EyeOpenIcon from '../../assets/eye-open.svg';
import EyeClosedIcon from '../../assets/eye-closed.svg';
// 2. 'SignupInput'은 필요 없으므로 import 삭제!

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. 상태 관리
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState(location.state?.email || '');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  
  // 3. '로딩' 및 'API 에러' 상태 추가
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // 4. 실시간 유효성 검사 (아주 잘했어!)
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  // 5. 'Input' 컴포넌트에 전달할 유효성 검사 에러 메시지
  const validationError = isMismatch ? '비밀번호가 일치하지 않습니다.' : null;

  // 6. 에러 초기화를 위한 핸들러
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (apiError) setApiError(null);
  };
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    if (apiError) setApiError(null);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (apiError) setApiError(null);
  };

  // 7. (async) 이메일 인증 함수
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);
    
    // (이 부분을 나중에 api/authApi.js의 실제 API 호출로 대체)
    await new Promise(res => setTimeout(res, 1000)); // 1초 딜레이
    // try/catch로 실제 에러 처리...
    // catch (err) { setApiError(err.message); setLoading(false); return; }

    // (임시) 성공 로직
    setIsVerified(true);
    setLoading(false);
  };

  // 8. (async) 비밀번호 저장 함수
  const handleSave = async (e) => {
    e.preventDefault();
    if (!isMatch) return; // 버튼이 disabled가 아닐 경우를 대비한 방어 코드

    setLoading(true);
    setApiError(null);

    // (이 부분을 나중에 api/authApi.js의 실제 API 호출로 대체)
    await new Promise(res => setTimeout(res, 1000)); // 1초 딜레이
    // try/catch로 실제 에러 처리...
    // catch (err) { setApiError(err.message); setLoading(false); return; }

    // (임시) 성공 로직
    alert('비밀번호가 성공적으로 변경되었습니다!');
    navigate('/login');
  };
  
  // 9. 비밀번호 토글 버튼 (접근성 'aria-label' 추가)
  const passwordVisibilityToggle = (
    <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} aria-label="새 비밀번호 보기 토글">
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
      {/* 10. '뒤로가기' 버튼 활성화 */}
      <Header title="비밀번호 재설정" showBackButton={true} />
      
      <div className="flex-grow p-6">
        
        {/* --- 1단계: 이메일 인증 (isVerified가 false일 때) --- */}
        {!isVerified && (
          <form className="flex flex-col gap-4 mt-8" onSubmit={handleVerify}>
            <p className="text-sm text-gray-600">본인 확인을 위해 이메일 인증을 완료해 주세요.</p>
            <InputWithButton
              label="이메일"
              type="email"
              value={email}
              onChange={handleEmailChange}
              buttonText={loading ? '전송 중...' : '인증'}
              onButtonClick={handleVerify}
              disabled={loading} // 11. 로딩 중 Input/Button 비활성화
              buttonDisabled={loading}
              error={apiError} // 12. API 에러 메시지 연결
            />
          </form>
        )}

        {/* --- 2단계: 새 비밀번호 입력 (isVerified가 true일 때) --- */}
        {isVerified && (
          <form className="flex flex-col gap-4 mt-8" onSubmit={handleSave}>
            <p className="text-sm text-gray-600">인증이 완료되었습니다. 새 비밀번호를 입력하세요.</p>
            
            {/* 13. 'SignupInput' 대신 'Input' 컴포넌트 재사용 */}
            <Input
              label="이메일"
              value={email}
              disabled={true} // 'disabled' prop만 주면 됨!
            />
            <Input
              label="새 비밀번호"
              type={isPasswordVisible ? 'text' : 'password'}
              value={newPassword}
              onChange={handleNewPasswordChange}
              rightAccessory={passwordVisibilityToggle}
              disabled={loading}
            />
            <div>
              <Input
                label="새 비밀번호 확인"
                type={isConfirmVisible ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                rightAccessory={confirmVisibilityToggle}
                disabled={loading}
                // 14. 유효성 검사 에러 또는 API 에러를 Input에 연결
                error={validationError || apiError} 
              />
              {/* 15. '일치' 메시지는 긍정 피드백이라서 남겨두는 게 좋음! */}
              {isMatch && (
                <p className="text-green-600 text-sm mt-1.5 ml-1">일치합니다 ✅</p>
              )}
            </div>

            <div className="mt-4">
              {/* 16. 'Button' 컴포넌트로 교체, 'form' variant 사용 */}
              <Button 
                type="submit" 
                variant="form"
                // 17. 로딩 중이거나, 비밀번호가 일치하지 않으면 버튼 비활성화
                disabled={loading || !isMatch} 
              >
                {loading ? '저장 중...' : '비밀번호 저장'}
              </Button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default ResetPassword;