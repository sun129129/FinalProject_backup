from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.api import deps
from app.schemas import survey as survey_schema
from app.db.models import user as user_model
from app.crud import crud_keyword, crud_survey

router = APIRouter()

@router.get("/keywords", response_model=List[survey_schema.Keyword])
def get_keyword_list(
    db: Session = Depends(deps.get_db),
    current_user: user_model.User = Depends(deps.get_current_user)
):
    """
    모든 키워드 목록을 반환합니다.
    """
    keywords = crud_keyword.get_keywords(db)
    if not keywords:
        raise HTTPException(status_code=404, detail="키워드가 없습니다.")
    return keywords

@router.get("/questions", response_model=List[survey_schema.QuestionWithKeyword])
def get_survey_questions(
    ids: Optional[str] = None,
    db: Session = Depends(deps.get_db),
    current_user: user_model.User = Depends(deps.get_current_user)
):
    """
    선택된 키워드 ID 목록에 해당하는 설문 질문 목록을 반환합니다.
    """
    if not ids:
        return []
    try:
        keyword_ids = [int(id_str) for id_str in ids.split(',') if id_str.isdigit()]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid ID format in list.")

    return crud_survey.get_questions_by_keyword_ids(db, keyword_ids=keyword_ids)

@router.post("/submit", status_code=200)
def submit_survey_answers(
    answers: List[survey_schema.AnswerSubmit],
    db: Session = Depends(deps.get_db),
    current_user: user_model.User = Depends(deps.get_current_user)
):
    """
    사용자의 설문 답변을 제출받아 저장합니다.
    """
    crud_survey.submit_answers(db, user_id=current_user.user_id, answers=answers)
    return {"message": "Survey submitted successfully. Awaiting analysis."}

@router.get("/results", response_model=List[survey_schema.ScoreResult])
def get_survey_results(
    db: Session = Depends(deps.get_db),
    current_user: user_model.User = Depends(deps.get_current_user)
):
    """
    로그인된 사용자의 설문 분석 결과를 반환합니다.
    """
    scores = crud_survey.get_results(db, user_id=current_user.user_id)
    return scores