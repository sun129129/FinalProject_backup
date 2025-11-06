module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB', // 메인 (blue-600)
          600: '#2563EB',
          700: '#1E40AF'
        },
        muted: '#6B7280', // 입력 placeholder 등
        bg: '#F7FAFC', // 전체 배경 (very light)
        card: '#FFFFFF',
        danger: '#EF4444',
        success: '#16A34A'
      },
      borderRadius: {
        'lg-2': '14px'
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans KR', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'card': '0 6px 20px rgba(15,23,42,0.06)'
      }
    }
  },
  plugins: [],
}
