import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import EyeOpenIcon from '../../assets/eye-open.svg'; // 1. Make sure this path is correct!
import EyeClosedIcon from '../../assets/eye-closed.svg'; // 1. Make sure this path is correct!

// 2. [CHANGED] Import the 'real' API function
import { loginUser } from '../../api/authApi';
// 3. [CHANGED] Import the user store
import { useUserStore } from '../../store/userStore';

const Login = () => {
  const navigate = useNavigate();
  
  // 4. [CHANGED] Get the 'login' action from the store
  const storeLogin = useUserStore((state) => state.login);

  // 5. Form state (all the same as before)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 6. onChange handlers (all the same as before)
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError(null);
  };

  // 7. [CHANGED] This is the new handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 8. [CHANGED] Call the 'real' API from authApi.js
      const data = await loginUser(email, password);
      
      // 'data' is now { access_token: "...", token_type: "bearer", user: {...} }

      // 9. [CHANGED] Save the 'user' object and 'token' to the store
      storeLogin(data.user, data.access_token);

      // 10. [CHANGED] Navigate to the main dashboard
      navigate('/dashboard'); 

    } catch (err) {
      // 11. [CHANGED] Set the 'real' error message from FastAPI
      setError(err.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 12. Password toggle (all the same as before)
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

  // 13. JSX Return (all the same as before, but uses the upgraded components)
  return (
    <div className="flex flex-col min-h-full">
      <Header title="아이디 로그인" showBackButton={true} />
      <div className="flex-grow p-6">
        <form className="flex flex-col gap-4 mt-8" onSubmit={handleSubmit}>
          <Input
            label="아이디" // (Or "Email")
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
            error={error} // The error message will show up here
            autoComplete="current-password"
          />
          <div className="mt-4">
            <Button
              type="submit"
              variant="form"
              disabled={loading}
            >
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