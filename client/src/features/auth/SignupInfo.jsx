import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderWithBack from '../../components/common/HeaderWithBack';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { checkMobileNumDuplicate } from '../../api/authApi.js';

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

// --- 유효성 검사 도우미 함수 ---
const calculateAge = (birthdate) => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const validateBirthdate = (year, month, day) => {
  const y = parseInt(year, 10);
  const m = parseInt(month, 10);
  const d = parseInt(day, 10);

  if (!y || !m || !d) return '생년월일을 모두 입력해주세요.';
  if (y >= 2026) return '유효하지 않은 날짜입니다.';
  
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() + 1 !== m || date.getDate() !== d) {
    return '유효하지 않은 날짜입니다.';
  }
  if (calculateAge(`${y}-${m}-${d}`) < 14) {
    return '만 14세 이상만 가입할 수 있습니다.';
  }
  return null;
};


const SignupInfo = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [gender, setGender] = useState(null);
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [mobileNum, setMobileNum] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value.replace(/[^0-9]/g, ''));
    if (formError) setFormError(null);
  };
  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
    if (error) setError(null);
  };
  const handleYearChange = (e) => {
    setBirthYear(e.target.value.replace(/[^0-9]/g, ''));
    if (error) setError(null);
  };
  const handleMonthChange = (e) => {
    setBirthMonth(e.target.value.replace(/[^0-9]/g, ''));
    if (error) setError(null);
  };
  const handleDayChange = (e) => {
    setBirthDay(e.target.value.replace(/[^0-9]/g, ''));
    if (error) setError(null);
  };
  const handleMobileNumChange = (e) => {
    // 숫자만 남기고 11자리로 제한
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    setMobileNum(numericValue.slice(0, 11));
    if (error) setError(null);
  };

  const handleNextStep = async (e) => {
    e.preventDefault();
    setFormError(null);
    
    // 1. 기본 유효성 검사
    if (!name || !gender || !birthYear || !birthMonth || !birthDay || !mobileNum) {
      setFormError('모든 항목을 입력해주세요.');
      return;
    }
    const birthdateError = validateBirthdate(birthYear, birthMonth, birthDay);
    if (birthdateError) {
      setFormError(birthdateError);
      return;
    }
    if (mobileNum.length !== 11) {
      setFormError('전화번호는 11자리여야 합니다.');
      return;
    }

    setIsLoading(true);
    try {
      // 2. 전화번호 중복 확인 API 호출
      const response = await checkMobileNumDuplicate(mobileNum);
      if (response.is_duplicate) {
        setFormError('이미 가입된 사용자입니다.');
        setIsLoading(false);
        return;
      }

      // 3. 중복이 아닐 경우 다음 단계로 이동
      const stepOneData = {
        name,
        gender,
        birthdate: `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`,
        mobileNum,
      };
      navigate('/signup/email', { state: { stepOneData } });

    } catch (err) {
      setFormError('확인 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const isNextButtonDisabled = !name || !gender || !birthYear || !birthMonth || !birthDay || !mobileNum || isLoading;

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
            onChange={(e) => { setName(e.target.value); if (formError) setFormError(null); }}
          />
          
          <Input
            label="전화번호"
            type="tel"
            placeholder="'-' 없이 숫자만 입력"
            value={mobileNum}
            onChange={handleMobileNumChange}
            maxLength="11"
            error={formError && formError.includes('전화번호') ? formError : null}
          />

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              성별
            </label>
            <GenderToggle 
              selectedGender={gender} 
              onSelect={(g) => { setGender(g); if (formError) setFormError(null); }} 
            /> 
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
                onChange={handleInputChange(setBirthYear)}
                className="w-full text-center px-3 py-3 bg-gray-100 border-gray-200 rounded-xl focus:outline-none"
              />
              <input
                type="tel"
                placeholder="MM"
                maxLength="2"
                value={birthMonth}
                onChange={handleInputChange(setBirthMonth)}
                className="w-full text-center px-3 py-3 bg-gray-100 border-gray-200 rounded-xl focus:outline-none"
              />
              <input
                type="tel"
                placeholder="DD"
                maxLength="2"
                value={birthDay}
                onChange={handleInputChange(setBirthDay)}
                className="w-full text-center px-3 py-3 bg-gray-100 border-gray-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>
          
          {formError && (
            <p className="text-red-500 text-sm text-center -mt-2">{formError}</p>
          )}

          <div className="mt-4">
            <Button type="submit" variant="form" disabled={isNextButtonDisabled}>
              {isLoading ? '확인 중...' : '다음'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupInfo;