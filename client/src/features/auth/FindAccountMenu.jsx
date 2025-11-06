import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderWithBack from '../../components/common/HeaderWithBack';
import Button from '../../components/common/Button';

const FindAccountMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">
      <HeaderWithBack title="아이디/비밀번호 찾기" />
      <div className="flex-grow p-6 flex flex-col justify-center gap-4">
        <Button variant="form" onClick={() => navigate('/find-id')}>
          아이디 찾기
        </Button>
        <Button variant="form" onClick={() => navigate('/find-password')}>
          비밀번호 찾기
        </Button>
      </div>
    </div>
  );
};

export default FindAccountMenu;