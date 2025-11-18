# server/main.py
from fastapi import FastAPI
from routers import auth, survey
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models

# --- App & Middleware Setup ---

# 1. Create the main app instance
main_app = FastAPI()

# 2. Add CORS middleware to the main app
main_app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Create the sub-app for API versioning
sub_app = FastAPI()

# --- Database & Router Setup ---

# Create database tables on startup
Base.metadata.create_all(bind=engine)

# Add routers to the sub_app
sub_app.include_router(auth.router, prefix="/auth", tags=["Auth"])
sub_app.include_router(survey.router, prefix="/survey", tags=["Survey"])

# Mount the sub_app under /api/v1
main_app.mount("/api/v1", sub_app)

# --- Root Endpoints ---

@sub_app.get("/")
def read_api_root():
    return {"message": "WonCare API v1"}

@main_app.get("/")
def read_server_root():
    return {"message": "안녕하세요! WonCare 서버입니다."}

# FastAPI 실행은 uvicorn main:main_app --reload 와 같이 main_app을 대상으로 해야 합니다.