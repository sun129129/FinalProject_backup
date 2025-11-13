import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderWithBack from '../../components/common/HeaderWithBack';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../hooks/useAuth';
import { resetUserPassword } from '../../api/authApi';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // 로그인한 사용자 정보를 가져옵니다.

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const isPasswordValid = newPassword.length >= 8;
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

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

    setLoading(true);
    try {
      // API를 호출하여 비밀번호를 변경합니다.
      await resetUserPassword(user.user_email, newPassword);
      alert('비밀번호가 성공적으로 변경되었습니다!');
      navigate(-1); // 이전 페이지(마이페이지)로 돌아갑니다.
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || '비밀번호 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <HeaderWithBack title="비밀번호 변경" />
      <div className="flex-grow flex flex-col justify-center p-6">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-center text-gray-600">새로운 비밀번호를 입력해 주세요.</p>
          
          {/* 사용자 이메일은 변경할 수 없도록 표시만 합니다. */}
          <Input 
            label="이메일"
            value={user?.user_email || ''}
            readOnly
            disabled={loading}
          />
          <Input
            label="새 비밀번호"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="8자 이상 입력"
            disabled={loading}
          />
          <Input
            label="새 비밀번호 확인"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호 재입력"
            error={confirmPassword.length > 0 && !passwordsMatch ? '비밀번호가 일치하지 않습니다.' : null}
            disabled={loading}
          />
          {passwordsMatch && (
            <p className="text-sm text-green-600">비밀번호가 일치합니다.</p>
          )}
          
          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
          
          <div className="mt-4">
            <Button 
              onClick={handlePasswordSave} 
              disabled={!passwordsMatch || !isPasswordValid || loading}
              variant="form"
            >
              {loading ? '저장 중...' : '비밀번호 저장'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
