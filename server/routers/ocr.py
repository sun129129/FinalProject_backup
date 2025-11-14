# server/routers/ocr.py

import io
import pytesseract
from PIL import Image
from typing import List

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.concurrency import run_in_threadpool # run_in_threadpool 임포트
from sqlalchemy.orm import Session
from sqlalchemy import or_

from database import get_db
import models
import schemas

# Docker 환경에서는 Tesseract가 시스템 경로에 설치되므로,
# 별도의 경로 지정이 필요 없습니다.
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

router = APIRouter(
    tags=["ocr"],
)

def clean_text(text: str) -> str:
    """OCR로 추출된 텍스트에서 불필요한 공백과 줄바꿈을 제거합니다."""
    return " ".join(text.replace("\n", " ").split())

@router.post("/upload", response_model=List[schemas.ProductSchema])
async def upload_and_ocr(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    이미지를 업로드하여 OCR로 텍스트를 추출하고,
    추출된 텍스트를 기반으로 데이터베이스에서 제품을 검색하여 상위 3개를 반환합니다.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="이미지 파일만 업로드할 수 있습니다.")

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        # OCR 실행 (한글+영어) - CPU를 많이 사용하는 작업을 별도 스레드에서 실행 (lambda 사용)
        extracted_text = await run_in_threadpool(lambda: pytesseract.image_to_string(image, lang='kor+eng'))
        cleaned_text = clean_text(extracted_text)

        if not cleaned_text.strip():
            raise HTTPException(status_code=404, detail="이미지에서 텍스트를 추출할 수 없습니다.")

        # 검색어 생성 (공백으로 단어 분리)
        search_words = cleaned_text.split()
        if not search_words:
            raise HTTPException(status_code=404, detail="검색할 키워드를 찾을 수 없습니다.")

        # 각 단어가 제품명 또는 기능성에 포함되는 경우를 모두 검색 (OR 조건)
        # 검색어 필터를 동적으로 생성
        search_filters = []
        for word in search_words:
            search_filters.append(models.Product.PRDLST_NM.like(f"%{word}%"))
            search_filters.append(models.Product.PRIMARY_FNCLTY.like(f"%{word}%"))
        
        # 검색 실행
        # TODO: 향후 더 정교한 검색 로직(예: Full-text search)으로 개선 가능
        found_products = db.query(models.Product).filter(or_(*search_filters)).limit(3).all()

        if not found_products:
            raise HTTPException(status_code=404, detail=f"'{cleaned_text}'와 일치하는 제품을 찾을 수 없습니다.")

        return found_products

    except HTTPException as e:
        # 이미 발생한 HTTPException은 그대로 전달
        raise e
    except Exception as e:
        # Tesseract 오류 또는 기타 예외 처리
        # 실제 운영 환경에서는 로깅(logging)을 통해 에러를 기록하는 것이 좋습니다.
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=f"서버에서 오류가 발생했습니다: {e}")
