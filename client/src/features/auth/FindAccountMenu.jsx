import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
// 1. 'LoginButton' 대신 범용 'Button'을 가져옴
import Button from '../../components/common/Button'; 

const FindAccountMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full">
      {/* 2. '뒤로가기' 버튼을 표시하도록 prop 추가 */}
      <Header title="아이디/비밀번호 찾기" showBackButton={true} />
      
      <div className="flex-grow p-6 flex flex-col justify-center gap-4">
        {/* 3. 'LoginButton'을 'Button'으로 변경하고 variant="form"을 줌 */}
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