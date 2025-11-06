import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore'; // 1. 우리가 만든 스토어!
import Header from '../../components/layout/Header';
import Button from '../../components/common/Button';
import Logo from '../../components/common/Logo'; // (환영 의미로 로고 추가!)
import userIcon from '../../assets/user.svg';

const Dashboard = () => {
  const navigate = useNavigate();

  // 2. 스토어에서 'user' 정보와 'logout' 함수를 꺼내옴
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  // 3. [보호 로직] 로그인 안 한 유저 쫓아내기
  useEffect(() => {
    if (!user) {
      // 'replace: true'는 뒤로가기로 이 페이지에 다시 못 오게 함
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // 4. 로그아웃 처리
  const handleLogout = () => {
    logout(); // 스토어의 모든 정보를 null로 리셋
    navigate('/'); // 홈 화면으로 이동
  };

  // 5. [방어 코드] user가 null일 때(쫓겨나기 직전) 렌더링 막기
  if (!user) {
    // (나중에 여기 '로딩 스피너' 컴포넌트 넣으면 더 멋짐)
    return null; 
  }

  // 6. 실제 화면 렌더링
  return (
    <div className="flex flex-col min-h-full">
      {/* 7. Header의 rightAccessory에 마이페이지 이동 버튼 넣기 */}
      <Header
        title="WON CARE" // 앱 로고가 있으니 제목은 심플하게
        rightAccessory={
          <button onClick={() => navigate('/mypage')}>
            <img src={userIcon} alt="My Page" className="w-6 h-6" />
          </button>
        }
      />
      
      <div className="flex-grow p-6 flex flex-col justify-center">
        <Logo className="mb-10" /> 
        
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold">
            {/* 8. 스토어에서 꺼내 온 user 객체의 'name' 사용 */}
            {user.name}님, 환영합니다!
          </h2>
          <p className="text-gray-600 mt-2">
            맞춤형 영양제 추천을 위한<br />설문을 시작해 보세요.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            variant="form" // 'form'이 파란색이었지?
            onClick={() => navigate('/survey')} // 설문조사 페이지로
          >
            설문 시작하기
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/recommendations')} // 추천 결과 페이지로
          >
            내 추천 결과 보기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;