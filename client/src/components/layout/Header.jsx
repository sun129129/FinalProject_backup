import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackArrowIcon from '../../assets/back-arrow.svg'; // 'src/assets/back-arrow.svg' 파일이 필요합니다.

const Header = ({
  title,
  showBackButton = false, // 1. '뒤로가기' 표시 여부 (기본값: 안 보임)
  rightAccessory = null, // 2. 오른쪽에 추가할 버튼/아이콘
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // 바로 전 페이지로 이동
  };

  return (
    <header className="relative flex items-center justify-center w-full h-16 px-4">
      {/* 3. showBackButton이 true일 때만 이 버튼을 렌더링 */}
      {showBackButton && (
        <button
          onClick={handleGoBack}
          className="absolute left-4 p-2"
          aria-label="뒤로가기" // 4. 스크린 리더 접근성 향상
        >
          <img src={BackArrowIcon} alt="뒤로가기" className="w-6 h-6" />
        </button>
      )}

      {/* 5. 제목은 항상 중앙에 표시 */}
      <h1 className="text-xl font-bold">{title}</h1>

      {/* 6. 오른쪽에 넣을 내용(prop)이 있으면 렌더링 */}
      {rightAccessory && (
        <div className="absolute right-4">{rightAccessory}</div>
      )}
    </header>
  );
};

export default Header;