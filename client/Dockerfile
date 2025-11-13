# --- STAGE 1: Build ---
# Node.js 18-alpine 이미지를 빌드 환경으로 사용 (alpine은 경량화 버전)
FROM node:18-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# pnpm 설치
RUN npm install -g pnpm

# package.json과 pnpm-lock.yaml 파일만 먼저 복사
# (파일 내용이 바뀔 때만 의존성을 새로 설치하여 빌드 캐시 효율 극대화)
COPY package.json pnpm-lock.yaml ./

# 의존성 설치
RUN pnpm install

# 나머지 소스코드 전체 복사
COPY . .

# React 앱 빌드
RUN pnpm run build


# --- STAGE 2: Production ---
# 경량 웹서버인 Nginx 이미지를 최종 운영 환경으로 사용
FROM nginx:stable-alpine

# 위에서 만든 nginx.conf 파일을 컨테이너의 Nginx 설정 폴더에 복사
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 단계(builder)에서 생성된 빌드 결과물(/app/dist)을
# Nginx의 기본 웹 루트 디렉토리(/usr/share/nginx/html)로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx가 사용하는 80번 포트를 외부에 노출
EXPOSE 80

# Nginx 서버 실행
CMD ["nginx", "-g", "daemon off;"]
