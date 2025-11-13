import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderWithBack from '../../components/common/HeaderWithBack';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import EyeOpenIcon from '../../assets/eye-open.svg';
import EyeClosedIcon from '../../assets/eye-closed.svg';
import { loginUser } from '../../api/authApi';
import { useUserStore } from '../../store/userStore';

const VerifyCurrentPassword = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();

  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!user || !user.user_email) {
      setError('사용자 정보를 찾을 수 없습니다.');
      setLoading(false);
      return;
    }

    try {
      // 기존 로그인 API를 사용하여 현재 비밀번호를 확인합니다.
      await loginUser(user.user_email, password);
      // 성공 시 비밀번호 변경 페이지로 이동합니다.
      navigate('/mypage/change-password');
    } catch (err) {
      setError('비밀번호가 올바르지 않습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  const passwordVisibilityToggle = (
    <button
      type="button"
      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
      aria-label="비밀번호 보기 토글"
    >
      <img
        src={isPasswordVisible ? EyeClosedIcon : EyeOpenIcon}
        alt="Toggle"
        className="w-5 h-5 text-gray-500"
      />
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      <HeaderWithBack title="비밀번호 확인" />
      <div className="flex-grow flex flex-col justify-center p-6">
        <p className="text-center text-gray-600 mb-6">
          회원님의 정보를 안전하게 보호하기 위해<br />현재 비밀번호를 다시 한번 확인합니다.
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            label="현재 비밀번호"
            type={isPasswordVisible ? 'text' : 'password'}
            rightAccessory={passwordVisibilityToggle}
            value={password}
            onChange={handlePasswordChange}
            disabled={loading}
            error={error}
            autoComplete="current-password"
          />
          <div className="mt-4">
            <Button type="submit" variant="form" disabled={loading || !password}>
              {loading ? '확인 중...' : '확인'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyCurrentPassword;
