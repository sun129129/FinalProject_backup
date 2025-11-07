// src/features/survey/Survey.jsx (O, △, X 3가지 응답 버전)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore'; // 로그인 확인용
import Header from '../../components/layout/Header'; // 'layout' 폴더의 Header
import Button from '../../components/common/Button'; // 'common' 폴더의 Button
import { getSurveyQuestions, submitSurveyAnswers } from '../../api/surveyApi'; // 'api' 폴더의 surveyApi

// O/△/X 버튼을 위한 '단일 질문' 컴포넌트
const SurveyQuestion = ({ question, answer, onAnswer }) => {
  // 1. [수정!] 3가지 상태 (O=2, △=1, X=0)
  const isYes = answer === 2;
  const isMaybe = answer === 1;
  const isNo = answer === 0;

  return (
    <div className="bg-white p-5 rounded-lg shadow mb-4">
      <p className="text-lg font-medium text-gray-800 mb-4">{question.question}</p>
      {/* 2. [수정!] 버튼 3개 렌더링 */}
      <div className="flex gap-3">
        {/* O (그렇다) 버튼 */}
        <button
          onClick={() => onAnswer(question.question_id, 2)}
          className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
            isYes
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          O (그렇다)
        </button>
        {/* △ (보통) 버튼 */}
        <button
          onClick={() => onAnswer(question.question_id, 1)}
          className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
            isMaybe
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          △ (보통)
        </button>
        {/* X (아니다) 버튼 */}
        <button
          onClick={() => onAnswer(question.question_id, 0)}
          className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
            isNo
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          X (아니다)
        </button>
      </div>
    </div>
  );
};

// '설문' 메인 페이지
const Survey = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  // 상태 관리
  const [questions, setQuestions] = useState([]); // DB에서 가져온 질문 목록
  const [answers, setAnswers] = useState({}); // { 101: 2, 102: 0, 103: 1 }
  const [loading, setLoading] = useState(true); // 페이지 로딩
  const [submitLoading, setSubmitLoading] = useState(false); // 제출 로딩
  const [error, setError] = useState(null);

  // [보호 로직] 로그인 안 했으면 쫓아내기
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // [데이터 로딩] 페이지가 열리면 '질문 목록' 가져오기
  useEffect(() => {
    if (user) { 
      const fetchQuestions = async () => {
        try {
          setLoading(true);
          const data = await getSurveyQuestions();
          setQuestions(data); 
          setAnswers({}); 
        } catch (err) {
          setError(err.message || '질문을 불러오는 데 실패했습니다.');
        } finally {
          setLoading(false);
        }
      };
      fetchQuestions();
    }
  }, [user]);

  // O/△/X 버튼 클릭 시 '답변' 상태 업데이트
  const handleAnswer = (questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  // '제출하기' 버튼 클릭 시
  const handleSubmit = async () => {
    // 모든 질문에 답했는지 확인
    if (Object.keys(answers).length !== questions.length) {
      setError('모든 질문에 O/△/X로 답변해 주세요.');
      return;
    }
    
    setSubmitLoading(true);
    setError(null);

    // API가 원하는 형식으로 '답변' 가공
    const formattedAnswers = Object.entries(answers).map(([qid, ans]) => ({
      question_id: parseInt(qid, 10),
      answer: ans, // 0, 1, 2 중 하나
    }));

    try {
      // (API 호출!) '날것' 데이터 DB에 저장
      await submitSurveyAnswers(formattedAnswers);
      
      // (성공!) LLM이 분석할 '결과' 페이지로 이동
      alert('설문이 성공적으로 제출되었습니다. 결과를 분석합니다.');
      navigate('/recommendations');

    } catch (err) {
      setError(err.message || '제출에 실패했습니다.');
      setSubmitLoading(false);
    }
  };

  // 렌더링
  if (!user) return null; // (로그인 안 한 유저 쫓아내는 중)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">설문지를 불러오는 중...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header title="건강 설문" showBackButton={true} />
      
      <div className="flex-grow p-6 overflow-y-auto">
        {questions.length === 0 && !loading && (
          <p className="text-center text-gray-500">
            (서버 `survey` DB에 임시 질문 데이터가 없습니다.)
          </p>
        )}
        {questions.map((q) => (
          <SurveyQuestion
            key={q.question_id}
            question={q}
            answer={answers[q.question_id]} // 현재 선택된 답변
            onAnswer={handleAnswer}
          />
        ))}
      </div>
      
      {questions.length > 0 && (
        <div className="p-6 bg-white shadow-inner sticky bottom-0">
          {error && (
            <p className="text-red-500 text-center text-sm mb-2">{error}</p>
          )}
          <Button 
            variant="form"
            onClick={handleSubmit}
            disabled={submitLoading || Object.keys(answers).length !== questions.length}
          >
            {submitLoading ? '제출 중...' : '제출하고 결과보기'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Survey;