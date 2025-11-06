# 📝 원케어 클라이언트

Vite와 React 기반의 원케어(WonCare) 서비스 클라이언트 애플리케이션입니다.

## 🚀 시작하기

1.  **의존성 설치**:
    ```bash
    npm install
    ```

2.  **개발 서버 실행**:
    ```bash
    npm run dev
    ```

## 📂 파일 구조 및 역할

```
.
├── public/                  # 정적 파일 (빌드 시 dist로 복사됨)
├── src/
│   ├── api/                 # API 통신 관련 함수
│   │   └── authApi.js       # (Mock) 인증 관련 API
│   ├── assets/              # 이미지, SVG 등 정적 에셋
│   ├── components/
│   │   ├── common/          # 공통 재사용 컴포넌트
│   │   │   ├── Button.jsx
│   │   │   ├── Checkbox.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── InputWithButton.jsx
│   │   │   ├── Logo.jsx
│   │   │   └── Modal.jsx
│   │   └── layout/          # 레이아웃 컴포넌트
│   │       ├── DeviceFrame.jsx # 모바일 화면 프레임
│   │       └── Header.jsx      # 페이지 상단 헤더
│   ├── features/            # 기능별 컴포넌트 (페이지 단위)
│   │   ├── auth/            # 인증 기능
│   │   │   ├── Home.jsx, Login.jsx, SignupEmail.jsx 등
│   │   ├── dashboard/       # 로그인 후 대시보드
│   │   └── survey/          # 건강 설문
│   ├── hooks/               # 커스텀 훅
│   │   └── useAuth.js       # 인증 상태 및 함수 제공
│   ├── routes/              # 라우팅
│   │   └── index.jsx        # 전체 페이지 라우트 정의
│   ├── store/               # 전역 상태 관리 (Zustand)
│   │   └── userStore.js     # 사용자 정보 및 토큰 저장
│   ├── styles/              # 스타일
│   │   └── globals.css      # 전역 CSS 및 Tailwind 설정
│   ├── App.jsx              # 최상위 애플리케이션 컴포넌트
│   └── main.jsx             # React 앱 진입점
├── .gitignore               # Git 무시 파일 목록
├── eslint.config.js         # ESLint 설정
├── index.html               # HTML 진입점
├── package.json             # 프로젝트 정보 및 의존성
├── postcss.config.cjs       # PostCSS 설정
├── tailwind.config.js       # Tailwind CSS 설정
└── vite.config.js           # Vite 설정
```

### 주요 파일 설명

-   **`main.jsx`**: React 애플리케이션의 최상위 진입점입니다. `BrowserRouter`를 사용하여 라우팅을 활성화하고 `App` 컴포넌트를 렌더링합니다.

-   **`App.jsx`**: 모바일 환경을 시뮬레이션하는 `DeviceFrame` 안에 모든 페이지 라우팅을 처리하는 `AppRoutes`를 렌더링합니다.

-   **`routes/index.jsx`**: 애플리케이션의 모든 페이지 경로를 정의합니다. URL 경로에 따라 적절한 `features` 컴포넌트를 보여주는 역할을 합니다.

