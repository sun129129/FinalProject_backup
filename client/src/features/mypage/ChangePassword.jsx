import React, { useState } from 'react';
import HeaderWithBack from '../../components/common/HeaderWithBack';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';

const ChangePassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('기존 이메일@example.com');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isPasswordValid = newPassword.length >= 8;
  const passwordsMatch = newPassword === confirmPassword;

  const handleEmailVerification = async () => {
    setErrorMessage('');
    console.log(`Email verification requested for: ${email}`);
    setStep(2);
  };

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
    console.log('Password update requested');
  };

  return (
    <div className="flex flex-col h-full">
      <HeaderWithBack title="비밀번호 재설정" />
      <div className="flex-grow flex flex-col justify-center p-6">
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-center text-gray-600">본인 확인을 위해 이메일 인증을 완료해 주세요.</p>
            <Input 
              label="이메일"
              value={email}
              readOnly
              rightAccessory={
                <Button onClick={handleEmailVerification} variant="outline" size="sm">인증</Button>
              }
            />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-center text-gray-600">새로운 비밀번호를 입력해 주세요.</p>
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
              placeholder="8자 이상 입력"
            />
            <Input
              label="새 비밀번호 확인"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호 재입력"
              error={confirmPassword.length > 0 && !passwordsMatch ? '비밀번호가 일치하지 않습니다.' : null}
            />
            {confirmPassword.length > 0 && passwordsMatch && (
              <p className="text-sm text-green-600">비밀번호가 일치합니다.</p>
            )}
            
            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
            
            <div className="mt-4">
              <Button 
                onClick={handlePasswordSave} 
                disabled={!passwordsMatch || !isPasswordValid}
                variant="form"
              >
                비밀번호 저장
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;