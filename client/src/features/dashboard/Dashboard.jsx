import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore'; // 1. 스토어 사용
import Header from '../../components/layout/Header';

// 2. 필요한 아이콘 임포트
import userIcon from '../../assets/user.svg'; // 기존 아이콘
import clipboardIcon from '../../assets/clipboard.svg'; // 👈 [추가] 설문조사 아이콘
import searchIcon from '../../assets/search.svg'; // 👈 [추가] 검색 아이콘
import drugIcon from '../../assets/drugs.svg';

const Dashboard = () => {
  const navigate = useNavigate();

  // 3. 스토어에서 'user' 정보 가져오기
  const user = useUserStore((state) => state.user);

  // 4. [보호 로직] 로그인 안 한 유저 쫓아내기
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // 5. [방어 코드] user가 null일 때 렌더링 막기
  if (!user) {
    return null; // (로딩 스피너)
  }

  // 6. 실제 화면 렌더링 (이미지 디자인 적용)
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 7. Header: title을 '닉네임'으로 변경, 오른쪽은 마이페이지 아이콘 */}
      <Header
        title={user.name} // 👈 'WON CARE' 대신 user.name (닉네임) 표시
        rightAccessory={
          <button onClick={() => navigate('/mypage')}>
            <img src={userIcon} alt="My Page" className="w-8 h-8" />
          </button>
        }
      />

      <div className="flex-grow p-6 flex flex-col items-center mt-4">
        {/* 8. 메인 타이틀 변경 */}
        <h2 className="text-3xl font-bold mb-12 text-center leading-snug">
          우리만의 건강 케어를
          <br />
          원한다면?
        </h2>

        {/* 9. 버튼 3개 영역 (flex-col) */}
        <div className="w-full max-w-sm flex flex-col gap-5">
          {/* 9-1. 설문조사 버튼 */}
          <button
            onClick={() => navigate('/survey')}
            className="w-full h-24 bg-blue-100 rounded-[40px] flex items-center p-5 relative"
          >
            <div className="w-16 h-16 flex items-center justify-center">
              <img src={clipboardIcon} alt="Survey" className="w-10 h-10" />
            </div>
            <div className="absolute right-5 w-48 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
              <span className="text-lg font-bold text-gray-800">설문조사</span>
            </div>
          </button>

          {/* 9-2. 자연어 검색 버튼 */}
          <button
            onClick={() => navigate('/search')} // 👈 '/search' 등 새 경로 지정
            className="w-full h-24 bg-blue-100 rounded-[40px] flex items-center p-5 relative"
          >
            <div className="w-16 h-16 flex items-center justify-center">
              <img src={searchIcon} alt="Search" className="w-10 h-10" />
            </div>
            <div className="absolute right-5 w-48 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
              <span className="text-lg font-bold text-gray-800">
                자연어 검색
              </span>
            </div>
          </button>

          {/* 9-3. 마이페이지 버튼 */}
          <button
            onClick={() => navigate('/myinfo')}
            className="w-full h-24 bg-blue-100 rounded-[40px] flex items-center p-5 relative"
          >
            <div className="w-16 h-16 flex items-center justify-center">
              <img src={drugIcon} alt="My Page" className="w-10 h-10" />
            </div>
            <div className="absolute right-5 w-48 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
              <span className="text-lg font-bold text-gray-800">
                마이페이지
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;