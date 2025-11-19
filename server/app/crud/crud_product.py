from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from typing import List
from fastapi import HTTPException, status

from app.db.models.product import Product, UserIntake
from app.schemas.product import UserIntakeCreate

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

def get_user_intakes(db: Session, user_id: int) -> List[UserIntake]:
    """
    특정 사용자의 모든 섭취 기록을 제품 정보와 함께 조회합니다. (N+1 방지)
    """
    return db.query(UserIntake).options(
        joinedload(UserIntake.product)
    ).filter(UserIntake.user_id == user_id).order_by(UserIntake.created_at.desc()).all()

def create_user_intake(db: Session, user_id: int, intake: UserIntakeCreate) -> UserIntake:
    """
    사용자의 새로운 섭취 기록을 생성합니다. 제품 존재 여부를 확인합니다.
    """
    product = db.query(Product).filter(Product.PRDLST_REPORT_NO == intake.prdlst_report_no).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="해당 제품을 찾을 수 없습니다.")

    db_intake = UserIntake(
        user_id=user_id,
        prdlst_report_no=intake.prdlst_report_no
    )
    db.add(db_intake)
    db.commit()
    db.refresh(db_intake)
    
    # 관계형 모델(product)을 로드하기 위해 다시 조회
    result = db.query(UserIntake).options(joinedload(UserIntake.product)).filter(UserIntake.intake_id == db_intake.intake_id).one()
    return result

def delete_user_intake(db: Session, user_id: int, intake_id: int) -> UserIntake:
    """
    사용자의 특정 섭취 기록을 소유권 확인 후 삭제합니다.
    """
    db_intake = db.query(UserIntake).filter(
        UserIntake.intake_id == intake_id
    ).first()

    if not db_intake:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="삭제할 섭취 기록을 찾을 수 없습니다.")

    if db_intake.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="다른 사용자의 기록을 삭제할 권한이 없습니다.")
        
    db.delete(db_intake)
    db.commit()
        
    return db_intake
