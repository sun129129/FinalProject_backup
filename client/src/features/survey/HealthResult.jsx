import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import userIcon from '../../assets/user.svg';
import wibeeImage from './health-wibee/healthWibee.png';
import { getSurveyResults } from '../../api/surveyApi';

// Survey.jsx에서 가져온 아이콘 경로 생성 함수
const getImageUrl = (name) => {
  if (!name) return '';
  return new URL(`./icons/${name}`, import.meta.url).href;
};

// DUMMY_INTERESTS 데이터를 HealthResult.jsx로 가져옴
const DUMMY_INTERESTS = [
  { id: "cognitive", name: "인지기능/기억력", icon_name: "brain.png", keyword_id: 1 },
  { id: "tension", name: "긴장", icon_name: "tension.png", keyword_id: 2 },
  { id: "sleep", name: "수면의 질", icon_name: "sleep.png", keyword_id: 3 },
  { id: "fatigue", name: "피로", icon_name: "fatigue.png", keyword_id: 4 },
  { id: "dental", name: "치아", icon_name: "dental.png", keyword_id: 5 },
  { id: "eye", name: "눈", icon_name: "eye.png", keyword_id: 6 },
  { id: "skin", name: "피부", icon_name: "skin.png", keyword_id: 7 },
  { id: "liver", name: "간", icon_name: "liver.png", keyword_id: 8 },
  { id: "stomach", name: "위", icon_name: "stomach.png", keyword_id: 9 },
  { id: "gut", name: "장", icon_name: "gut.png", keyword_id: 10 },
  { id: "bodyfat", name: "체지방", icon_name: "bodyfat.png", keyword_id: 11 },
  { id: "calcium", name: "칼슘흡수", icon_name: "calcium.png", keyword_id: 12 },
  { id: "bloodsugar", name: "혈당", icon_name: "bloodsugar.png", keyword_id: 13 },
  { id: "menopause_f", name: "갱년기 여성", icon_name: "f_menopause.png", keyword_id: 14 },
  { id: "menopause_m", name: "갱년기 남성", icon_name: "m_menopause.png", keyword_id: 15 },
  { id: "triglyceride", name: "혈중 중성지방", icon_name: "triglyceride.png", keyword_id: 16 },
  { id: "cholesterol", name: "콜레스테롤", icon_name: "cholesterol.png", keyword_id: 17 },
  { id: "bloodpressure", name: "혈압", icon_name: "bloodpressure.png", keyword_id: 18 },
  { id: "circulation", name: "혈행", icon_name: "circulation.png", keyword_id: 19 },
  { id: "immunity", name: "면역", icon_name: "immunity.png", keyword_id: 20 },
  { id: "antioxidant", name: "항산화", icon_name: "antioxidant.png", keyword_id: 21 },
  { id: "joint", name: "관절", icon_name: "joint.png", keyword_id: 22 },
  { id: "bone", name: "뼈", icon_name: "bone.png", keyword_id: 23 },
  { id: "muscle", name: "근력", icon_name: "muscle.png", keyword_id: 24 },
  { id: "exercise", name: "운동수행능력", icon_name: "exercise.png", keyword_id: 25 },
  { id: "pms", name: "월경 전 불편한 상태", icon_name: "pms.png", keyword_id: 26 },
  { id: "prostate", name: "전립선", icon_name: "prostate.png", keyword_id: 27 },
  { id: "urination", name: "배뇨", icon_name: "urination.png", keyword_id: 28 },
  { id: "urinary", name: "요로", icon_name: "urinary.png", keyword_id: 29 },
];
// keyword_id를 키로 사용하는 맵 생성
const interestMap = new Map(DUMMY_INTERESTS.map(item => [item.keyword_id, item]));

// 각 관심사에 대한 생활 습관 개선 제안 데이터
const lifestyleImprovementData = {
  cognitive: {
    title: '인지 기능 개선을 위한 생활 습관',
    recommendations: [
      '규칙적인 두뇌 활동 (독서, 퍼즐, 새로운 것 배우기)',
      '충분한 수면 (하루 7-8시간 권장)',
      '오메가-3가 풍부한 식단 (예: 등푸른 생선, 견과류)',
      '꾸준한 유산소 운동 (예: 걷기, 조깅)',
    ],
  },
  sleep: {
    title: '수면의 질 향상을 위한 생활 습관',
    recommendations: [
      '매일 같은 시간에 잠자리에 들고 일어나기',
      '잠들기 최소 1시간 전 스마트폰, TV 등 전자기기 사용 중단',
      '카페인 및 알코올 섭취 시간 조절 (특히 오후 늦게)',
      '적절한 수면 환경 조성 (조용하고, 어둡고, 시원하게)',
    ],
  },
  fatigue: {
    title: '피로 회복을 위한 생활 습관',
    recommendations: [
      '짧은 낮잠 활용 (20분 이내)',
      '균형 잡힌 식사와 충분한 수분 섭취',
      '가벼운 스트레칭이나 산책으로 신체 활력 높이기',
      '스트레스 관리 (명상, 심호흡, 취미 활동)',
    ],
  },
  eye: {
    title: '눈 건강을 위한 생활 습관',
    recommendations: [
      '20-20-20 규칙 실천 (20분마다 20초 동안 20피트 멀리 보기)',
      '루테인, 지아잔틴이 풍부한 음식 섭취 (예: 녹황색 채소)',
      '외출 시 자외선 차단용 선글라스 착용',
      '적절한 실내 조명과 습도 유지',
    ],
  },
  liver: {
    title: '간 건강을 위한 생활 습관',
    recommendations: [
      '과도한 음주 피하기',
      '불필요한 약물 복용 자제 및 전문가와 상담',
      '가공식품과 기름진 음식 섭취 줄이기',
      '밀크씨슬 등 간에 좋은 성분이 포함된 식품 고려',
    ],
  },
  default: {
    title: '생활 습관 개선',
    recommendations: ['위에서 관심사를 선택하면 맞춤 생활 습관을 제안해 드립니다.'],
  },
};



