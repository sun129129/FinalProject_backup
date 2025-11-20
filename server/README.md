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
5. uvicorn main:main_app --reload
## FN
0. npm 설치(https://nodejs.org/ko/download)
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







이전 구조 (`main.py` 하나에 모든 기능이 있던 시절):

    1 # 이전 server/main.py
    2
    3 # 1. API 로직을 담을 'sub_app' 생성
    4 sub_app = FastAPI()
    5 sub_app.include_router(auth.router, ...)
    6 sub_app.include_router(survey.router, ...)
    7 # ...
    8
    9 # 2. 전체를 감싸는 'main_app' 생성
   10 main_app = FastAPI()
   11
   12 # 3. '/api/v1' 경로에 sub_app을 탑재(mount)
   13 main_app.mount("/api/v1", sub_app)
   14
   15 # 4. 실행 명령어: uvicorn main:main_app --reload

  이전에는 main_app이라는 큰 앱 안에 /api/v1 경로를 처리하는 sub_app을 넣는 복잡한 구조였습니다.
# 현재 server/main.py
   2 import uvicorn
   3 from app.main import app  # app 폴더의 main.py에서 app 객체를 가져옴
   4
   5 if __name__ == "__main__":
   6     uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

  2. `server/app/main.py` (핵심 애플리케이션)
   * 이 파일이 실질적인 FastAPI 앱을 생성하고 설정하는 곳입니다.
   * 여기서 FastAPI 인스턴스를 app이라는 이름으로 만들었습니다. 이것이 기존의 sub_app의 역할을 대체합니다.
   * 모든 API 라우터를 직접 포함하는 대신, 라우터들을 모아놓은 api_router 하나만 포함합니다.

    1 # 현재 server/app/main.py
    2 from fastapi import FastAPI
    3 from app.api.v1.router import api_router # 라우터 묶음을 가져옴
    4
    5 # FastAPI 앱 생성 (이것이 핵심!)
    6 app = FastAPI()
    7
    8 # 미들웨어 설정...
    9
   10 # '/api/v1' 접두사를 붙여 라우터 묶음을 포함
   11 app.include_router(api_router, prefix="/api/v1")

  3. `server/app/api/v1/router.py` (라우터 묶음)
   * 이 파일은 auth, survey 등 개별 API 라우터들을 모두 모아서 api_router라는 하나의 큰 라우터로 묶는 역할을 합니다.

   1 # 현재 server/app/api/v1/router.py
   2 from fastapi import APIRouter
   3 from .endpoints import auth, survey, ocr, user_intake
   4
   5 api_router = APIRouter()     

  현재 구조 (리팩토링 후):

  이제는 역할에 따라 기능이 세 개의 주요 파일로 나뉘었습니다.

  1. `server/main.py` (새로운 진입점)
   * 이 파일은 이제 서버를 실행시키는 역할만 하는 매우 간단한 파일입니다.                                                                         ▄
   * 실제 앱 로직은 app.main에서 가져옵니다.     


           * 이 파일이 실질적인 FastAPI 앱을 생성하고 설정하는 곳입니다.
   * 여기서 FastAPI 인스턴스를 app이라는 이름으로 만들었습니다. 이것이 기존의 sub_app의 역할을 대체합니다.
   * 모든 API 라우터를 직접 포함하는 대신, 라우터들을 모아놓은 api_router 하나만 포함합니다.

    1 # 현재 server/app/main.py
    2 from fastapi import FastAPI
    3 from app.api.v1.router import api_router # 라우터 묶음을 가져옴
    4
    5 # FastAPI 앱 생성 (이것이 핵심!)
    6 app = FastAPI()
    7
    8 # 미들웨어 설정...
    9
   10 # '/api/v1' 접두사를 붙여 라우터 묶음을 포함
   11 app.include_router(api_router, prefix="/api/v1")

  3. `server/app/api/v1/router.py` (라우터 묶음)
   * 이 파일은 auth, survey 등 개별 API 라우터들을 모두 모아서 api_router라는 하나의 큰 라우터로 묶는 역할을 합니다.

   1 # 현재 server/app/api/v1/router.py
   2 from fastapi import APIRouter
   3 from .endpoints import auth, survey, ocr, user_intake
   4
   5 api_router = APIRouter()
   6 api_router.include_router(auth.router, ...)
   7 api_router.include_router(survey.router, ...)
   8 # ...

  요약: main_app은 왜 app이 되었나?

  이전의 main_app은 단순히 sub_app을 감싸서 경로(api/v1)를 붙여주는 역할만 했습니다. 새 구조에서는 app/main.py에서 app.include_router(api_router,  
  prefix="/api/v1") 코드를 통해 이 역할을 직접 수행할 수 있으므로, 더 이상 main_app과 sub_app으로 나누는 복잡한 구조가 필요 없어졌습니다.

  그래서 하나의 핵심 app만 남기고, 파일의 역할을 명확하게 분리하여 더 깔끔하고 확장하기 좋은 구조로 변경한 것입니다. 



  ### 주요 변경 사항 및 개선점

#### 1. 명확한 관심사의 분리 (Separation of Concerns)

기존에는 하나의 파일(`routers/auth.py`)에 API 정의, 데이터베이스 쿼리, 비밀번호 암호화, JWT 토큰 생성이 모두 섞여 있었습니다. 이제 각 기능은 전문화된 디렉토리로 분리되었습니다.

- **Before**:
  ```python
  # routers/auth.py (Old)
  @router.post("/login")
  def login(...):
      # DB 직접 조회
      user = db.query(models.User).filter(...).first()
      # 비밀번호 검증 로직
      verify_password(...)
      # JWT 토큰 생성 로직
      create_access_token(...)
      return {"token": ...}
  ```

- **After**:
  ```python
  # endpoints/auth.py (New)
  @router.post("/login")
  def login(...):
      # CRUD 계층 호출
      user = crud_user.get_user_by_email(...)
      # 보안 계층 호출
      security.verify_password(...)
      security.create_access_token(...)
      return {"token": ...}
  ```
  **[효과]**: `endpoints/auth.py`는 이제 HTTP 요청과 응답 처리라는 본연의 역할에만 집중합니다. 데이터베이스나 보안 로직이 변경되어도 API 코드 자체는 수정할 필요가 없어집니다.

#### 2. 계층형 아키텍처 도입

코드의 흐름이 `API -> Service/CRUD -> DB` 로 명확해졌습니다.

- **`crud` vs `services`**:
  - **`crud`**: "데이터베이스와 대화하는 방법"만 압니다. 순수하게 SQLAlchemy를 사용하여 데이터를 가져오고 저장하는 역할만 합니다. (예: `crud_user.get_user_by_email`)
  - **`services`**: "무엇을 할지" 결정합니다. 단순 CRUD를 넘어서는 비즈니스 규칙을 처리합니다. 예를 들어, OCR 서비스는 이미지 처리 후 `crud_product.search_products_by_text`를 호출하여 DB에서 제품을 찾는 작업을 수행합니다.

- **[효과]**:
  - **테스트 용이성**: `crud` 계층만 따로 떼어내 데이터베이스 연동을 테스트하거나, `services` 계층을 테스트할 때 실제 DB 대신 가짜 `crud` 객체를 주입하여 단위 테스트를 쉽게 작성할 수 있습니다.
  - **재사용성**: "이메일로 사용자 찾기" 기능(`crud_user.get_user_by_email`)이 여러 API 엔드포인트에서 필요할 경우, 중복된 쿼리 코드 없이 해당 함수를 호출하기만 하면 됩니다.

#### 3. 안전하고 중앙화된 설정 관리

- **Before**: DB 정보나 비밀 키가 코드에 흩어져 있거나, 각 파일에서 개별적으로 환경 변수를 읽었습니다.
- **After**: 모든 설정은 `server/.env` 파일에 정의되고, `app/core/config.py`의 `Settings` 클래스가 이를 모두 읽어들여 중앙에서 관리합니다. 다른 파일에서는 `from app.core.config import settings` 한 줄로 모든 설정 값을 안전하게 사용할 수 있습니다.

- **[효과]**: 개발, 테스트, 운영 환경별로 다른 `.env` 파일을 사용하여 설정을 쉽게 변경할 수 있으며, 민감한 정보가 코드에 노출되지 않아 보안이 향상됩니다.





  1. DB 연결 및 기본 구조 완성
  네, 데이터베이스 연결을 포함한 서버의 기본 구조 리팩토링은 성공적으로 완료되었습니다. 이제 서버는 체계적인 구조 위에서 안정적으로 실행될 준비가 되었습니다.   

  2. 향후 협업 및 개발 방식
  말씀하신 대로, 앞으로 새로운 기능을 추가할 때는 각각의 역할에 맞는 디렉토리에 `.py` 파일을 만들고 기능을 완성하며 협업하면 됩니다.

  예를 들어, "공지사항" 기능을 새로 추가하는 경우의 작업 흐름은 다음과 같습니다.

   1. `db/models/notice.py` 생성: Notice 테이블의 구조(제목, 내용, 작성일 등)를 SQLAlchemy 모델로 정의합니다.
   2. `schemas/notice.py` 생성: API가 요청받거나 응답으로 보낼 데이터의 형식(Pydantic 모델)을 정의합니다. (예: 공지사항 생성 시 받을 데이터, 목록으로 보낼      
      데이터 등)
   3. `crud/crud_notice.py` 생성: Notice 모델에 대한 기본적인 데이터베이스 작업(생성, 목록 조회, 상세 조회, 수정, 삭제) 함수들을 만듭니다. 이 파일은 순수하게   
      DB와 통신하는 역할만 합니다.
   4. `api/v1/endpoints/notice.py` 생성: 프론트엔드가 호출할 /api/v1/notices 와 같은 API 엔드포인트를 만듭니다. 이 엔드포인트는 crud_notice.py에 만든 함수들을  
      호출하여 클라이언트에게 결과를 반환합니다.
   5. `services/notice_service.py` 생성 (선택 사항): 만약 "공지사항을 작성하면 모든 사용자에게 이메일 알림을 보낸다"와 같이 단순 CRUD를 넘어서는 복잡한
      비즈니스 로직이 필요하다면, 이 서비스 파일에 로직을 작성합니다. 이 서비스는 내부적으로 crud_notice와 email_service를 함께 호출할 수 있습니다.

  이처럼 역할을 명확히 분리했기 때문에, 팀원들이 각자 다른 파일(계층)을 맡아 동시에 작업하기 매우 용이해졌습니다. 예를 들어, 한 명은 API 엔드포인트를 개발하고  
  다른 한 명은 데이터베이스 CRUD 로직을 개발하는 방식의 협업이 가능합니다.

  하나의 기능이 여러 개의 복잡한 비즈니스 로직으로 나뉠 때 유용합니다.

  예를 들어, "추천" 기능이 점점 고도화되어 여러 서비스 파일로 분리된다고 가정해 보겠습니다.

  초기 구조 (파일만 있는 경우):

   1 services/
   2 ├── __init__.py
   3 ├── ocr_service.py
   4 ├── email_service.py
   5 ├── recommendation_scoring_service.py   # 추천 점수 계산
   6 ├── recommendation_filtering_service.py # 추천 결과 필터링
   7 └── recommendation_caching_service.py   # 추천 결과 캐싱                                                                                                  █

  프로젝트가 커지면 services 폴더에 파일이 너무 많아져서 관련 파일을 찾기 어려워집니다.

  폴더로 구조화한 경우:

  이때 recommendations 라는 하위 폴더를 만들어 관련된 서비스들을 묶어줄 수 있습니다.

   1 services/
   2 ├── __init__.py
   3 ├── ocr_service.py
   4 ├── email_service.py
   5 └── recommendations/                # <--- 추천 관련 서비스들을 위한 폴더
   6     ├── __init__.py                 # <--- 폴더를 패키지로 만들기 위해 필수!
   7     ├── scoring_service.py
   8     ├── filtering_service.py
   9     └── caching_service.py

  장점:

   * 관련 코드 집중: 추천과 관련된 모든 비즈니스 로직이 recommendations 폴더 안에 모여있어 코드를 찾고 이해하기 쉽습니다.
   * 유지보수 용이: 특정 기능에 대한 수정이 필요할 때 해당 폴더만 집중해서 보면 되므로 유지보수가 편리해집니다.
   * 확장성: 나중에 결제 기능이 추가된다면 services/payments/ 폴더를 새로 만드는 식으로 체계적인 확장이 가능합니다.

  규칙:                                                                                                                                                        █

  처음에는 services 아래에 바로 .py 파일을 만들다가, 특정 기능에 관련된 파일이 2~3개 이상으로 늘어나면 그 때 폴더로 묶어주는 방식을 추천합니다.
