import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import userIcon from '../../assets/user.svg'; // Survey.js와 동일한 경로

// --- 목업 데이터용 아이콘 ---
// TODO: 실제 아이콘 파일 경로로 수정해주세요.
// 예시: import sadBeeIcon from '../../assets/icons/8.png';
// 예시: import exerciseIcon from '../../assets/icons/exercise.png';
// 예시: import dishIcon from '../../assets/icons/dish.png';
// 예시: import sleepIcon from '../../assets/icons/heart.png'; // 이미지의 선글라스 아이콘을 '건강습관'으로 가정

// 아이콘 임시 경로 (실제 프로젝트에 맞게 수정 필요)
// CSS의 '8 1' (background: url(8.png)) 이미지를 'sadBeeIcon'으로 가정합니다.
const sadBeeIcon = './health-wibee/40-healthWibee.png';
const exerciseIcon = './health-wibee/exercise.png?text=운동';
const dishIcon = './health-wibee/dish.png?text=식이';
const sleepIcon = './health-wibee/heart.png?text=습관'; // 'heart 1' 대신 '건강습관'으로 가정

/**
 * 맞춤 영양제 목업 아이템
 */
const SupplementItem = ({ info }) => (
  <div className="flex items-center mt-5">
    {/* Rectangle 44 / 45 */}
    <div className="w-[86px] h-[105px] bg-cyan-100 rounded-[31px] flex-shrink-0" />
    {/* 영양제 정보 텍스트 */}
    <div className="ml-4">
      {info.map((line, index) => (
        <p key={index} className="font-bold text-[13px] text-gray-700 leading-relaxed">
          {line}
        </p>
      ))}
    </div>
  </div>
);

/**
 * 생활 습관 분석 목업 아이템
 */
const LifestyleItem = ({ icon, label, score }) => (
  // Rectangle 41 / 42 / 43
  <div className="w-full h-[163px] bg-cyan-100 rounded-[31px] p-3 flex flex-col items-center justify-between">
    {/* exercise 1 / dish 1 / heart 1 */}
    <img src={icon} alt={label} className="w-[70px] h-[70px] mt-1" />
    {/* 운동 / 식이 / 건강습관 */}
    <p className="text-[13px] text-center text-black font-normal mt-2">
      {label}
    </p>
    {/* 60점 / 40점 / 20점 */}
    <p className="font-bold text-[15px] text-center text-red-600 mt-1">
      {score}
    </p>
  </div>
);

/**
 * 건강 점수 결과 페이지
 */
const HealthResult = () => {
  const navigate = useNavigate();

  // 목업 데이터
  const mockSupplements = [
    { id: 1, info: ['영양제 이름', '영양제 성능', '섭취 방법', '알러지 등의 정보'] },
    { id: 2, info: ['영양제 이름', '영양제 성능', '섭취 방법', '알러지 등의 정보'] },
  ];

  const mockLifestyle = [
    { id: 1, icon: exerciseIcon, label: '운동', score: '60점' },
    { id: 2, icon: dishIcon, label: '식이', score: '40점' },
    { id: 3, icon: sleepIcon, label: '건강습관', score: '20점' },
  ];

  return (
    // Survey.js와 동일한 전체 화면 스크롤 구조
    <div className="flex flex-col h-screen bg-white">
      <Header
        title="건강 리포트" // 헤더 타이틀은 임의로 지정
        showBackButton={true}
        rightAccessory={
          <button onClick={() => navigate('/mypage')}>
            <img src={userIcon} alt="My Page" className="w-8 h-8" />
          </button>
        }
      />

      {/* 스크롤이 필요한 메인 콘텐츠 영역 */}
      <div className="flex-grow overflow-y-auto p-6 pb-10">
        
        {/* 1. 건강 점수 섹션 */}
        <div className="pt-4">
          {/* 당신의 건강 점수는 40점입니다. */}
          <h1 className="text-[32px] font-medium text-center text-black/70 leading-tight">
            당신의 건강 점수는
            <br />
            <span className="font-bold text-red-600">40점</span>
            입니다.
          </h1>

          {/* 8 1 (Bee Image) */}
          <img
            src={sadBeeIcon}
            alt="건강 점수 40점"
            className="w-[131px] h-[197px] mx-auto my-6"
          />
        </div>

        {/* 2. 맞춤 영양제 섹션 (목업) */}
        <section className="mt-4">
          {/* 맞춤 영양제 (Title) */}
          <h2 className="text-xl font-bold text-[#0028A0]">맞춤 영양제</h2>
          {/* 당신의 설문 & 소비패턴을... (Subtitle) */}
          <p className="text-[13px] text-gray-600 mt-1.5 leading-snug">
            당신의 설문 & 소비패턴을 기반으로 추천된 영양제와 생활습관입니다.
          </p>

          {/* 목업 아이템 리스트 */}
          <div className="mt-2">
            {mockSupplements.map((item) => (
              <SupplementItem key={item.id} info={item.info} />
            ))}
          </div>
        </section>

        {/* 3. 생활 습관 분석 섹션 (목업) */}
        <section className="mt-10">
          {/* 생활 습관 분석 (Title) */}
          <h2 className="text-xl font-bold text-[#0028A0]">생활 습관 분석</h2>

          {/* 목업 그리드 */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {mockLifestyle.map((item) => (
              <LifestyleItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                score={item.score}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default HealthResult;