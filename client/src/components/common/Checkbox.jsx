import React, { useId } from 'react'; // useId 훅 가져오기

const Checkbox = ({
  children, // 1. 'label' 대신 'children'을 받음
  checked,
  onChange,
  className = '', // 2. 추가 스타일을 받을 prop
  ...rest // 3. disabled, name 등 나머지 props
}) => {
  // 4. 고유 ID 자동 생성
  const id = useId();

  return (
    // 5. 추가 className 적용
    <div className={`flex items-start gap-3 ${className}`}>
      <input
        id={id} // 6. 생성된 ID 사용
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 mt-0.5 rounded text-blue-600 focus:ring-blue-500 accent-blue-600 border-gray-300"
        {...rest} // 7. 'disabled' 등이 여기에 적용됨
      />
      <label
        htmlFor={id} // 8. 생성된 ID와 연결
        className="text-sm text-gray-600"
      >
        {children} {/* 9. 이제 여기에 텍스트, 링크 등 뭐든지 올 수 있음 */}
      </label>
    </div>
  );
};

export default Checkbox;