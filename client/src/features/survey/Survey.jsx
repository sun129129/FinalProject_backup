import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import Header from '../../components/layout/Header';
import Button from '../../components/common/Button';
import {
  getKeywordList,
  getQuestionsByKeywords,
  submitSurveyAnswers,
} from '../../api/surveyApi';
import userIcon from '../../assets/user.svg';

// DUMMY_INTERESTS 데이터의 아이콘 경로를 파일 이름만 갖도록 수정
const DUMMY_INTERESTS = [
  { id: "cognitive", name: "인지기능/기억력", icon_name: "brain.png" },
  { id: "tension", name: "긴장", icon_name: "tension.png" },
  { id: "sleep", name: "수면의 질", icon_name: "sleep.png" },
  { id: "fatigue", name: "피로", icon_name: "fatigue.png" },
  { id: "dental", name: "치아", icon_name: "dental.png" },
  { id: "eye", name: "눈", icon_name: "eye.png" },
  { id: "skin", name: "피부", icon_name: "skin.png" },
  { id: "liver", name: "간", icon_name: "liver.png" },
  { id: "stomach", name: "위", icon_name: "stomach.png" },
  { id: "gut", name: "장", icon_name: "gut.png" },
  { id: "bodyfat", name: "체지방", icon_name: "bodyfat.png" },
  { id: "calcium", name: "칼슘흡수", icon_name: "calcium.png" },
  { id: "bloodsugar", name: "혈당", icon_name: "bloodsugar.png" },
  { id: "menopause_f", name: "갱년기 여성", icon_name: "f_menopause.png" },
  { id: "menopause_m", name: "갱년기 남성", icon_name: "m_menopause.png" },
  { id: "triglyceride", name: "혈중 중성지방", icon_name: "triglyceride.png" },
  { id: "cholesterol", name: "콜레스테롤", icon_name: "cholesterol.png" },
  { id: "bloodpressure", name: "혈압", icon_name: "bloodpressure.png" },
  { id: "circulation", name: "혈행", icon_name: "circulation.png" },
  { id: "immunity", name: "면역", icon_name: "immunity.png" },
  { id: "antioxidant", name: "항산화", icon_name: "antioxidant.png" },
  { id: "joint", name: "관절", icon_name: "joint.png" },
  { id: "bone", name: "뼈", icon_name: "bone.png" },
  { id: "muscle", name: "근력", icon_name: "muscle.png" },
  { id: "exercise", name: "운동수행능력", icon_name: "exercise.png" },
  { id: "pms", name: "월경 전 불편한 상태", icon_name: "pms.png" },
  { id: "prostate", name: "전립선", icon_name: "prostate.png" },
  { id: "urination", name: "배뇨", icon_name: "urination.png" },
  { id: "urinary", name: "요로", icon_name: "urinary.png" },
];

// O/△/X 아이콘 컴포넌트
const AnswerButton = ({ type, onClick, disabled = false }) => {
  const baseStyle = 'w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-md active:shadow-lg active:scale-95';
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : '';
  if (type === 'yes') return <button onClick={onClick} disabled={disabled} className="group"><div className={`${baseStyle} ${disabledStyle} bg-white border-4 border-blue-400 group-hover:bg-blue-50`}><div className="w-16 h-16 rounded-full border-[6px] border-blue-400" /></div></button>;
  if (type === 'maybe') return <button onClick={onClick} disabled={disabled} className="group"><div className={`${baseStyle} ${disabledStyle} bg-white border-4 border-gray-400 group-hover:bg-gray-100`}><div className="w-0 h-0 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent border-b-[56px] border-b-gray-400" style={{ filter: 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.1))' }} /></div></button>;
  if (type === 'no') return <button onClick={onClick} disabled={disabled} className="group"><div className={`${baseStyle} ${disabledStyle} bg-white border-4 border-red-400 group-hover:bg-red-50 relative`}><div className="w-12 h-[6px] bg-red-400 rotate-45 absolute" /><div className="w-12 h-[6px] bg-red-400 -rotate-45 absolute" /></div></button>;
  return null;
};

