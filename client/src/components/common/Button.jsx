import React from 'react';

/**
 * 앱 전체에서 사용할 공통 버튼
 * @param {'primary' | 'secondary' | 'form'} variant - 버튼 스타일 종류
 * - 'primary': 메인 '로그인' (진한 남색)
 * - 'secondary': 메인 '회원가입' (흰색 테두리)
 * - 'form': 폼 제출용 (파란색, 기존 LoginButton)
 * @param {boolean} disabled - 비활성화 (로딩 중)
 * @param {string} className - 추가적인 Tailwind/CSS 클래스
 */
const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '', // 1. 이 부분을 추가!
}) => {
  // 1. 공통 스타일
  const baseStyle =
    'w-full font-bold py-3.5 rounded-lg shadow-md transition-colors duration-150 ease-in-out';

  // 2. variant별 스타일
  const styles = {
    primary: 'bg-[rgb(26,62,169)] text-white hover:bg-blue-900',
    secondary: 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50',
    form: 'bg-[rgb(80,103,199)] text-white hover:bg-blue-700',
  };

  // 3. 비활성화 스타일
  const disabledStyle =
    'disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      // 4. 모든 스타일 조합 + 추가 className
      className={`${baseStyle} ${styles[variant]} ${disabledStyle} ${className}`} // 2. 이 부분을 수정!
    >
      {children}
    </button>
  );
};

export default Button;