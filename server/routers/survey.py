# server/routers/survey.py

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

import models
import schemas
from database import get_db
from .auth import get_current_user

router = APIRouter()


# ----------------------------------------------------------------------
# [변경 없음] '키워드' 목록 가져오기
# ----------------------------------------------------------------------
@router.get("/keywords", response_model=List[schemas.Keyword])
def get_keyword_list(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    'keyword' 테이블에 저장된 '모든' 키워드 목록을 React에게 보냅니다.
    (예: 1. 피로/활력, 2. 눈 건강, ...)
    """
    keywords = db.query(models.Keyword).order_by(models.Keyword.keyword_id).all()
    if not keywords:
        raise HTTPException(status_code=404, detail="키워드가 없습니다.")
    return keywords


# ----------------------------------------------------------------------
# ❗️ [수정!] '설문 질문' 목록 (다대다 관계 M:N 적용)
# ----------------------------------------------------------------------
@router.get("/questions", response_model=List[schemas.QuestionWithKeyword])
def get_survey_questions(
    ids: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    React에서 선택한 '키워드 ID' 목록(ids)에 해당하는
    '설문 질문' 목록만 (SurveyKeyword, Keyword) 테이블과 JOIN하여 React에게 보냅니다.
    """
    if not ids:
        return []

    try:
        keyword_ids = [int(id_str) for id_str in ids.split(',') if id_str.isdigit()]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid ID format in list.") # 👈 (에러 메시지 수정)

    if not keyword_ids:
        return []

    # ❗️ [쿼리 수정] Survey -> SurveyKeyword -> Keyword (M:N JOIN)
    results = db.query(
        models.Survey,             # (1) Survey 모델 (질문)
        models.Keyword.keyword_nm, # (2) Keyword 이름
        models.SurveyKeyword.keyword_id # (3) Keyword ID
    ).join(
        models.SurveyKeyword, models.Survey.question_id == models.SurveyKeyword.question_id
    ).join(
        models.Keyword, models.SurveyKeyword.keyword_id == models.Keyword.keyword_id
    ).filter(
        models.SurveyKeyword.keyword_id.in_(keyword_ids) # 👈 SurveyKeyword에서 필터링
    ).order_by(
        models.SurveyKeyword.keyword_id, models.Survey.question_id
    ).all()

    if not results:
        return []

    # ❗️ [반환 방식 수정] (튜플(q, kn, kid)을 스키마로 수동 매핑)
    # (이전 500 에러의 원인이었던 **.__dict__ 대신 수동 매핑 -> 안전함)
    questions_with_keyword = [
        schemas.QuestionWithKeyword(
            question_id=q.question_id,
            question=q.question,
            keyword_id=kid,
            keyword_nm=kn
        ) for q, kn, kid in results
    ]
    
    # (선택 사항) 만약 한 질문이 여러 키워드에 중복 매핑되어
    # "1번 질문(눈 건강)", "1번 질문(피로)" 처럼 중복으로 넘어가는 게 싫다면,
    # 여기서 `questions_with_keyword` 리스트의 `question_id`를 기준으로 중복을 제거할 수 있습니다.
    # (지금은 프론트엔드에 중복 없이 잘 나올 것으로 예상됩니다.)
    
    return questions_with_keyword


# ----------------------------------------------------------------------
# [변경 없음] '설문 답변' 제출하기
# ----------------------------------------------------------------------
@router.post("/submit")
def submit_survey_answers(
    answers: List[schemas.AnswerSubmit],
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    React에서 받은 O/△/X 답변 목록을 'survey_response' 테이블에 
    '날것' 그대로 저장합니다. (덮어쓰기)
    """
    
    db.query(models.SurveyResponse).filter(
        models.SurveyResponse.user_id == current_user.id
    ).delete()
    
    new_responses = []
    for answer in answers:
        db_answer = models.SurveyResponse(
            user_id=current_user.id,
            question_id=answer.question_id,
            answer=answer.answer # 0, 1, 2
        )
        new_responses.append(db_answer)
    
    db.add_all(new_responses)
    db.commit()
    
    return {"message": "Survey submitted successfully. Awaiting analysis."}


# ----------------------------------------------------------------------
# [변경 없음] '설문 결과' (LLM 분석 점수) 가져오기
# ----------------------------------------------------------------------
@router.get("/results", response_model=List[schemas.ScoreResult])
def get_survey_results(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user) # '경비원'
):
    """
    'product_score' 테이블에서 (LLM이 분석한) '로그인한 유저'의
    '키워드별 점수'를 가져옵니다.
    """
    
    scores = db.query(
        models.ProductScore.keyword_id,
        models.Keyword.keyword_nm,
        models.ProductScore.survey_score
    ).join(
        models.Keyword, models.ProductScore.keyword_id == models.Keyword.keyword_id
    ).filter(
        models.ProductScore.user_id == current_user.id
    ).order_by(
        models.ProductScore.survey_score.desc() # 점수 높은 순
    ).all()
    
    if not scores:
        return []
    
    return scores