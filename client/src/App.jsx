// src/App.jsx

import React from 'react';
import AppRoutes from './routes'; 

function App() {
  return (
    // 1. 최상위 배경: 데스크톱/PC 환경에서 회색 배경을 띄웁니다.
    <div className="flex justify-center min-h-screen bg-gray-100"> 
      
      {/* 2. 핵심 컨테이너: 모바일 뷰포트 제한 및 반응형 설정 */}
      {/* - w-full: 모바일(작은 화면)에서는 너비 100% 사용 (반응형)
         - md:max-w-md: 데스크톱/PC(md 이상)에서는 최대 너비를 448px (md)로 제한
         - bg-white: 앱 콘텐츠 영역은 흰색 배경 유지
         - shadow-lg: 모바일 프레임처럼 보이도록 그림자 추가 (선택 사항)
      */}
      <div 
        className="w-full md:max-w-md bg-white shadow-lg min-h-screen" 
        style={{ maxWidth: '448px' }} // Tailwind md:max-w-md (448px)를 직접 스타일로 지정하여 확실하게 제한
      >
        <AppRoutes />
      </div>
      
    </div>
  );
}

export default App;