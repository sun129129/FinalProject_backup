# server/main.py
from fastapi import FastAPI
from routers import auth, survey, ocr, user_intake
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models

# 1. API 로직을 담을 '하위 앱(sub_app)'을 만듭니다.
sub_app = FastAPI()

# 이제 모든 라우터와 미들웨어는 'sub_app'에 연결합니다.
sub_app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# prefix에서 '/api/v1' 부분을 제거했습니다.
sub_app.include_router(auth.router, prefix="/auth", tags=["Auth"])
sub_app.include_router(survey.router, prefix="/survey", tags=["Survey"])
sub_app.include_router(ocr.router, prefix="/ocr", tags=["OCR"])
sub_app.include_router(user_intake.router, prefix="/user-intake", tags=["User Intake"])


# 이 루트 경로는 이제 '/api/v1/'에 해당됩니다.
@sub_app.get("/")
def read_api_root():
    return {"message": "WonCare API v1"}

# 2. 전체를 감싸는 '메인 앱(main_app)'을 만듭니다.
main_app = FastAPI()

# DB 테이블 생성은 메인 앱 시작 시 한 번만 수행합니다.
Base.metadata.create_all(bind=engine)

# '/api/v1' 경로에 'sub_app' 전체를 탑재(mount)합니다.
main_app.mount("/api/v1", sub_app)

# 서버의 진짜 루트 경로 ('http://127.0.0.1:8000/')
@main_app.get("/")
def read_server_root():
    return {"message": "안녕하세요! WonCare 서버입니다."}

# FastAPI 실행은 uvicorn main:main_app --reload 와 같이 main_app을 대상으로 해야 합니다.