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
