import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderWithBack from '../../components/common/HeaderWithBack';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Checkbox from '../../components/common/Checkbox.jsx';
import WarningIcon from '../../assets/warning-icon.svg';
import SadWibee from '../../assets/sad-wibee.svg';
import { useUserStore } from '../../store/userStore';
import { loginUser, deleteAccount } from '../../api/authApi';

const DeleteAccount = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserStore();
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordVerification = async () => {
    setErrorMessage('');
    if (!password) {
      setErrorMessage('비밀번호를 입력해주세요.');
      return;
    }
    if (!user || !user.user_email) {
      setErrorMessage('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    setLoading(true);
    try {
      // 현재 비밀번호 확인을 위해 로그인 API 재사용
      await loginUser(user.user_email, password);
      setStep(3); // 성공 시 다음 단계로
    } catch (err) {
      setErrorMessage('비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (!isAgreementChecked) {
      setErrorMessage('탈퇴 약관에 동의해야 합니다.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      await deleteAccount(); // 백엔드에 탈퇴 요청
      logout(); // 클라이언트 상태에서 로그아웃
      setStep(4); // 성공 시 완료 단계로
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || '회원 탈퇴에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompletion = () => {
    navigate('/', { replace: true });
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col h-full justify-between">
            <div className="text-center">
              <h3 className="text-xl font-bold">우리 WON 케어 탈퇴 전 확인해 주세요</h3>
              <div className="flex flex-col h-full justify-center items-center text-center">
                <img src={WarningIcon} alt="Warning Icon" className="w-24 h-24 mb-6" />
                <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left text-sm text-gray-700">
                  <ul className="list-disc list-inside space-y-2">
                    <li>해지 시 설문 조사 결과, 복용 영양제 등 개인 맞춤형 추천을 위해 수집했던 정보가 모두 파기됩니다.</li>
                    <li>해지 시 삭제된 데이터는 다시 가입해도 복구되지 않습니다.</li>
                    <li>재가입하셔도 기존 우리WON케어 추천 이력을 조회하실 수 없습니다.</li>
                  </ul>
                </div>
              </div>
            </div>
            <Button onClick={() => setStep(2)} variant="form">확인했어요</Button>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col h-full justify-between">
            <div>
              <h3 className="text-xl font-bold text-center">회원 비밀번호 확인</h3>
              <p className="text-center text-gray-600 mt-2">비밀번호를 한번 더 입력해주세요.</p>
              <div className="mt-8">
                <Input
                  label="비밀번호"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  error={errorMessage}
                  disabled={loading}
                />
              </div>
            </div>
            <Button onClick={handlePasswordVerification} variant="form" disabled={loading}>
              {loading ? '확인 중...' : '다음'}
            </Button>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col h-full justify-between">
            <div className="text-center">
              <h3 className="text-xl font-bold">정말 탈퇴하시겠습니까?</h3>
              <div className="flex flex-col h-full justify-center items-center text-center">
              <img src={SadWibee} alt="Sad Wibee" className="w-32 h-32 mx-auto my-6" />
              <div className="mt-8">
                <Checkbox
                  checked={isAgreementChecked}
                  onChange={(e) => setIsAgreementChecked(e.target.checked)}
                  disabled={loading}
                >
                  위 내용을 모두 확인하였으며, 회원 탈퇴에 동의합니다.
                </Checkbox>
                </div>
              </div>
              {errorMessage && <p className="text-red-500 text-sm text-center mt-2">{errorMessage}</p>}
            </div>
            <Button 
              onClick={handleAccountDeletion} 
              disabled={!isAgreementChecked || loading} 
              variant="danger"
            >
              {loading ? '처리 중...' : '탈퇴'}
            </Button>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col h-full justify-center items-center text-center">
            <h3 className="text-xl font-bold">탈퇴가 완료되었습니다.</h3>
            <p className="text-gray-600 mt-2">이용해주셔서 감사합니다.</p>
            <div className="mt-8 w-full">
              <Button onClick={handleCompletion} variant="form">메인으로 돌아가기</Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <HeaderWithBack title="우리 WON 케어 탈퇴하기" />
      <div className="flex-grow p-6 flex flex-col">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default DeleteAccount;