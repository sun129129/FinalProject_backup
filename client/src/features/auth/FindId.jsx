import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Input from '../../components/common/Input'; // 1. 업그레이드된 Input
import Button from '../../components/common/Button'; // 2. 'LoginButton' 대신 'Button'
import Modal from '../../components/common/Modal';

const FindId = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [error, setError] = useState(null);
  const [foundId, setFoundId] = useState(null);
  const [loading, setLoading] = useState(false); // 3. API 통신을 위한 '로딩' 상태

  // 4. 에러를 초기화하는 'onChange' 핸들러
  const handleNameChange = (e) => {
    setName(e.target.value);
    if (error) setError(null); // 타이핑하면 에러 메시지 지우기
  };

  const handleBirthdateChange = (e) => {
    setBirthdate(e.target.value);
    if (error) setError(null); // 타이핑하면 에러 메시지 지우기
  };

  // 5. 'async/await'를 사용한 비동기 API 호출 로직
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 로딩 시작
    setError(null);

    // (이 부분을 나중에 api/authApi.js의 실제 API 호출로 대체)
    const mockApiCall = () =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (name === '테스트' && birthdate === '1234') {
            resolve({ userId: 'your-id-123' });
          } else {
            reject(new Error('일치하는 사용자가 없습니다.'));
          }
        }, 1000); // 1초 딜레이
      });

    try {
      const data = await mockApiCall();
      // 1. 성공 시: 팝업 띄우기
      setFoundId(data.userId);
    } catch (err) {
      // 2. 실패 시: 에러 메시지
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
      setFoundId(null);
    } finally {
      setLoading(false); // 로딩 끝
    }
  };

  const handleGoLogin = () => {
    setFoundId(null); // 모달 닫고
    navigate('/login'); // 로그인 화면으로
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* 6. '뒤로가기' 버튼 활성화 */}
      <Header title="아이디 찾기" showBackButton={true} />
      <div className="flex-grow p-6">
        <form className="flex flex-col gap-4 mt-8" onSubmit={handleSubmit}>
          <Input
            label="이름"
            type="text"
            value={name}
            onChange={handleNameChange} // 4-1. 에러 초기화 핸들러 연결
            disabled={loading} // 로딩 중엔 입력 방지
          />
          <div>
            <Input
              label="생년월일"
              type="text"
              value={birthdate}
              onChange={handleBirthdateChange} // 4-2. 에러 초기화 핸들러 연결
              disabled={loading} // 로딩 중엔 입력 방지
              error={error} // 7. Input 컴포넌트에 'error' prop 직접 전달
            />
            {/* 8. 수동 에러 메시지 <p> 태그 삭제! (Input이 알아서 해줌) */}
          </div>

          <div className="mt-4">
            {/* 9. 'Button' 컴포넌트 사용 + 로딩/비활성화 상태 반영 */}
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

      {/* 10. 모달 부분 (기존과 거의 동일, 'Button'만 교체) */}
      {foundId && (
        <Modal onClose={() => !loading && setFoundId(null)}>
          <div className="text-center p-4">
            <h3 className="text-lg font-bold mb-4">아이디 확인</h3>
            <p className="text-gray-700 mb-6">
              회원님의 아이디는 <br />
              <strong className="text-blue-600">{foundId}</strong> 입니다.
            </p>
            <Button variant="form" onClick={handleGoLogin}>
              로그인
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FindId;