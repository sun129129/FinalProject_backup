import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HeaderWithBack from '../../components/common/HeaderWithBack';
import Input from '../../components/common/Input.jsx';
import InputWithButton from '../../components/common/InputWithButton.jsx';
import Checkbox from '../../components/common/Checkbox.jsx';
import Button from '../../components/common/Button.jsx';
import EyeOpenIcon from '../../assets/eye-open.svg';
import EyeClosedIcon from '../../assets/eye-closed.svg';
import { signupUser, checkEmailDuplicate } from '../../api/authApi';

// Keep as RegExp so `test` works during validation
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;

const SignupEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stepOneData = location.state?.stepOneData || null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  
  // --- 이메일 유효성 검사 상태 ---
  const [emailError, setEmailError] = useState(null);
  const [isEmailChecked, setIsEmailChecked] = useState(false); // 중복 확인 버튼 눌렀는지
  const [isDuplicateCheckLoading, setIsDuplicateCheckLoading] = useState(false);

  const isEmailFormatValid = useMemo(() => EMAIL_REGEX.test(email), [email]);
  
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const isPasswordValid = password.length >= 8;
  const isPasswordMatch = password.length > 0 && password === passwordConfirm;
  const isPasswordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;
  const validationError = isPasswordMismatch ? '비밀번호가 일치하지 않습니다.' : null;

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailChecked(false); // 이메일 변경 시 중복 확인 상태 초기화
    setEmailError(null);
    setSubmitError(null);
  };

  const handleCheckDuplicate = async () => {
    if (!isEmailFormatValid) {
      setEmailError('유효한 이메일 형식이 아닙니다.');
      return;
    }
    setIsDuplicateCheckLoading(true);
    setEmailError(null);
    try {
      const response = await checkEmailDuplicate(email);
      if (response.is_duplicate) {
        setEmailError('이미 가입된 사용자입니다.');
        setIsEmailChecked(false);
      } else {
        setEmailError(null);
        setIsEmailChecked(true); // 사용 가능한 이메일로 확인됨
      }
    } catch (err) {
      setEmailError('중복 확인 중 오류가 발생했습니다.');
      setIsEmailChecked(false);
    } finally {
      setIsDuplicateCheckLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stepOneData) {
      setSubmitError('필수 정보(1단계)가 누락되었습니다. 다시 시도해 주세요.');
      return;
    }
    if (!isEmailChecked) { // 이메일 중복 확인 여부 검사 주석 처리
      setSubmitError('이메일 중복 확인을 완료해주세요.');
      return;
    }
    if (!isEmailFormatValid) { // 이메일 형식 유효성 검사 추가
      setSubmitError('올바른 이메일 형식으로 작성해 주세요.');
      return;
    }
    if (!isPasswordValid) return setSubmitError('비밀번호는 8자 이상이어야 합니다.');
    if (!isPasswordMatch) return setSubmitError('비밀번호가 일치하지 않습니다.');
    if (!agreed) return setSubmitError('약관에 동의해야 합니다.');
    
    setSubmitLoading(true);
    setSubmitError(null);

    try {
      const fullUserData = {
        user_name: stepOneData.name,
        user_email: email,
        gender: stepOneData.gender,
        birthdate: stepOneData.birthdate,
        mobile_num: stepOneData.mobileNum,
        password: password,
      };

      await signupUser(fullUserData);

      alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      navigate('/login');

    } catch (err) {
      setSubmitError(err.response?.data?.detail || err.message || '가입에 실패했습니다.');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  const passwordVisibilityToggle = (
    <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} aria-label="비밀번호 보기 토글">
      <img src={isPasswordVisible ? EyeOpenIcon : EyeClosedIcon} alt="Toggle" className="w-5 h-5" />
    </button>
  );
  const confirmVisibilityToggle = (
    <button type="button" onClick={() => setIsConfirmVisible(!isConfirmVisible)} aria-label="비밀번호 확인 보기 토글">
      <img src={isConfirmVisible ? EyeOpenIcon : EyeClosedIcon} alt="Toggle" className="w-5 h-5" />
    </button>
  );


  const isSubmitDisabled = !isEmailChecked || !isEmailFormatValid || !isPasswordValid || !isPasswordMatch || !agreed || submitLoading;

  return (
    <div className="flex flex-col h-full">
      <HeaderWithBack title="회원가입 (2/2)" />
      <div className="flex-grow flex flex-col justify-center p-6">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          
          <div>
            <InputWithButton
              label="이메일 주소"
              type="email"
              placeholder="이메일을 입력해 주세요."
              value={email}
              onChange={handleEmailChange}
              disabled={submitLoading || isDuplicateCheckLoading}
              error={emailError}
              buttonText={isDuplicateCheckLoading ? '확인 중...' : '중복 확인'}
              onButtonClick={handleCheckDuplicate}
              buttonDisabled={!isEmailFormatValid || submitLoading || isDuplicateCheckLoading}
            />
            {isEmailChecked && (
              <p className="text-green-600 text-sm mt-1.5">
                사용 가능한 이메일입니다. ✅
              </p>
            )}
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
            {isPasswordMatch && isPasswordValid && (
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
          
          {submitError && (
            <p className="text-red-500 text-sm text-center">{submitError}</p>
          )}

          <div className="mt-4">
            <Button 
              type="submit" 
              variant="form"
              disabled={isSubmitDisabled}
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
