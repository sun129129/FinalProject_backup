# server/main.py

from fastapi import FastAPI
from routers import auth
from routers import survey # 1. [추�?!] '?�문?�?survey)' import
from fastapi.middleware.cors import CORSMiddleware 

# 2. [?��? 추�???�? DB ?�결 �?모델 import
from database import engine, Base
import models

# 3. [?��? 추�???�? DB ?�이�??�동 ?�성 (개발??
#    (models.py???�의???�이�?�?DB???�는 ?�이블을 ?�성)
Base.metadata.create_all(bind=engine)


# 4. FastAPI ???�리??'주방') ?�스?�스 ?�성
app = FastAPI()

# 5. 'CORS' ?�용 목록
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 6. '?�증?�? ?�우???�결
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])

# 7. [추�?!] '?�문?�? ?�우???�결
app.include_router(survey.router, prefix="/api/v1/survey", tags=["Survey"])


# 8. ?�버 '?�문' (?��? 복구!)
@app.get("/api/v1/")
def read_root():
    return {"message": "안녕하세요??? WonCare API v1 ??서버입니다??"}