-   **`store/userStore.js`**: [Zustand](https://github.com/pmndrs/zustand)를 사용한 전역 상태 관리 파일입니다. 사용자의 로그인 정보(user)와 인증 토큰(token)을 저장하며, `persist` 미들웨어를 통해 `localStorage`에 정보를 저장하여 새로고침해도 로그인 상태가 유지되도록 합니다.

-   **`hooks/useAuth.js`**: `userStore`의 상태(`user`, `token`)와 액션(`login`, `logout`)을 쉽게 사용할 수 있도록 만든 커스텀 훅입니다. `isLoggedIn`과 같은 파생 상태를 제공하여 코드 중복을 줄입니다.

-   **`api/authApi.js`**: 사용자 인증과 관련된 모든 API 요청 함수가 모여 있습니다. (현재는 실제 서버 대신 Mock 데이터를 반환합니다)

-   **`components/`**:
    -   **`common/`**: `Button`, `Input`, `Modal` 등 앱 전체에서 재사용되는 범용 UI 컴포넌트가 위치합니다.
    -   **`layout/`**: `Header`, `DeviceFrame` 등 페이지의 전체적인 구조를 잡는 레이아웃 컴포넌트가 위치합니다.

-   **`features/`**: 각 기능(도메인)별 페이지 컴포넌트를 모아놓은 폴더입니다.
    -   **`auth/`**: `Home`, `Login`, `SignupEmail` 등 사용자 인증과 관련된 모든 페이지가 포함됩니다.
    -   **`dashboard/`**: 로그인 후 사용자가 처음 보게 될 메인 대시보드 페이지입니다.
    -   **`survey/`**: 맞춤 영양제 추천을 위한 건강 설문 페이지입니다.

-   **설정 파일**:
    -   **`vite.config.js`**: Vite 개발 서버 및 빌드 관련 설정입니다.
    -   **`tailwind.config.js`**, **`postcss.config.cjs`**: [Tailwind CSS](https://tailwindcss.com/) 관련 설정 파일입니다. 프로젝트 전용 색상, 폰트 등을 정의합니다.
    -   **`eslint.config.js`**: 코드 스타일과 잠재적 오류를 검사하는 ESLint의 설정 파일입니다.



# WonCare 파일별 상세 설명

## 📂 루트 레벨 파일

### `index.html`
- **역할**: HTML 진입점
- **내용**: React 앱이 마운트될 `<div id="root">`를 포함
- **특징**: Vite가 자동으로 번들된 JS/CSS를 주입

### `package.json`
- **역할**: 프로젝트 메타데이터 및 의존성 관리
- **주요 의존성**:
  - `react`, `react-dom`: 프론트엔드 프레임워크
  - `react-router-dom`: 라우팅
  - `zustand`: 상태 관리
  - `tailwindcss`: CSS 프레임워크
- **스크립트**:
  - `dev`: 개발 서버 실행
  - `build`: 프로덕션 빌드
  - `preview`: 빌드된 앱 미리보기

### `vite.config.js`
- **역할**: Vite 빌드 도구 설정
- **주요 설정**:
  - React 플러그인 활성화
  - 개발 서버 포트 설정
  - 빌드 최적화 옵션

### `tailwind.config.js`
- **역할**: Tailwind CSS 커스터마이징
- **내용**:
  - 커스텀 색상 팔레트 정의
  - 폰트 설정
  - 브레이크포인트 조정
  - content 경로 지정 (퍼지 대상 파일)

### `postcss.config.cjs`
- **역할**: PostCSS 설정 (Tailwind 처리를 위해 필요)
- **플러그인**: tailwindcss, autoprefixer

### `eslint.config.js`
- **역할**: 코드 품질 및 스타일 검사 규칙
- **설정**: React 관련 규칙, 코딩 컨벤션

---

## 📂 `src/` 디렉토리

### `main.jsx`
```jsx
// React 앱의 최상위 진입점
```
- **역할**: React 앱을 DOM에 마운트
- **주요 기능**:
  - `ReactDOM.createRoot()`로 React 18 동시성 모드 활성화
  - `BrowserRouter`로 전체 앱을 감싸 라우팅 활성화
  - 전역 스타일 (`globals.css`) 임포트

### `App.jsx`
```jsx
// 최상위 애플리케이션 컴포넌트
```
- **역할**: 앱의 전체 구조 정의
- **구조**:
  - `DeviceFrame`으로 모바일 화면 시뮬레이션
  - `AppRoutes` 컴포넌트를 통해 페이지 라우팅
- **특징**: 모바일 우선 디자인을 위한 프레임 제공

---

## 📂 `src/routes/`

### `index.jsx`
- **역할**: 전체 애플리케이션의 라우팅 정의
- **주요 라우트**:
  - `/`: Home 페이지
  - `/login`: 로그인
  - `/signup/*`: 회원가입 플로우
  - `/dashboard`: 대시보드 (로그인 필요)
  - `/survey`: 건강 설문
- **기능**:
  - `Routes`와 `Route` 컴포넌트로 URL과 컴포넌트 매핑
  - 중첩 라우팅 지원
  - 404 페이지 처리 가능

---

## 📂 `src/store/`

### `userStore.js`
```javascript
// Zustand를 사용한 전역 상태 관리
```
- **역할**: 사용자 인증 상태를 전역으로 관리
- **상태**:
  - `user`: 사용자 정보 객체 (이름, 이메일 등)
  - `token`: 인증 토큰
- **액션**:
  - `login(user, token)`: 로그인 처리
  - `logout()`: 로그아웃 처리
- **특징**:
  - `persist` 미들웨어로 localStorage에 자동 저장
  - 새로고침해도 로그인 상태 유지
  - 간단한 API로 전역 상태 접근

---

## 📂 `src/hooks/`

### `useAuth.js`
```javascript
// 인증 관련 커스텀 훅
```
- **역할**: userStore를 더 편리하게 사용하기 위한 훅
- **반환값**:
  - `user`: 현재 사용자 정보
  - `token`: 인증 토큰
  - `login`: 로그인 함수
  - `logout`: 로그아웃 함수
  - `isLoggedIn`: 로그인 여부 (boolean)
- **사용 예시**:
```javascript
const { isLoggedIn, user, logout } = useAuth();
if (isLoggedIn) {
  // 로그인된 사용자만 접근 가능한 로직
}
```

---

## 📂 `src/api/`

### `authApi.js`
- **역할**: 인증 관련 모든 API 요청 함수
- **주요 함수**:
  - `loginUser(email, password)`: 로그인 요청
  - `signupUser(userData)`: 회원가입 요청
  - `logoutUser()`: 로그아웃 요청
  - `verifyToken(token)`: 토큰 검증
- **현재 상태**: Mock 데이터 반환
- **향후 작업**: 실제 백엔드 API 엔드포인트로 대체 필요
- **에러 처리**: try-catch로 네트워크 에러 핸들링

---

## 📂 `src/components/common/`

공통으로 재사용되는 UI 컴포넌트들입니다.

### `Button.jsx`
- **역할**: 재사용 가능한 버튼 컴포넌트
- **Props**:
  - `children`: 버튼 텍스트
  - `onClick`: 클릭 핸들러
  - `variant`: 스타일 종류 (primary, secondary 등)
  - `disabled`: 비활성화 여부
- **스타일**: Tailwind 유틸리티 클래스 사용

### `Input.jsx`
- **역할**: 폼 입력 필드 컴포넌트
- **Props**:
  - `type`: input 타입 (text, password, email 등)
  - `value`: 입력값
  - `onChange`: 변경 핸들러
  - `placeholder`: 플레이스홀더
  - `error`: 에러 메시지
- **기능**: 에러 상태에 따른 스타일 변경

### `Checkbox.jsx`
- **역할**: 체크박스 입력 컴포넌트
- **Props**:
  - `checked`: 체크 상태
  - `onChange`: 변경 핸들러
  - `label`: 레이블 텍스트
- **스타일**: 커스텀 체크박스 디자인

### `InputWithButton.jsx`
- **역할**: 입력 필드와 버튼이 결합된 컴포넌트
- **사용 예**: 인증번호 발송, 검색 등
- **Props**:
  - Input 관련 props
  - Button 관련 props
- **레이아웃**: Flexbox로 입력과 버튼을 나란히 배치

### `Logo.jsx`
- **역할**: WonCare 로고 컴포넌트
- **Props**:
  - `size`: 로고 크기 (small, medium, large)
- **기능**: SVG 또는 이미지 형태의 로고 렌더링

### `Modal.jsx`
- **역할**: 모달(팝업) 컴포넌트
- **Props**:
  - `isOpen`: 모달 표시 여부
  - `onClose`: 닫기 핸들러
  - `title`: 모달 제목
  - `children`: 모달 내용
- **기능**:
  - 배경 클릭 시 닫기
  - ESC 키로 닫기
  - 포커스 트랩 (접근성)

---

## 📂 `src/components/layout/`

페이지 레이아웃을 담당하는 컴포넌트들입니다.

### `DeviceFrame.jsx`
- **역할**: 모바일 기기 화면을 시뮬레이션하는 프레임
- **기능**:
  - 고정된 모바일 화면 크기 (예: 375x812px)
  - 실제 모바일 디바이스처럼 보이는 테두리
  - 데스크톱에서 모바일 UX 테스트 용이
- **스타일**: 그림자, 둥근 모서리 등 실제 기기 느낌

### `Header.jsx`
- **역할**: 페이지 상단 헤더
- **구성 요소**:
  - 로고
  - 뒤로가기 버튼 (필요시)
  - 페이지 제목
  - 우측 액션 버튼 (설정, 알림 등)
- **특징**: 네비게이션과 통합

---

## 📂 `src/features/auth/`

인증 관련 모든 페이지 컴포넌트가 포함됩니다.

### `Home.jsx`
- **역할**: 앱의 랜딩 페이지
- **내용**:
  - WonCare 서비스 소개
  - 주요 기능 설명
  - 회원가입/로그인 버튼
- **디자인**: 매력적인 첫인상을 위한 비주얼

### `Login.jsx`
- **역할**: 로그인 페이지
- **폼 필드**:
  - 이메일 입력
  - 비밀번호 입력
  - "로그인 유지" 체크박스
- **기능**:
  - `authApi.loginUser()` 호출
  - 성공 시 `userStore.login()` 실행
  - 에러 처리 및 사용자 피드백
  - 회원가입 링크

### `SignupEmail.jsx`
- **역할**: 이메일 회원가입 첫 단계
- **폼 필드**:
  - 이메일 입력 및 검증
  - 중복 확인
- **유효성 검사**:
  - 이메일 형식 검증
  - 실시간 피드백
- **다음 단계**: 비밀번호 설정 페이지로 이동

### 기타 Auth 페이지들
- `SignupPassword.jsx`: 비밀번호 설정
- `SignupProfile.jsx`: 프로필 정보 입력
- `SignupComplete.jsx`: 회원가입 완료
- `FindPassword.jsx`: 비밀번호 찾기
- 등등...

---

## 📂 `src/features/dashboard/`

### `Dashboard.jsx` (또는 `index.jsx`)
- **역할**: 로그인 후 메인 대시보드
- **표시 정보**:
  - 사용자 환영 메시지
  - 오늘의 영양제 복용 현황
  - 건강 관련 위젯
  - 추천 영양제
  - 최근 활동 내역
- **내비게이션**: 다른 기능으로 이동하는 링크
- **보호**: 로그인하지 않으면 접근 불가

---

## 📂 `src/features/survey/`

### `Survey.jsx` (또는 여러 단계 컴포넌트)
- **역할**: 건강 설문 조사 페이지
- **질문 유형**:
  - 나이, 성별
  - 건강 상태 (수면, 스트레스, 운동)
  - 기저 질환
  - 영양제 복용 이력
- **UI/UX**:
  - 단계별 진행 표시
  - 이전/다음 버튼
  - 진행률 바
- **데이터 수집**: 응답을 서버로 전송하여 맞춤 영양제 추천

---

## 📂 `src/styles/`

### `globals.css`
- **역할**: 전역 CSS 스타일
- **내용**:
  - Tailwind CSS 디렉티브 (`@tailwind base`, `@layer` 등)
  - CSS 리셋 및 기본 스타일
  - 커스텀 CSS 변수
  - 전역 폰트 설정
  - 애니메이션 정의

---

## 📂 `src/assets/`

- **역할**: 정적 에셋 (이미지, 아이콘, SVG 등) 저장
- **구조**:
  - `images/`: PNG, JPG 이미지
  - `icons/`: SVG 아이콘
  - `fonts/`: 커스텀 폰트 (필요시)
- **사용법**: `import logo from '@/assets/images/logo.png'`

---

## 🔄 데이터 흐름

```
사용자 액션
    ↓
Feature 컴포넌트 (Login.jsx)
    ↓
API 레이어 (authApi.js)
    ↓
[Mock/Backend Server]
    ↓
전역 상태 (userStore.js)
    ↓
UI 업데이트 (모든 컴포넌트)
```

---

## 🎯 핵심 개념

### 1. **컴포넌트 재사용성**
- common 폴더의 컴포넌트를 여러 페이지에서 재사용
- Props를 통한 커스터마이징

### 2. **관심사의 분리**
- API 로직 → `api/`
- 상태 관리 → `store/`
- UI 컴포넌트 → `components/`
- 페이지 로직 → `features/`

### 3. **타입 안전성**
- 현재는 JavaScript 사용
- 향후 TypeScript 도입 고려 가능

### 4. **접근성 (A11y)**
- 시맨틱 HTML 사용
- ARIA 속성 추가
- 키보드 네비게이션 지원

---

## 📌 주요 개발 패턴

### Custom Hooks
```javascript
// 반복되는 로직을 훅으로 추출
const useAuth = () => { ... }
const useForm = () => { ... }
```

### Composition
```javascript
// 작은 컴포넌트를 조합하여 큰 컴포넌트 구성
<InputWithButton>
  <Input />
  <Button />
</InputWithButton>
```

### Feature-based Structure
```
features/
  auth/        # 인증 관련 모든 것
  dashboard/   # 대시보드 관련 모든 것
  survey/      # 설문 관련 모든 것
```

이러한 구조는 확장성과 유지보수성을 높입니다.