# 1. 베이스 이미지 선택 (경량화된 slim 버전 사용)
FROM python:3.10-slim

# Tesseract OCR 및 한국어 데이터 설치
RUN apt-get update && apt-get install -y tesseract-ocr tesseract-ocr-kor && apt-get clean && rm -rf /var/lib/apt/lists/*

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 의존성 파일 복사 및 설치
# --no-cache-dir 옵션으로 불필요한 캐시를 남기지 않아 이미지 크기를 줄입니다.
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. 소스코드 복사
COPY . .

# 5. 서버가 사용할 포트 지정
EXPOSE 8000

# 6. 서버 실행 명령어
# 0.0.0.0 호스트를 사용해야 컨테이너 외부에서 접근 가능합니다.
CMD ["uvicorn", "main:main_app", "--host", "0.0.0.0", "--port", "8000"]
