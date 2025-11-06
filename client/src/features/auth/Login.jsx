import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderWithBack from '../../components/common/HeaderWithBack';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import EyeOpenIcon from '../../assets/eye-open.svg';
import EyeClosedIcon from '../../assets/eye-closed.svg';
import { loginUser } from '../../api/authApi';
import { useUserStore } from '../../store/userStore';

const Login = () => {
  const navigate = useNavigate();
  const storeLogin = useUserStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(email, password);
      storeLogin(data.user, data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다.');
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
      <HeaderWithBack title="아이디 로그인" />
      <div className="flex-grow flex flex-col justify-center p-6">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            label="아이디"
            type="email"
            value={email}
            onChange={handleEmailChange}
            disabled={loading}
            autoComplete="email"
          />
          <Input
            label="비밀번호"
            type={isPasswordVisible ? 'text' : 'password'}
            rightAccessory={passwordVisibilityToggle}
            value={password}
            onChange={handlePasswordChange}
            disabled={loading}
            error={error}
            autoComplete="current-password"
          />
          <div className="mt-4">
            <Button type="submit" variant="form" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </div>
        </form>
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/find-account')}
            className="text-sm text-gray-400 hover:underline"
            disabled={loading}
          >
            아이디나 비밀번호를 잊으셨나요?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;