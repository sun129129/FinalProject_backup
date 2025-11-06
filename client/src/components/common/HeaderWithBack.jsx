import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackArrowIcon from '../../assets/back-arrow.svg';

const HeaderWithBack = ({ title }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="relative flex items-center justify-center w-full h-16 px-4 border-b border-gray-200 bg-white sticky top-0 z-10">
      <button
        onClick={handleBack}
        className="absolute left-4 p-2"
        aria-label="뒤로가기"
      >
        <img src={BackArrowIcon} alt="뒤로가기" className="w-6 h-6" />
      </button>
      <h1 className="text-xl font-bold">{title}</h1>
    </header>
  );
};

export default HeaderWithBack;