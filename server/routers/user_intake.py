# server/routers/user_intake.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from database import get_db
import models
import schemas
from routers.auth import get_current_user

router = APIRouter(
    tags=["user_intake"],
)

@router.post("/", response_model=schemas.UserIntakeSchema, status_code=status.HTTP_201_CREATED)
def create_user_intake(
    intake_data: schemas.UserIntakeCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    현재 로그인된 사용자의 영양제 섭취 기록을 추가합니다.
    """
    # 제품이 실제로 존재하는지 확인
    product = db.query(models.Product).filter(models.Product.PRDLST_REPORT_NO == intake_data.prdlst_report_no).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="해당 제품을 찾을 수 없습니다.")

    db_intake = models.UserIntake(
        user_id=current_user.user_id,
        prdlst_report_no=intake_data.prdlst_report_no
    )
    db.add(db_intake)
    db.commit()
    db.refresh(db_intake)
    
    # 관계형 모델(product)을 로드하기 위해 다시 조회
    # 이렇게 해야 response_model이 product 정보를 포함할 수 있음
    result = db.query(models.UserIntake).options(joinedload(models.UserIntake.product)).filter(models.UserIntake.intake_id == db_intake.intake_id).one()

    return result

@router.get("/", response_model=List[schemas.UserIntakeSchema])
def get_user_intakes(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    현재 로그인된 사용자의 모든 영양제 섭취 기록을 조회합니다.
    각 기록에는 해당 제품의 상세 정보가 포함됩니다.
    """
    intakes = db.query(models.UserIntake).options(
        joinedload(models.UserIntake.product) # Product 정보를 함께 로드 (N+1 문제 방지)
    ).filter(models.UserIntake.user_id == current_user.user_id).order_by(models.UserIntake.created_at.desc()).all()
    
    return intakes

@router.delete("/{intake_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_intake(
    intake_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    특정 섭취 기록을 삭제합니다.
    """
    db_intake = db.query(models.UserIntake).filter(models.UserIntake.intake_id == intake_id).first()

    if not db_intake:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="삭제할 섭취 기록을 찾을 수 없습니다.")

    if db_intake.user_id != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="다른 사용자의 기록을 삭제할 권한이 없습니다.")

    db.delete(db_intake)
    db.commit()

    return
