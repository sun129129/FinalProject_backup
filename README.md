## Github clone 후
.env 파일 추가

## 로컬환경

기본 세팅 -> venv 가상 환경 세팅

## BN(백엔드 서버 띄우기)
0. root 디렉토리로 이동
1. cd server
2. pip install -r requirements.txt
4. taskkill (필요시)
5. uvicorn main:app --reload

## FN(프론트엔드 서버 띄우기)
0. npm 설치(https://nodejs.org/ko/download)
1. cd client
2. (.venv) pip install npm
3. 환경: powershell / 위치: ~/client 내부에서 pnpm install
4. npm run dev


## docker 
1. docker desktop 켜기
2. finalproject_backup 파일에서
3. docker compose up --build -d

## down 
1. docker compose down


각 파일의 readme 한번씩 읽어보면 좋을 것 같습니다. 정리가 완전히 안되어 있긴 합니다.

