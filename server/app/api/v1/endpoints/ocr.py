from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas import product as product_schema
from app.services import ocr_service
from app.crud import crud_product

router = APIRouter()

@router.post("/upload", response_model=List[product_schema.ProductSchema])
async def upload_and_ocr(
    file: UploadFile = File(...), 
    db: Session = Depends(deps.get_db)
):
    """
    이미지를 업로드하여 OCR로 텍스트를 추출하고,
    추출된 텍스트를 기반으로 데이터베이스에서 제품을 검색하여 상위 3개를 반환합니다.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="이미지 파일만 업로드할 수 있습니다.")

    try:
        contents = await file.read()
        
        # 1. OCR 서비스 호출
        extracted_text = await ocr_service.extract_text_from_image(contents)

        if not extracted_text.strip():
            raise HTTPException(status_code=404, detail="이미지에서 텍스트를 추출할 수 없습니다.")

        # 2. Product CRUD 서비스 호출
        found_products = crud_product.search_products_by_text(db, text=extracted_text, limit=3)

        if not found_products:
            raise HTTPException(status_code=404, detail=f"'{extracted_text}'와 일치하는 제품을 찾을 수 없습니다.")

        return found_products

    except HTTPException as e:
        raise e
    except Exception as e:
        # 실제 운영 환경에서는 로깅(logging)을 통해 에러를 기록하는 것이 좋습니다.
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=f"서버에서 오류가 발생했습니다: {e}")
