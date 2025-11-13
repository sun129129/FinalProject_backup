import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HeaderWithBack from '../../components/common/HeaderWithBack';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import EyeOpenIcon from '../../assets/eye-open.svg';
import EyeClosedIcon from '../../assets/eye-closed.svg';
import { resetUserPassword } from '../../api/authApi';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || '');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const validationError = isMismatch ? '비밀번호가 일치하지 않습니다.' : null;

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    if (apiError) setApiError(null);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (apiError) setApiError(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isMatch) return;

    setLoading(true);
    setApiError(null);

    try {
      await resetUserPassword(email, newPassword);
      alert('비밀번호가 성공적으로 변경되었습니다!');
      navigate('/login');
    } catch (err) {
      setApiError(err.response?.data?.detail || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
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
    <div className="flex flex-col h-full">
      <HeaderWithBack title="비밀번호 재설정" />
      
      <div className="flex-grow flex flex-col justify-center p-6">
        
          <form className="flex flex-col gap-4" onSubmit={handleSave}>
            <p className="text-sm text-gray-600">새 비밀번호를 입력하세요.</p>
            
            <Input
              label="이메일"
              value={email}
              disabled={true}
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
                error={validationError || apiError}
              />
              {isMatch && (
                <p className="text-green-600 text-sm mt-1.5 ml-1">일치합니다 ✅</p>
              )}
            </div>

            <div className="mt-4">
              <Button 
                type="submit" 
                variant="form"
                disabled={loading || !isMatch}
              >
                {loading ? '저장 중...' : '비밀번호 저장'}
              </Button>
            </div>
          </form>
      </div>
    </div>
  );
};

export default ResetPassword;