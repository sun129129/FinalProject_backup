from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from typing import List
from fastapi import HTTPException, status

from app.db.models.product import Product

def search_products_by_text(db: Session, text: str, limit: int = 20) -> List[Product]:
    """
    [개발자 안내] 제품 데이터베이스 검색 함수
    
    데이터베이스의 '제품' 테이블에서 특정 텍스트를 포함하는 제품을 검색합니다.
    현재는 제품명(PRDLST_NM) 필드만을 기준으로 검색합니다.

    Args:
        db (Session): SQLAlchemy 데이터베이스 세션.
        text (str): 검색할 텍스트 (예: '밀크씨슬').
        limit (int): 반환할 최대 제품 수.
        
    Returns:
        List[Product]: 검색 조건에 맞는 제품 객체 리스트.
        
    [향후 개선 방향]
    - 검색 필드 확장: `PRIMARY_FNCLTY` (주요 기능성) 등 다른 필드에서도 검색하도록 확장할 수 있습니다.
    - 검색어 분리 및 복합 검색: 입력된 검색어를 여러 단어로 분리하여 각 단어가 포함된 제품을 찾도록 개선할 수 있습니다.
    - 페이지네이션: 검색 결과가 많을 경우를 대비하여 offset, limit을 이용한 페이지네이션 기능을 추가할 수 있습니다.
    - 정렬 및 필터링: 검색 결과에 대한 정렬(예: 인기순, 최신순)이나 추가 필터링 기능을 구현할 수 있습니다.
    """
    if not text.strip():
        return []

    search_term = f"%{text}%"
    found_products = db.query(Product).filter(Product.PRDLST_NM.like(search_term)).limit(limit).all()
    return found_products