// '설문' 메인 페이지
const Survey = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const [step, setStep] = useState('keyword');
  const [keywordList, setKeywordList] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const [listLoading, setListLoading] = useState(true);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) navigate('/login', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      const fetchAndCombineKeywords = async () => {
        try {
          setListLoading(true);
          const backendKeywords = await getKeywordList();
          
          const interestMap = new Map(DUMMY_INTERESTS.map(item => [item.name, item]));

          const combinedKeywords = (backendKeywords || []).map(dbKeyword => {
            const frontendData = interestMap.get(dbKeyword.keyword_nm);
            return {
              ...dbKeyword,
              id: frontendData ? frontendData.id : dbKeyword.keyword_nm,
              icon_name: frontendData ? frontendData.icon_name : 'default.png',
            };
          });

          setKeywordList(combinedKeywords);
        } catch (err) {
          setError(err.response?.data?.detail || err.message || '키워드를 불러오는 데 실패했습니다.');
          setKeywordList([]);
        } finally {
          setListLoading(false);
        }
      };
      fetchAndCombineKeywords();
    }
  }, [user]);

  const handleSelectKeyword = (keywordObject) => {
    setError(null);
    setSelectedKeywords((prev) => {
      const isSelected = prev.find((k) => k.keyword_id === keywordObject.keyword_id);
      if (isSelected) {
        return prev.filter((k) => k.keyword_id !== keywordObject.keyword_id);
      } else {
        if (prev.length < 3) return [...prev, keywordObject];
        setError('최대 3개까지 선택할 수 있습니다.');
        return prev;
      }
    });
  };

  const handleSubmitKeywords = async () => {
    if (selectedKeywords.length === 0) {
      setError('1개 이상 선택해 주세요.');
      return;
    }
    setQuestionLoading(true);
    setError(null);
    try {
      const ids = selectedKeywords.map((k) => k.keyword_id);
      const questions = await getQuestionsByKeywords(ids);
      if (!questions || questions.length === 0) {
        setError('선택한 키워드에 해당하는 질문이 없습니다.');
        setQuestionLoading(false);
        return;
      }
      setFilteredQuestions(questions);
      setStep('questions');
    } catch (err) {
      setError(err.response?.data?.detail || err.message || '질문을 불러오는 데 실패했습니다.');
    } finally {
      setQuestionLoading(false);
    }
  };

  const handleAnswer = (answerValue) => {
    const questionId = filteredQuestions[currentQuestionIndex].question_id;
    const newAnswers = { ...answers, [questionId]: answerValue };
    setAnswers(newAnswers);
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmitSurvey(newAnswers);
    }
  };

  const handleSubmitSurvey = async (finalAnswers) => {
    setSubmitLoading(true);
    setError(null);
    const formattedAnswers = Object.entries(finalAnswers).map(([qid, ans]) => ({
      question_id: parseInt(qid, 10),
      answer: ans,
    }));
    try {
      await submitSurveyAnswers(formattedAnswers);
      alert('설문이 성공적으로 제출되었습니다. 결과를 분석합니다.');
      navigate('/loading-report');
    } catch (err) {
      setError(err.response?.data?.detail || err.message || '제출에 실패했습니다.');
      setSubmitLoading(false);
    }
  };

  // Vite에서 src 내부의 이미지를 동적으로 가져오는 함수
  const getImageUrl = (name) => {
    // new URL(상대경로, import.meta.url) 패턴을 사용합니다.
    return new URL(`./icons/${name}`, import.meta.url).href;
  };

  if (!user) return null;

  if (listLoading) {
    return <div className="flex justify-center items-center h-full"><p className="text-lg text-gray-600">키워드 목록을 불러오는 중...</p></div>;
  }

  if (step === 'keyword') {
    return (
      <div className="flex flex-col h-screen bg-white">
        <Header title="건강 관심사 선택" showBackButton={true} rightAccessory={<button onClick={() => navigate('/mypage')}><img src={userIcon} alt="My Page" className="w-8 h-8" /></button>} />
        <div className="p-6"><p className="text-lg text-gray-600">최대 3개 선택</p></div>
        <div className="flex-grow p-6 overflow-y-auto">
          <div className="grid grid-cols-3 gap-4">
            {keywordList.length === 0 && !listLoading && <p className="col-span-3 text-center text-gray-500">(등록된 키워드가 없거나 불러오지 못했습니다.)</p>}
            {keywordList.map((keyword) => {
              const isSelected = selectedKeywords.find((k) => k.keyword_id === keyword.keyword_id);
              return (
                <button
                  key={keyword.keyword_id}
                  onClick={() => handleSelectKeyword(keyword)}
                  className={`h-28 rounded-2xl flex flex-col items-center justify-center p-2 text-center font-semibold transition-all gap-2
                    ${isSelected ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  {/* getImageUrl 함수를 사용하여 동적으로 이미지 경로를 생성 */}
                  <img src={getImageUrl(keyword.icon_name)} alt={keyword.keyword_nm} className="w-8 h-8" />
                  <span className="text-xs">{keyword.keyword_nm}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="p-6 bg-white shadow-inner sticky bottom-0">
          {error && <p className="text-red-500 text-center text-sm mb-2">{error}</p>}
          <Button variant="form" onClick={handleSubmitKeywords} disabled={selectedKeywords.length === 0 || questionLoading}>
            {questionLoading ? '질문 불러오는 중...' : selectedKeywords.length > 0 ? `${selectedKeywords.length}개 선택, 다음` : '관심사를 선택하세요'}
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'questions') {
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    if (!currentQuestion) {
      return (
        <div className="flex flex-col h-screen bg-white">
          <Header title="오류" showBackButton={true} />
          <div className="flex-grow flex flex-col items-center justify-center p-6 gap-4">
            <p className="text-center text-red-500">질문을 불러오는 데 문제가 발생했습니다.</p>
            <Button onClick={() => setStep('keyword')}>키워드 선택으로 돌아가기</Button>
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col h-screen bg-white">
        <Header title={currentQuestion.keyword_nm || '건강 설문'} showBackButton={true} rightAccessory={<button onClick={() => navigate('/mypage')}><img src={userIcon} alt="My Page" className="w-8 h-8" /></button>} />
        <div className="w-full bg-gray-200 h-2"><div className="bg-blue-500 h-2 transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%` }} /></div>
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center"><p className="text-2xl font-bold text-gray-800 leading-relaxed">{currentQuestion.question}</p></div>
        <div className="p-6 sticky bottom-0 flex justify-around items-center bg-white">
          <AnswerButton type="yes" onClick={() => handleAnswer(2)} disabled={submitLoading} />
          <AnswerButton type="maybe" onClick={() => handleAnswer(1)} disabled={submitLoading} />
          <AnswerButton type="no" onClick={() => handleAnswer(0)} disabled={submitLoading} />
        </div>
      </div>
    );
  }

  return null;
};

export default Survey;