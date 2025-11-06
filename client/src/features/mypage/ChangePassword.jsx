// src/features/auth/ChangePassword.jsx
import React, { useState } from 'react';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
// API 호출 함수를 가정
// import { requestEmailVerification, updatePassword } from '../../api/authApi.js'; 

const ChangePassword = () => {
  const [step, setStep] = useState(1); // 1: 이메일 인증, 2: 새 비밀번호 설정
  const [email, setEmail] = useState('기존 이메일@example.com'); // 실제로는 사용자 정보에서 가져와야 함
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 비밀번호 유효성 검사 로직
  const isPasswordValid = newPassword.length >= 8; // 최소 8자 이상 예시
  const passwordsMatch = newPassword === confirmPassword;

  // 1단계: 이메일 인증 요청 처리
  const handleEmailVerification = async () => {
    setErrorMessage('');
    // 실제로는 서버에 이메일 인증 요청을 보내는 API 호출
    console.log(`Email verification requested for: ${email}`);

    // API 호출 성공 가정 후 2단계로 이동
    // try {
    //   await requestEmailVerification(email);
    //   alert('인증 이메일이 발송되었습니다. 이메일을 확인해주세요.');
    setStep(2); // 이메일 확인 후 다음 단계로 바로 이동 (실제 앱에서는 인증 코드를 입력받는 중간 단계가 필요할 수 있음)
    // } catch (error) {
    //   setErrorMessage('인증 요청에 실패했습니다.');
    // }
  };

  // 2단계: 새 비밀번호 저장 처리
  const handlePasswordSave = async () => {
    setErrorMessage('');
    if (!isPasswordValid) {
      setErrorMessage('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (!passwordsMatch) {
      setErrorMessage('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 실제로는 서버에 새 비밀번호를 보내는 API 호출
    console.log('Password update requested');

    // try {
    //   await updatePassword(newPassword);
    //   alert('비밀번호가 성공적으로 재설정되었습니다.');
    // } catch (error) {
    //   setErrorMessage('비밀번호 재설정에 실패했습니다.');
    //   return;
    // }
  };

  return (
    <div className="change-password-page">
      <h2>비밀번호 재설정</h2>
      
      {/* Step 1: 이메일 인증 요청 */}
      {step === 1 && (
        <div className="step-1">
          <p className="description" style={{ color: 'red' }}>이메일 인증 먼저 진행해 주세요.</p>
          <Input 
            label="이메일"
            value={email}
            readOnly // 일반적으로 마이페이지에서는 기존 이메일을 수정하지 않고 인증함
            rightAccessory={
              <Button onClick={handleEmailVerification} small>인증</Button>
            }
          />
        </div>
      )}

      {/* Step 2: 새 비밀번호 설정 */}
      {step === 2 && (
        <div className="step-2">
          <p className="description" style={{ color: 'red' }}>새로운 비밀번호 작성해 주세요.</p>
          <Input 
            label="이메일"
            value={email}
            readOnly
          />
          <Input
            label="새 비밀번호"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호"
          />
          <Input
            label="새 비밀번호 확인"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="새 비밀번호 확인"
            rightText={
              confirmPassword.length > 0 && 
              <span style={{ color: passwordsMatch ? 'green' : 'red' }}>
                {passwordsMatch ? 'Matched ✅' : 'Not Matched ❌'}
              </span>
            }
          />
          
          {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
          
          <Button 
            onClick={handlePasswordSave} 
            disabled={!passwordsMatch || !isPasswordValid}
            style={{ marginTop: '30px' }}
          >
            비밀번호 저장
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;