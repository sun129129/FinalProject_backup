import React from 'react';
import WonCareLogo from '../../assets/woncare.svg'; // <<< 'woncare.svg' 파일 경로

/**
 * 앱 로고 컴포넌트 (가운데 정렬 포함)
 * @param {string} className - <div> 컨테이너에 적용할 추가 Tailwind/CSS 클래스
 * (주로 my-10 같은 여백을 전달하기 위해 사용)
 */
const Logo = ({ className = '' }) => {
  return (
    // 1. 'my-10'을 지우고, 부모가 전달하는 'className'으로 대체
    <div className={`flex justify-center items-center ${className}`}>
      <img
        src={WonCareLogo} // /assets/woncare.svg
        alt="WON CARE 로고"
        className="w-48 h-auto" // 로고 자체의 크기는 여기서 고정
      />
    </div>
  );
};

export default Logo;