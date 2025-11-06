# server/main.py

from fastapi import FastAPI
from routers import auth
from fastapi.middleware.cors import CORSMiddleware # 1. [추가!] 'CORS' 미들웨어

from database import engine, Base
import models

# Create database tables
Base.metadata.create_all(bind=engine)

# (나중에 여기에 DB 연결 코드도 추가될 거야)

# 2. FastAPI 앱(우리의 '주방') 인스턴스 생성
app = FastAPI()

# 3. [핵심!] 'CORS' 허용 목록 추가
#    이 코드가 'OPTIONS' 확인 전화에 "OK!"라고 응답해 줌
app.add_middleware(
    CORSMiddleware,
    # 4. [수정!] 여기에 네 'React 앱' 주소를 적어야 함!
    #    (Vite 기본값은 5173, create-react-app은 3000)
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
    allow_credentials=True,     # (쿠키 등 자격 증명 허용)
    allow_methods=["*"],        # (GET, POST, OPTIONS 등 모든 방식 허용)
    allow_headers=["*"],        # (모든 HTTP 헤더 허용)
)




# 5. [핵심!] '인증팀'의 모든 API를 '로비'에 연결
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])

# 6. 서버가 켜졌는지 확인하는 '정문'
@app.get("/")
def read_root():
    return {"message": "안녕하세요! WonCare API v1 서버입니다! 🍳"}
