태양 Github clone 후

기본 환경 -> venv 가상환경 설치
## BN
0. root 파일/server/.env -> env 파일 위치
1. cd server
2. pip install -r requirements.txt
3. ~/server/main.py 수정
36번째 줄 코드
@app.get("/api/v1/")
def read_root():
    return {"message": "안녕하세요??? WonCare API v1 ??서버입니다??"}
4. taskkill
5. uvicorn main:main_app --reload
## FN
0. npm 설치 (링크: https://nodejs.org/ko/download)
1. cd client
2. (.venv) pip install npm
3. 환경: powershell / 위치: ~/client 내부에서 pnpm install
4. npm run dev



server/
├── .env                    # 환경 변수 (Git 제외)
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── main.py                 # 앱 실행 진입점 (최대한 가볍게!)
└── app/                    # [핵심] 소스 코드 폴더
    ├── __init__.py
    ├── core/               # 프로젝트 설정, 보안, 공통 상수
    │   ├── config.py       # DB URL, Secret Key 등 설정 관리
    │   ├── database.py     # DB 연결 세션 설정 (기존 database.py)
    │   ├── security.py     # JWT 토큰, 비밀번호 해싱 등
    │   └── exceptions.py   # 커스텀 에러 처리
    │
    ├── db/                 # 데이터베이스 관련
    │   ├── base.py         # 모든 모델을 import 하는 파일 (Alembic용)
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
    ├── api/                # [분리] API 엔드포인트 (Routers)
    │   ├── __init__.py
    │   ├── deps.py         # 의존성 주입 (현재 유저 가져오기 등)
    │   └── v1/             # API 버전 관리
    │       ├── __init__.py
    │       ├── router.py   # 모든 라우터를 모으는 곳 (★질문하신 부분)
    │       └── endpoints/  # 실제 기능별 API
    │           ├── auth.py
    │           ├── users.py
    │           ├── products.py
    │           ├── ocr.py      # OCR 관련 API
    │           └── survey.py   # 설문 및 추천 관련 API
    │
    └── services/           # [핵심] 비즈니스 로직 (복잡한 계산)
        ├── __init__.py
        ├── ocr_service.py        # OCR 이미지 처리 로직
        ├── scoring_service.py    # (우리가 짠 keyword_scoring.py)
        └── recommendation.py     # 추천 알고리즘 로직