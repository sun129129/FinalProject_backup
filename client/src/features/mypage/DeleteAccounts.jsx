// src/features/auth/DeleteAccount.jsx
import React, { useState } from 'react';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
// import { verifyPassword, deleteUserAccount } from '../../api/authApi.js'; 

const DeleteAccount = () => {
  const [step, setStep] = useState(1); // 1: 재확인, 2: 비밀번호 확인, 3: 약관, 4: 완료
  const [password, setPassword] = useState('');
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 2단계: 비밀번호 확인 처리
  const handlePasswordVerification = async () => {
    setErrorMessage('');
    if (!password) {
      setErrorMessage('비밀번호를 입력해주세요.');
      return;
    }

    // 실제로는 서버에 비밀번호 확인 요청
    console.log('Password verification requested');
    
    // try {
    //   const response = await verifyPassword(password);
    //   if (response.isValid) { // 비밀번호가 일치하면
    //     setStep(3);
    //   } else {
    //     setErrorMessage('비밀번호가 일치하지 않습니다.');
    //   }
    // } catch (error) {
    //   setErrorMessage('비밀번호 확인에 실패했습니다.');
    // }
    
    // 테스트를 위해 일단 통과하도록 설정
    setStep(3); 
  };

  // 3단계: 최종 탈퇴 처리
  const handleAccountDeletion = async () => {
    if (!isAgreementChecked) {
        setErrorMessage('탈퇴 약관에 동의해야 합니다.');
        return;
    }
    
    // 실제로는 서버에 회원 탈퇴 요청 (DELETE API 호출)
    console.log('Account deletion requested');
    
    // try {
    //   await deleteUserAccount();
    //   // 성공 시 로컬 스토리지/쿠키의 로그인 토큰 제거 및 로그아웃 처리
    //   localStorage.removeItem('userToken'); 
    setStep(4); // 탈퇴 완료 페이지로 이동
    // } catch (error) {
    //   setErrorMessage('회원 탈퇴에 실패했습니다.');
    // }
  };

  // 4단계: 완료 후 확인 버튼
  const handleCompletion = () => {
    // 홈 화면이나 로그인 화면으로 리디렉션
    window.location.href = '/'; 
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          // 회원 탈퇴(1) - 재확인.jpg 화면
          <>
            <h3>우리 WON 케어 탈퇴 전 확인해 주세요</h3>
            <div className="warning-box" style={{ 
                padding: '20px', 
                backgroundColor: '#f8f8f8', 
                borderRadius: '8px', 
                marginTop: '30px' 
            }}>
              <ul>
                <li>해지 시 설문 조사 결과, 복용 영양제 등 개인 맞춤형 추천을 위해 수집했던 정보가 모두 파기됩니다.</li>
                <li>해지 시 삭제된 데이터는 다시 가입해도 복구되지 않습니다.</li>
                <li>재가입하셔도 기존 우리WON케어 추천 이력을 조회하실 수 없습니다.</li>
              </ul>
            </div>
            <Button onClick={() => setStep(2)} style={{ marginTop: '50px' }}>확인했어요</Button>
          </>
        );
      case 2:
        return (
          // 회원 탈퇴(2) - 비밀번호 확인.jpg 화면
          <>
            <h3>회원 비밀번호 확인</h3>
            <p style={{ color: 'red' }}>비밀번호를 한번 더 입력해주세요.</p>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              style={{ marginTop: '20px' }}
            />
            {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
            <Button onClick={handlePasswordVerification} style={{ marginTop: '30px' }}>다음</Button>
          </>
        );
      case 3:
        return (
          // 회원 탈퇴(3) - 약관 화면 (이미지 없음. 최종 동의 단계)
          <>
            <h3>정말 탈퇴하시겠습니까?</h3>
            <div className="agreement-section" style={{ marginTop: '40px', padding: '20px', border: '1px solid #ccc' }}>
                <label>
                    <input 
                        type="checkbox" 
                        checked={isAgreementChecked} 
                        onChange={(e) => setIsAgreementChecked(e.target.checked)} 
                        style={{ marginRight: '10px' }}
                    />
                    위 내용을 모두 확인하였으며, 회원 탈퇴에 동의합니다.
                </label>
            </div>
            {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
            <Button 
                onClick={handleAccountDeletion} 
                disabled={!isAgreementChecked} 
                style={{ marginTop: '30px', backgroundColor: 'red' }}
            >
                탈퇴
            </Button>
          </>
        );
      case 4:
        return (
          // 회원 탈퇴 (4) - 탈퇴 완료.jpg 화면
          <>
            <h3>탈퇴가 완료되었습니다.</h3>
            <Button onClick={handleCompletion} style={{ marginTop: '50px' }}>확인</Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="delete-account-page" style={{ padding: '20px' }}>
      <h2>우리 WON 케어 탈퇴하기</h2>
      {renderStepContent()}
    </div>
  );
};

export default DeleteAccount;