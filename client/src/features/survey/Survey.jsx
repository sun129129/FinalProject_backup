import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore'; // 1. 로그인 검사용 스토어
import Header from '../../components/layout/Header';
import Button from '../../components/common/Button';

const Survey = () => {
  const navigate = useNavigate();
  
  // 2. 스토어에서 'user' 정보만 가져옴 (로그인 여부 확인용)
  const user = useUserStore((state) => state.user);

  // 3. [보호 로직] 로그인 안 한 유저 쫓아내기
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // 4. [방어 코드] 쫓겨나기 직전에 렌더링 막기
  if (!user) {
    return null;
  }

  // 5. 설문 제출 (임시) 함수
  const handleSubmitSurvey = () => {
    // (나중에 여기에서 설문 결과 'state'를 API로 전송)
    alert('설문이 제출되었습니다! (임시)');
    // 결과 페이지로 이동
    navigate('/recommendations');
  };

  // 6. 실제 화면 렌더링
  return (
    <div className="flex flex-col min-h-full">
      {/* 7. '뒤로가기' 버튼이 있는 헤더 */}
      <Header title="건강 설문" showBackButton={true} />
      
      {/* --- 설문조사 내용 (지금은 껍데기) --- */}
      <div className="flex-grow p-6 flex flex-col">
        <div className="text-center my-10 p-10 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            
            <br />
            여기에 설문조사 문항(Checkbox, Input 등)이
            <br />
            들어올 예정입니다.
          </p>
        </div>
        
        {/* --- 페이지 맨 아래 '제출' 버튼 --- */}
        <div className="mt-auto">
          <Button 
            variant="form"
            onClick={handleSubmitSurvey}
          >
            결과 보기 (제출)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Survey;