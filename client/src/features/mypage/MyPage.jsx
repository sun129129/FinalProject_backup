// src/features/mypage/MyPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input.jsx'; 
import Button from '../../components/common/Button.jsx';

const MyPage = () => {
  const navigate = useNavigate();
  
  // 💡 실제로는 이 사용자 정보는 useAuth 훅이나 Redux/Context 등 
  // 전역 상태 관리에서 가져와야 합니다.
  const currentUser = {
    nickname: '닉네임',
    email: '기존 이메일@example.com',
    passwordMasked: 'C****', // 보안상 마스킹된 비밀번호
  };

  // 닉네임, 이메일은 읽기 전용으로 표시 (수정은 별도 페이지에서 할 수 있음)
  const handleEditInfo = () => {
    console.log('개인 정보 수정 페이지로 이동');
    // navigate('/mypage/edit-info'); // 만약 수정 페이지가 있다면
  };

  // 비밀번호 수정 페이지로 이동
  const handleChangePassword = () => {
    navigate('/mypage/change-password');
  };

  // 회원 탈퇴 페이지로 이동
  const handleDeleteAccount = () => {
    navigate('/mypage/delete-account');
  };

  // 로그아웃 버튼 처리
  const handleLogout = () => {
    // 💡 실제 로그아웃 로직: 
    // 1. 서버에 로그아웃 API 요청 (선택 사항, 토큰 만료 처리)
    // 2. 로컬 스토리지/쿠키에서 토큰 제거
    // 3. 사용자 상태 초기화 (Context/Redux)
    console.log('로그아웃 처리');
    localStorage.removeItem('userToken'); // 예시
    navigate('/login');
  };

  return (
    <div className="mypage-container" style={{ padding: '20px' }}>
      
      {/* 📌 고객 정보 섹션 */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>고객 정보</h2>
      
      <div className="user-info-section">
        <Input 
          label="닉네임"
          value={currentUser.nickname}
          readOnly
          style={{ marginBottom: '15px' }}
        />
        <Input 
          label="이메일"
          value={currentUser.email}
          readOnly
          style={{ marginBottom: '15px' }}
        />
        <Input 
          label="비밀번호"
          value={currentUser.passwordMasked}
          readOnly
          style={{ marginBottom: '30px' }}
        />
      </div>

      {/* 📌 계정 관리 메뉴 */}
      <div className="account-management-menu">
        <Button 
          variant="outline"
          onClick={handleChangePassword}
          style={{ width: '100%', marginBottom: '10px' }}
        >
          비밀번호 재설정
        </Button>
        
        {/*
        <Button 
          variant="outline"
          onClick={handleEditInfo}
          style={{ width: '100%', marginBottom: '10px' }}
        >
          회원 정보 수정
        </Button>
        */}
        
        <Button 
          variant="outline"
          onClick={handleDeleteAccount}
          style={{ width: '100%', marginBottom: '30px', color: 'red', borderColor: 'red' }}
        >
          회원 탈퇴
        </Button>

        <Button 
          onClick={handleLogout}
          style={{ width: '100%', backgroundColor: '#f0f0f0', color: '#333' }}
        >
          로그아웃
        </Button>
      </div>

    </div>
  );
};

export default MyPage;