/**
 * 건강 리포트 페이지
 * 설문 결과에 따라 가장 우려되는 건강 관심사를 보여주고,
 * 하단에는 선택된 관심사들에 대한 상세 정보를 제공합니다.
 */
const HealthResult = () => {
  const navigate = useNavigate();
  const [surveyResults, setSurveyResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const primaryInterest = surveyResults.length > 0 ? surveyResults[0] : null;
  const [selectedInterest, setSelectedInterest] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const { data } = await getSurveyResults(); // API에서 점수 데이터 가져오기
        
        // API 결과를 DUMMY_INTERESTS와 매핑하여 icon_name, id 등 추가 정보 결합
        const mappedResults = (data || [])
          .map(result => {
            const interestData = interestMap.get(result.keyword_id);
            return interestData ? { ...result, ...interestData } : null;
          })
          .filter(Boolean); // 매핑 실패한 항목 제거
        
        // 점수가 높은 순으로 정렬
        const sortedResults = mappedResults.sort((a, b) => b.survey_score - a.survey_score);
        
        setSurveyResults(sortedResults);
        if (sortedResults.length > 0) {
          setSelectedInterest(sortedResults[0]); // 가장 점수 높은 항목을 기본 선택
        }
      } catch (err) {
        setError(err.response?.data?.detail || '결과를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p className="text-lg text-gray-600">분석 결과를 불러오는 중...</p></div>;
  }

  if (error) {
    return <div className="flex flex-col justify-center items-center h-full"><p className="text-lg text-red-500">{error}</p></div>;
  }

  const currentLifestyleData =
    lifestyleImprovementData[selectedInterest?.id] || lifestyleImprovementData.default;

  // const currentSupplementData =
  //   recommendedSupplementsData[selectedInterest?.id] || recommendedSupplementsData.default;

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header
        title="건강 리포트"
        showBackButton={true}
        rightAccessory={
          <button onClick={() => navigate('/mypage')}>
            <img src={userIcon} alt="My Page" className="w-8 h-8" />
          </button>
        }
      />

      <div className="flex-grow overflow-y-auto p-6">
        {/* 1. 가장 우려되는 건강 관심사 섹션 */}
        <section className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 leading-relaxed">
            당신은
            <br />
            <span className="text-blue-600">'{primaryInterest?.keyword_nm}'</span> 건강을 걱정하는 위비!
          </h1>
          {/* 좌우 이미지 영역 */}
          <div className="flex justify-center items-center my-4 gap-4">
            {/* 왼쪽 이미지 (고정) */}
            <div className="w-1/2 h-64 flex items-center justify-center p-2">
              <img src={wibeeImage} alt="건강 위비 캐릭터" className="max-w-full max-h-full object-contain" />
            </div>
            {/* 오른쪽 이미지 (동적) */}
            <div className="w-1/2 h-80 flex items-center justify-center p-2">
              {primaryInterest && (
                <img 
                  src={getImageUrl(primaryInterest.icon_name)} 
                  alt={primaryInterest.keyword_nm} 
                  className="max-w-full max-h-full object-contain" 
                />
              )}
            </div>
          </div>
        </section>

        {/* 2. 선택한 관심 건강 섹션 */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-[#0028A0]">설문으로 선택된 관심 건강</h2>
          <p className="text-sm text-gray-600 mt-1">
            관심사를 선택하여 맞춤 정보를 확인하세요.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {surveyResults.map((interest) => {
              const isSelected = selectedInterest?.id === interest.id;
              return (
                <button
                  key={interest.id}
                  onClick={() => setSelectedInterest(interest)}
                  className={`h-28 rounded-2xl flex flex-col items-center justify-center p-2 text-center font-semibold transition-all duration-200 ease-in-out transform
                    ${
                      isSelected
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                >
                  <img
                    src={getImageUrl(interest.icon_name)}
                    alt={interest.keyword_nm}
                    className="w-10 h-10"
                  />
                  <span className="text-xs mt-2">{interest.keyword_nm}</span>
                </button>
              );
            })}
          </div>
        </section>


        {/* 3. 생활 습관 개선 섹션 */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-[#0028A0]">{currentLifestyleData.title}</h2>
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <ul className="space-y-3 list-disc list-inside text-gray-700">
              {currentLifestyleData.recommendations.map((rec, index) => (
                <li key={index} className="leading-relaxed">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HealthResult;