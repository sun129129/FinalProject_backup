import React, { useId } from 'react'; // useId 훅을 가져와!

const Input = ({
  label,
  type,
  value,
  onChange,
  rightAccessory,
  error = null, // 1. 에러 메시지를 받을 prop 추가 (기본값 null)
  className = '', // 2. 추가 스타일을 받을 prop 추가
  ...rest // 3. placeholder, disabled, name, autoComplete 등 나머지 모든 props
}) => {
  // 4. 리액트 훅으로 고유한 ID를 생성해. (접근성을 위해)
  const id = useId();

  // 5. 에러 상태에 따라 스타일을 동적으로 변경
  const hasError = !!error; // error가 있으면 true
  const baseBorderColor = hasError ? 'border-red-500' : 'border-gray-300';
  const focusedBorderColor = hasError
    ? 'focus:ring-red-500'
    : 'focus:ring-blue-500';
  const labelColor = hasError ? 'text-red-500' : 'text-gray-500';

  return (
    // 6. 부모가 준 className을 여기에 적용
    <div className={`relative w-full ${className}`}>
      <label
        htmlFor={id} // 7. label의 'for'와 input의 'id'를 연결
        className={`absolute top-2.5 left-4 text-xs ${labelColor}`}
      >
        {label}
      </label>
      <input
        id={id} // 7. 생성한 고유 id를 적용
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full px-4 pt-7 pb-2.5 border rounded-xl focus:outline-none focus:ring-2 ${baseBorderColor} ${focusedBorderColor} ${
          rightAccessory ? 'pr-10' : 'pr-4'
        }`}
        {...rest} // 8. 여기에 placeholder, disabled, name 등이 모두 적용됨
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
        {rightAccessory}
      </div>

      {/* 9. 에러 메시지가 있을 때만 이 <p> 태그를 보여줌 */}
      {hasError && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;