import React, { useId } from 'react'; // useId 훅 가져오기

const InputWithButton = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  buttonText,
  onButtonClick,
  error = null, // 1. 에러 메시지 prop
  buttonDisabled = false, // 2. 버튼 비활성화 prop
  className = '', // 3. 추가 스타일 prop
  ...rest // 4. input에 전달될 나머지 props
}) => {
  // 5. 고유 ID 생성 (접근성)
  const id = useId();

  // 6. 에러 상태에 따른 동적 스타일
  const hasError = !!error;
  const borderColor = hasError ? 'border-red-500' : 'border-gray-300';
  const labelColor = hasError ? 'text-red-500' : 'text-gray-500';

  return (
    // 7. 추가 className 적용
    <div className={`w-full ${className}`}>
      {/* 8. 에러 시 테두리 색상 변경 */}
      <div
        className={`relative w-full border rounded-xl p-4 pt-7 ${borderColor}`}
      >
        {/* 9. 라벨과 인풋 연결 */}
        <label
          htmlFor={id}
          className={`absolute top-2.5 left-4 text-xs ${labelColor}`}
        >
          {label}
        </label>
        
        {/* 10. ...rest로 나머지 props 적용 */}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full focus:outline-none"
          {...rest}
        />
        
        {/* 11. 오른쪽 버튼 */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <button
            type="button"
            onClick={onButtonClick}
            disabled={buttonDisabled} // 12. 버튼 비활성화 적용
            className="text-sm font-semibold text-gray-500 bg-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed" // 13. disabled 스타일 추가
          >
            {buttonText}
          </button>
        </div>
      </div>

      {/* 14. 에러 메시지 표시 */}
      {hasError && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default InputWithButton;