import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderWithBack from '../../components/common/HeaderWithBack';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';

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

const SignupInfo = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [gender, setGender] = useState(null);
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [mobileNum, setMobileNum] = useState(''); // 1. 전화번호 state 추가
  const [error, setError] = useState(null);

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
  // 2. 전화번호 핸들러 추가
  const handleMobileNumChange = (e) => {
    setMobileNum(e.target.value);
    if (error) setError(null);
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    
    // 3. 전화번호 유효성 검사 추가
    if (!name || !gender || !birthYear || !birthMonth || !birthDay || !mobileNum) {
      setError('모든 항목을 입력해주세요.');
      return;
    }
    
    // 4. 전달할 데이터에 전화번호 추가
    const stepOneData = {
      name,
      gender,
      birthdate: `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`,
      mobileNum,
    };
    
    navigate('/signup/email', { state: { stepOneData } }); 
  };

  return (
    <div className="flex flex-col h-full">
      <HeaderWithBack title="회원가입 (1/2)" /> 
      
      <div className="flex-grow flex flex-col justify-center p-6">
        <form className="flex flex-col gap-5" onSubmit={handleNextStep}>
          
          <Input
            label="이름"
            type="text"
            placeholder="이름을 입력해 주세요."
            value={name}
            onChange={handleNameChange}
          />

          {/* 5. 전화번호 입력 필드 추가 */}
          <Input
            label="전화번호"
            type="tel"
            placeholder="'-' 없이 숫자만 입력"
            value={mobileNum}
            onChange={handleMobileNumChange}
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
            <div className="grid grid-cols-3 gap-3">
              <input
                type="tel"
                placeholder="YYYY"
                maxLength="4"
                value={birthYear}
                onChange={handleYearChange}
                className="w-full text-center px-3 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none"
              />
              <input
                type="tel"
                placeholder="MM"
                maxLength="2"
                value={birthMonth}
                onChange={handleMonthChange}
                className="w-full text-center px-3 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none"
              />
              <input
                type="tel"
                placeholder="DD"
                maxLength="2"
                value={birthDay}
                onChange={handleDayChange}
                className="w-full text-center px-3 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>
          
          {error && (
            <p className="text-red-500 text-sm text-center -mt-2">{error}</p>
          )}

          <div className="mt-4">
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