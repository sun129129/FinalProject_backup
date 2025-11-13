import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderWithBack from '../../components/common/HeaderWithBack';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { findUserPassword } from '../../api/authApi';

const FindPassword = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await findUserPassword(name, birthdate, email);
      alert('인증 코드가 이메일로 발송되었습니다.');
      navigate('/reset-password', { state: { email: email } });
    } catch (err) {
      setError(err.response?.data?.detail || err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <HeaderWithBack title="비밀번호 찾기" />
      <div className="flex-grow flex flex-col justify-center p-6">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            label="이름"
            type="text"
            value={name}
            onChange={handleNameChange}
            disabled={loading}
          />
          <Input
            label="생년월일"
            type="text"
            placeholder="- 포함 8자리 숫자 입력(예: 1990-01-01)"
            value={birthdate}
            onChange={handleBirthdateChange}
            disabled={loading}
          />
          <div>
            <Input
              label="이메일"
              type="email"
              value={email}
              onChange={handleEmailChange}
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
    </div>
  );
};

export default FindPassword;