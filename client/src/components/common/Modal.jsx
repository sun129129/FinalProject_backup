import React, { useEffect } from 'react'; // useEffect 훅을 가져와!

const Modal = ({ children, onClose, className = '' }) => {
  // 1. Escape 키로 닫기 위한 useEffect
  useEffect(() => {
    // 2. 키보드 이벤트 핸들러
    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        onClose(); // Escape 키가 눌리면 onClose 함수 호출
      }
    };

    // 3. 모달이 열릴 때(마운트될 때) 이벤트 리스너 추가
    document.addEventListener('keydown', handleKeydown);

    // 4. 모달이 닫힐 때(언마운트될 때) 이벤트 리스너 제거 (메모리 누수 방지)
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [onClose]); // onClose 함수가 바뀔 때만 이 효과를 다시 실행

  return (
    // 1. 뒷배경 (기존과 동일)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} // 뒷배경 클릭하면 닫힘
    >
      {/* 2. 실제 팝업창 (하얀 박스) */}
      <div
        // 5. 접근성을 위한 속성 추가
        role="dialog"
        aria-modal="true"
        // 6. 'max-w-sm'을 기본으로 하되, 부모가 준 className으로 덮어쓰기
        className={`bg-white rounded-2xl shadow-xl p-6 w-11/12 max-w-sm ${className}`}
        onClick={(e) => e.stopPropagation()} // 팝업창 안은 클릭해도 안 닫힘
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;