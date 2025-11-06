// src/components/common/HeaderWithBack.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeaderWithBack = ({ title, showUserProfile = false }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 돌아가기
  };

  const handleUserProfile = () => {
    // 유저 프로필 아이콘 클릭 시 동작 (예: 마이페이지 최상단으로 이동)
    navigate('/mypage'); 
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: showUserProfile ? 'space-between' : 'flex-start', // 유저 프로필이 있으면 양쪽 정렬
      padding: '16px 20px', // 좌우 패딩 늘림
      borderBottom: '1px solid #eee', // 하단 라인 추가 (선택 사항)
      backgroundColor: '#fff',
      position: 'sticky', // 스크롤 시 상단 고정
      top: 0,
      zIndex: 10,
    }}>
      <button onClick={handleBack} style={{
        background: 'none',
        border: 'none',
        fontSize: '24px', // 아이콘 크기 키움
        cursor: 'pointer',
        padding: '0',
        display: 'flex', // 텍스트와 아이콘 정렬
        alignItems: 'center',
        color: '#333',
      }}>
        &#x2039; {/* 유니코드 왼쪽 화살표 */}
      </button>
      <h1 style={{
        fontSize: '1.2rem', // 제목 크기 조절
        fontWeight: 'bold',
        marginLeft: showUserProfile ? '0' : '15px', // 유저 프로필이 없으면 왼쪽 마진
        flexGrow: showUserProfile ? 0 : 1, // 유저 프로필이 없으면 제목이 중앙으로 이동하지 않도록
        textAlign: showUserProfile ? 'left' : 'center', // 유저 프로필이 있으면 왼쪽 정렬
        transform: showUserProfile ? 'none' : 'translateX(-10%)' // 유저 프로필 없으면 제목을 중앙으로 약간 이동
      }}>
        {title}
      </h1>
      {showUserProfile && (
        <button onClick={handleUserProfile} style={{
          background: 'none',
          border: 'none',
          fontSize: '30px',
          cursor: 'pointer',
          padding: '0',
          color: '#007bff', // 파란색 프로필 아이콘
        }}>
          👤
        </button>
      )}
    </div>
  );
};

export default HeaderWithBack;