from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from typing import List
from fastapi import HTTPException, status

from app.db.models.product import Product

def search_products_by_text(db: Session, text: str, limit: int = 3) -> List[Product]:
    """
    추출된 텍스트의 단어들을 기반으로 제품명 또는 기능성에서 제품을 검색합니다.
    """
    search_words = text.split()
    if not search_words:
        return []

    search_filters = [or_(Product.PRDLST_NM.like(f"%{word}%"), Product.PRIMARY_FNCLTY.like(f"%{word}%")) for word in search_words]
    
    found_products = db.query(Product).filter(or_(*search_filters)).limit(limit).all()
    return found_products
