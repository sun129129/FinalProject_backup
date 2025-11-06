import React from 'react';

const DeviceFrame = ({ children }) => {
  return (
    // 데스크탑 화면에서 폰 모양 틀
    <div className="w-[375px] h-[812px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-[14px] border-black box-content">
      {/* 실제 스크린 내용 (스크롤 가능하게) */}
      <div className="w-full h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default DeviceFrame;