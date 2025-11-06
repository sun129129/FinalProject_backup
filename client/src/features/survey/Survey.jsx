import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import HeaderWithBack from '../../components/common/HeaderWithBack';
import Button from '../../components/common/Button';

const Survey = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleSubmitSurvey = () => {
    alert('설문이 제출되었습니다! (임시)');
    navigate('/recommendations');
  };

  return (
    <div className="flex flex-col h-full">
      <HeaderWithBack title="건강 설문" />
      
      <div className="flex-grow p-6 flex flex-col justify-between">
        <div className="text-center my-10 p-10 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            <br />
            여기에 설문조사 문항(Checkbox, Input 등)이
            <br />
            들어올 예정입니다.
          </p>
        </div>
        
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