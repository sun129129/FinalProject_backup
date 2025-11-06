import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import HeaderWithBack from '../../components/common/HeaderWithBack';
import Button from '../../components/common/Button';

const MyPage = () => {
  const navigate = useNavigate();
  const logout = useUserStore((state) => state.logout);

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
      <HeaderWithBack title="마이페이지" />
      <div className="flex-grow p-6 flex flex-col justify-between">
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            onClick={handleChangePassword}
          >
            비밀번호 재설정
          </Button>
          <Button
            variant="outline"
            onClick={handleDeleteAccount}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            회원 탈퇴
          </Button>
        </div>
        <Button 
          onClick={handleLogout}
          className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          로그아웃
        </Button>
      </div>
    </div>
  );
};

export default MyPage;