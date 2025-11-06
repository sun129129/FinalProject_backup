import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';
// 1. 'PrimaryButton', 'SecondaryButton' 대신 'Button' 하나만 가져옴
import Button from '../../components/common/Button';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full p-6">
      {/* flex-grow로 로고를 화면 중앙에 밀어 넣는 방식, 아주 좋아! */}
      <div className="flex-grow flex items-center justify-center">
        <Logo />
      </div>
      <div className="flex flex-col gap-4">
        {/* 2. 'Button' 컴포넌트를 사용하고 'variant' prop으로 스타일 지정 */}
        <Button variant="primary" onClick={() => navigate('/login')}>
          로그인
        </Button>
        <Button variant="secondary" onClick={() => navigate('/signup')}>
          회원가입
        </Button>
      </div>
      <footer className="text-center text-gray-400 text-xs mt-8">
        위비타민@corp.
      </footer>
    </div>
  );
};

export default Home;