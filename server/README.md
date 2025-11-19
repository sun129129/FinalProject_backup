## Github clone 후

기본 세팅 -> venv 가상 환경 세팅

## BN
0. root 디렉토리로 이동
1. cd server
2. pip install -r requirements.txt
3. ~/server/main.py 의 36번째 줄 주석처리
@app.get("/api/v1/")
def read_root():
    return {"message": "안녕하세요??? WonCare API v1 입니다!!!!!"}
4. taskkill
5. uvicorn main:app --reload
## FN
0. npm 설치(https://nodejs.org/ko/download)
1. cd client
2. (.venv) pip install npm
3. 에러: powershell / 관리자 권한으로 pnpm install
4. npm run dev

server/
├── .env                    # 환경 변수)
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── main.py                 # (uivcorn 실행 등 가볍게!)
└── app/                    # [핵심] 실제 코드 디렉토리
    ├── __init__.py
    ├── core/               # 인증, 설정, 보안, 공통 예외
    │   ├── config.py       # DB URL, Secret Key 등 설정 관리
    │   ├── database.py     # DB 연결 세션 설정 (기존 database.py)
    │   ├── security.py     # JWT 토큰, 비밀번호 해싱 등
    │   └── exceptions.py   # 커스텀 예외 처리
    │
    ├── db/                 # 데이터베이스 관련
    │   ├── base.py         # 모든 모델을 import 하는 곳)
    │   └── models/         # [분리] 기존 models.py를 쪼개기
    │       ├── __init__.py
    │       ├── user.py     # User, UserIntake 관련
    │       ├── product.py  # Product, ProductKeyword 관련
    │       └── survey.py   # Survey, SurveyResponse, Rulebook 관련
    │
    ├── schemas/            # [분리] Pydantic 모델 (Request/Response)
    │   ├── __init__.py
    │   ├── user.py
    │   ├── product.py
    │   └── survey.py
    │
    ├── api/                # [분리] API 라우터 (Routers)
    │   ├── __init__.py
    │   ├── deps.py         # 의존성 주입 (DB 세션 가져오기 등)
    │   └── v1/             # API 버전 관리
    │       ├── __init__.py
    │       ├── router.py   # 모든 라우터를 모아놓은 곳 (지문 역할)
    │       └── endpoints/  # 실제 기능별 API
    │           ├── auth.py
    │           ├── users.py
    │           ├── products.py
    │           ├── ocr.py      # OCR 관련 API
    │           └── survey.py   # 설문 및 추천 관련 API
    │
    └── services/           # [핵심] 비즈니스 로직 (복잡한 계산 등)
        ├── __init__.py
        ├── ocr_service.py        # OCR 처리 로직
        ├── scoring_service.py    # (우리가 짠 keyword_scoring.py)
        └── recommendation.py     # 추천 알고리즘
