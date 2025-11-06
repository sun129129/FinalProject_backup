import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button'; // 1. 'LoginButton' 대신 'Button'

const FindPassword = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null); // 2. 에러 상태 추가
  const [loading, setLoading] = useState(false); // 3. 로딩 상태 추가

  // 4. 에러 초기화를 위한 개별 핸들러
  const handleNameChange = (e) => {
    setName(e.target.value);
    if (error) setError(null);
  };
  const handleBirthdateChange = (e) => {
    setBirthdate(e.target.value);
    if (error) setError(null);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  // 5. 비동기 API 호출 로직으로 변경
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // (이 부분을 나중에 api/authApi.js의 실제 API 호출로 대체)
    const mockApiCall = () =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (
            name === '테스트' &&
            birthdate === '1234' &&
            email === 'test@test.com'
          ) {
            resolve({ success: true });
          } else {
            reject(new Error('일치하는 사용자가 없습니다.'));
          }
        }, 1000); // 1초 딜레이
      });

    try {
      await mockApiCall();
      // 1. 성공 시: 'ResetPassword' 페이지로 이메일 정보와 함께 이동
      navigate('/reset-password', { state: { email: email } });
    } catch (err) {
      // 2. 실패 시: 에러 메시지
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false); // 로딩 끝
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* 6. '뒤로가기' 버튼 활성화 */}
      <Header title="비밀번호 찾기" showBackButton={true} />
      <div className="flex-grow p-6">
        <form className="flex flex-col gap-4 mt-8" onSubmit={handleSubmit}>
          <Input
            label="이름"
            type="text"
            value={name}
            onChange={handleNameChange} // 4-1. 핸들러 연결
            disabled={loading} // 7. 로딩 중 비활성화
          />
          <Input
            label="생년월일"
            type="text"
            value={birthdate}
            onChange={handleBirthdateChange} // 4-2. 핸들러 연결
            disabled={loading} // 7. 로딩 중 비활성화
          />
          <div>
            <Input
              label="이메일"
              type="email"
              value={email}
              onChange={handleEmailChange} // 4-3. 핸들러 연결
              disabled={loading} // 7. 로딩 중 비활성화
              error={error} // 8. 에러 메시지를 이 Input에 표시
            />
            {/* 폼 레벨의 에러가 Input 컴포넌트로 들어가서 수동 <p> 태그 필요 없음 */}
          </div>
          <div className="mt-4">
            {/* 9. 'Button' 컴포넌트 사용 + 로딩 상태 반영 */}
            <Button
              type="submit"
              variant="form"
              disabled={loading}
            >
              {loading ? '확인 중...' : '다음'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FindPassword;