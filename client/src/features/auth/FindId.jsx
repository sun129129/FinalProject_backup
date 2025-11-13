import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findUserId } from '../../api/authApi';
import HeaderWithBack from '../../components/common/HeaderWithBack';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const FindId = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [error, setError] = useState(null);
  const [foundId, setFoundId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (error) setError(null);
  };

  const handleBirthdateChange = (e) => {
    setBirthdate(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await findUserId(name, birthdate);
      setFoundId(data.user_email);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || '알 수 없는 오류가 발생했습니다.');
      setFoundId(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGoLogin = () => {
    setFoundId(null);
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full">
      <HeaderWithBack title="아이디 찾기" />
      <div className="flex-grow flex flex-col justify-center p-6">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            label="이름"
            type="text"
            value={name}
            onChange={handleNameChange}
            disabled={loading}
          />
          <div>
            <Input
              label="생년월일"
              type="text"
              placeholder="- 포함 8자리 숫자 입력(예: 1990-01-01)"
              value={birthdate}
              onChange={handleBirthdateChange}
              disabled={loading}
              error={error}
            />
          </div>

          <div className="mt-4">
            <Button type="submit" variant="form" disabled={loading}>
              {loading ? '확인 중...' : '다음'}
            </Button>
          </div>
        </form>
      </div>

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