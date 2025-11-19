from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas import user_supplement as user_supplement_schema
from app.db.models import user as user_model
from app.crud import crud_user_supplement

router = APIRouter()

@router.post("/", response_model=user_supplement_schema.UserSupplementSchema, status_code=status.HTTP_201_CREATED)
def create_user_supplement(
    supplement_data: user_supplement_schema.UserSupplementCreate,
    db: Session = Depends(deps.get_db),
    current_user: user_model.User = Depends(deps.get_current_user)
):
    """
    현재 로그인된 사용자의 복용 영양제를 추가합니다.
    - **prdlst_report_no**: 제품 보고 번호
    - **source**: 추가 출처 (e.g., "ocr", "manual")
    """
    return crud_user_supplement.create_user_supplement(db=db, user_id=current_user.user_id, supplement=supplement_data)

@router.get("/", response_model=List[user_supplement_schema.UserSupplementSchema])
def get_user_supplements(
    db: Session = Depends(deps.get_db),
    current_user: user_model.User = Depends(deps.get_current_user)
):
    """
    현재 로그인된 사용자의 모든 복용 영양제 기록을 조회합니다.
    """
    return crud_user_supplement.get_user_supplements(db=db, user_id=current_user.user_id)

@router.delete("/{prdlst_report_no}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_supplement(
    prdlst_report_no: str,
    db: Session = Depends(deps.get_db),
    current_user: user_model.User = Depends(deps.get_current_user)
):
    """
    특정 복용 영양제 기록을 삭제합니다.
    """
    crud_user_supplement.delete_user_supplement(db=db, user_id=current_user.user_id, prdlst_report_no=prdlst_report_no)
    return
