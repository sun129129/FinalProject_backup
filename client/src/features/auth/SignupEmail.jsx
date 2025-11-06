import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HeaderWithBack from '../../components/common/HeaderWithBack';
import Input from '../../components/common/Input.jsx';
import Checkbox from '../../components/common/Checkbox.jsx';
import Button from '../../components/common/Button.jsx';
import EyeOpenIcon from '../../assets/eye-open.svg';
import EyeClosedIcon from '../../assets/eye-closed.svg';
import { signupUser } from '../../api/authApi';

const SignupEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stepOneData = location.state?.stepOneData || null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const isPasswordMatch = password.length > 0 && password === passwordConfirm;
  const isPasswordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;
  const validationError = isPasswordMismatch ? '비밀번호가 일치하지 않습니다.' : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stepOneData) {
      setSubmitError('필수 정보(1단계)가 누락되었습니다. 다시 시도해 주세요.');
      return;
    }
    
    if (!isPasswordMatch) return setSubmitError('비밀번호가 일치하지 않습니다.');
    if (!agreed) return setSubmitError('약관에 동의해야 합니다.');
    
    setSubmitLoading(true);
    setSubmitError(null);

    try {
      const fullUserData = {
        ...stepOneData,
        email: email,
        password: password,
      };

      await signupUser(fullUserData);

      alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      navigate('/login');

    } catch (err) {
      setSubmitError(err.message || '가입에 실패했습니다.');
    } finally {
      setSubmitLoading(false);
    }
  };
  
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
    <div className="flex flex-col h-full">
      <HeaderWithBack title="회원가입 (2/2)" />
      <div className="flex-grow flex flex-col justify-center p-6">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          
          <div>
            <Input
              label="이메일 주소"
              type="email"
              placeholder="이메일을 입력해 주세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitLoading}
              error={submitError}
              rightAccessory={null}
            />
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
              onChange={(e) => setPasswordConfirm(e.target.value)}
              rightAccessory={confirmVisibilityToggle}
              disabled={submitLoading}
              error={validationError}
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
            </Checkbox>
          </div>
          
          <div className="mt-4">
            <Button 
              type="submit" 
              variant="form"
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
