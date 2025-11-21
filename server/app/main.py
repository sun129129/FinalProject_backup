from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
# from app.core.database import engine, Base

# # 데이터베이스 테이블을 생성합니다.
# # Alembic과 같은 마이그레이션 도구를 사용하는 경우, 아래 라인은 주석 처리하거나 삭제하는 것이 좋습니다.
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:8080", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to WonCare API"}


app.include_router(api_router, prefix=settings.API_V1_STR)