import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loadingBeeImage from './health-wibee/loading_wibee.png';

function LoadingReport() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call or data processing delay
    const timer = setTimeout(() => {
      navigate('/survey/result', { replace: true }); // Navigate to HealthResult page
    }, 3000); // 3 seconds delay for demonstration

    return () => clearTimeout(timer); // Cleanup the timer
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      {/* 텍스트 */}
      <h1 className="text-3xl font-bold text-gray-800">
        리포트 생성 중입니다.
      </h1>
      <h2 className="text-3xl font-bold text-gray-800 mt-2">
        잠시 기다려 주세요.
      </h2>

      {/* 로딩 캐릭터 이미지 */}
      <img
        src={loadingBeeImage}
        alt="로딩 중 캐릭터"
        className="max-w-full max-h-full my-10"
      />
    </div>
  );
}

export default LoadingReport;