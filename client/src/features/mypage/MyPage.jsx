import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import HeaderWithBack from '../../components/common/HeaderWithBack';
import Button from '../../components/common/Button';

const MyPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserStore();

  const handleVerifyCurrentPassword = () => {
    navigate('/mypage/verify-current-password');
  };

  const handleChangePassword = () => {
    navigate('/mypage/change-password');
  };

  const handleDeleteAccount = () => {
    navigate('/mypage/delete-account');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full">
      <HeaderWithBack title="프로필" />
      <div className="flex-grow p-6 flex flex-col justify-between">
        {user && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <span className="font-semibold text-gray-700 w-20">이름:</span>
              <span className="text-gray-900">{user.user_name}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-semibold text-gray-700 w-20">이메일:</span>
              <span className="text-gray-900">{user.user_email}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-gray-700 w-20">비밀번호:</span>
              <span className="text-gray-900">********</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Button
            variant="secondary"
            onClick={handleVerifyCurrentPassword}
          >
            비밀번호 재설정
          </Button>
          <Button
            variant="secondary"
            onClick={handleLogout}
          >
            로그아웃
          </Button>
        
        <Button 
          onClick={handleDeleteAccount}
          className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          회원 탈퇴
        </Button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;