import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Input from '../../components/common/Input.jsx'; // 1. 'SignupInput' -> 'Input'
import Button from '../../components/common/Button.jsx'; // 2. 'LoginButton' -> 'Button'

// GenderToggle 컴포넌트는 잘 만들었어! (수정 X)
const GenderToggle = ({ selectedGender, onSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => onSelect('male')}
        className={`w-full py-3 rounded-xl border ${
          selectedGender === 'male'
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-gray-100 text-gray-500 border-gray-200'
        }`}
      >
        남
      </button>
      <button
        type="button"
        onClick={() => onSelect('female')}
        className={`w-full py-3 rounded-xl border ${
          selectedGender === 'female'
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-gray-100 text-gray-500 border-gray-200'
        }`}
      >
        여
      </button>
    </div>
  );
};

// 회원가입 1단계 (정보 입력)
const SignupInfo = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [gender, setGender] = useState(null);
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [error, setError] = useState(null); // 3. alert() 대신 error 상태

  // 4. 입력 시 에러를 지우는 핸들러들
  const handleNameChange = (e) => {
    setName(e.target.value);
    if (error) setError(null);
  };
  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
    if (error) setError(null);
  };
  const handleYearChange = (e) => {
    setBirthYear(e.target.value);
    if (error) setError(null);
  };
  const handleMonthChange = (e) => {
    setBirthMonth(e.target.value);
    if (error) setError(null);
  };
  const handleDayChange = (e) => {
    setBirthDay(e.target.value);
    if (error) setError(null);
  };

  // 5. "다음" 버튼 클릭 시
  const handleNextStep = (e) => {
    e.preventDefault();
    
    // 6. 유효성 검사 (alert -> setError)
    if (!name || !gender || !birthYear || !birthMonth || !birthDay) {
      setError('모든 항목을 입력해주세요.');
      return;
    }
    
    // 7. ★★★ 핵심 ★★★
    // 1단계 정보를 객체로 묶기
    const stepOneData = {
      name,
      gender,
      birthdate: `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`,
    };
    
    // 8. 2단계(이메일/비번) 페이지로 이동할 때 'state'에 담아서 전달
    navigate('/signup/email', { state: { stepOneData } }); 
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* 9. '뒤로가기' 버튼 활성화 */}
      <Header title="회원가입 (1/2)" showBackButton={true} /> 
      
      <div className="flex-grow p-6">
        <form className="flex flex-col gap-5" onSubmit={handleNextStep}>
          
          {/* 10. 'Input' 컴포넌트 사용 */}
          <Input
            label="이름"
            type="text"
            placeholder="이름을 입력해 주세요."
            value={name}
            onChange={handleNameChange} // 4-1. 핸들러 연결
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              성별
            </label>
            <GenderToggle selectedGender={gender} onSelect={handleGenderSelect} /> 
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              생년월일
            </label>
            {/* 이 부분은 UI 통일성보다 YYYY/MM/DD 입력 편의성이 중요하므로
                raw <input>을 유지하는 것도 좋은 선택이야! */}
            <div className="grid grid-cols-3 gap-3">
              <input
                type="tel" // 'text'보다 'tel'이 숫자 키패드를 유도
                placeholder="YYYY"
                maxLength="4"
                value={birthYear}
                onChange={handleYearChange} // 4-3. 핸들러 연결
                className="w-full text-center px-3 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none"
              />
              <input
                type="tel"
                placeholder="MM"
                maxLength="2"
                value={birthMonth}
                onChange={handleMonthChange} // 4-4. 핸들러 연결
                className="w-full text-center px-3 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none"
              />
              <input
                type="tel"
                placeholder="DD"
                maxLength="2"
                value={birthDay}
                onChange={handleDayChange} // 4-5. 핸들러 연결
                className="w-full text-center px-3 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>
          
          {/* 11. 에러 메시지 표시 */}
          {error && (
            <p className="text-red-500 text-sm text-center -mt-2">{error}</p>
          )}

          <div className="mt-4">
            {/* 12. 'Button' 컴포넌트 사용 */}
            <Button type="submit" variant="form">
              다음
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupInfo;