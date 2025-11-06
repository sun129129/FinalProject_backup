// src/App.jsx



import React from 'react';

import AppRoutes from './routes'; // 1. 방금 만든 '표지판' 가져오기

import DeviceFrame from './components/layout/DeviceFrame'; // 2. '폰 프레임' 가져오기



function App() {

  return (

    // 3. (PC 화면) 회색 배경에서 폰 프레임을 가운데 정렬

    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <DeviceFrame>

        {/* 4. '폰 프레임' 안에서 실제 페이지(AppRoutes)가 보이도록 함 */}

        <AppRoutes />

      </DeviceFrame>

    </div>

  );

}



export default App; 