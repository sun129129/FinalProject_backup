from sqlalchemy.orm import Session, joinedload
from typing import List
from fastapi import HTTPException, status

from app.db.models.product import Product
from app.db.models.user_supplement import UserSupplement
from app.schemas.user_supplement import UserSupplementCreate

def get_user_supplements(db: Session, user_id: int) -> List[UserSupplement]:
    """
    특정 사용자의 모든 복용 영양제 기록을 제품 정보와 함께 조회합니다.
    """
    return db.query(UserSupplement).options(
        joinedload(UserSupplement.product)
    ).filter(UserSupplement.user_id == user_id).order_by(UserSupplement.add_at.desc()).all()

def create_user_supplement(db: Session, user_id: int, supplement: UserSupplementCreate) -> UserSupplement:
    """
    사용자의 새로운 복용 영양제 기록을 생성합니다.
    """
    # 제품 존재 여부 확인
    product = db.query(Product).filter(Product.PRDLST_REPORT_NO == supplement.prdlst_report_no).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="해당 제품을 찾을 수 없습니다.")

    # 이미 존재하는지 확인
    db_supplement = db.query(UserSupplement).filter(
        UserSupplement.user_id == user_id,
        UserSupplement.prdlst_report_no == supplement.prdlst_report_no
    ).first()

    if db_supplement:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="이미 등록된 영양제입니다.")

    db_supplement = UserSupplement(
        user_id=user_id,
        prdlst_report_no=supplement.prdlst_report_no,
        source=supplement.source
    )
    db.add(db_supplement)
    db.commit()
    db.refresh(db_supplement)
    
    # 관계형 모델(product)을 로드하기 위해 다시 조회
    result = db.query(UserSupplement).options(joinedload(UserSupplement.product)).filter(
        UserSupplement.user_id == user_id,
        UserSupplement.prdlst_report_no == supplement.prdlst_report_no
    ).one()
    return result

def delete_user_supplement(db: Session, user_id: int, prdlst_report_no: str) -> UserSupplement:
    """
    사용자의 특정 복용 영양제 기록을 소유권 확인 후 삭제합니다.
    """
    db_supplement = db.query(UserSupplement).filter(
        UserSupplement.user_id == user_id,
        UserSupplement.prdlst_report_no == prdlst_report_no
    ).first()

    if not db_supplement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="삭제할 영양제 기록을 찾을 수 없습니다.")

    # user_id는 이미 쿼리에서 확인되었으므로 별도 소유권 체크는 필요없음
        
    db.delete(db_supplement)
    db.commit()
        
    return db_supplement
