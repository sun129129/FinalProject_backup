from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas import product as product_schema
from app.db.models import user as user_model
from app.crud import crud_product

router = APIRouter()

@router.post("/", response_model=product_schema.UserIntakeSchema, status_code=status.HTTP_201_CREATED)
def create_user_intake(
    intake_data: product_schema.UserIntakeCreate,
    db: Session = Depends(deps.get_db),
    current_user: user_model.User = Depends(deps.get_current_user)
):
    """
    현재 로그인된 사용자의 영양제 섭취 기록을 추가합니다.
    """
    return crud_product.create_user_intake(db=db, user_id=current_user.user_id, intake=intake_data)

@router.get("/", response_model=List[product_schema.UserIntakeSchema])
def get_user_intakes(
    db: Session = Depends(deps.get_db),
    current_user: user_model.User = Depends(deps.get_current_user)
):
    """
    현재 로그인된 사용자의 모든 영양제 섭취 기록을 조회합니다.
    """
    return crud_product.get_user_intakes(db=db, user_id=current_user.user_id)

@router.delete("/{intake_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_intake(
    intake_id: int,
    db: Session = Depends(deps.get_db),
    current_user: user_model.User = Depends(deps.get_current_user)
):
    """
    특정 섭취 기록을 삭제합니다.
    """
    crud_product.delete_user_intake(db=db, user_id=current_user.user_id, intake_id=intake_id)
    return
