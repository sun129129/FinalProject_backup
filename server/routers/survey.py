# server/routers/survey.py

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional  # 👈 Optional 추가

import models
import schemas
from database import get_db
from .auth import get_current_user

router = APIRouter()


# ----------------------------------------------------------------------
# ❗️ [신규 API] '키워드' 목록 가져오기
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
# ❗️ [수정 API] '설문 질문' 목록 (선택된 것만) 가져오기
# ----------------------------------------------------------------------
# response_model을 QuestionWithKeyword로 변경 (schemas.py에 추가 필요)
@router.get("/questions", response_model=List[schemas.QuestionWithKeyword])
def get_survey_questions(
    # 'ids=1,2,3' 쿼리 파라미터를 '문자열'로 받음
    ids: Optional[str] = None, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    React에서 선택한 '키워드 ID' 목록(ids)에 해당하는
    '설문 질문' 목록만 'keyword_nm'과 JOIN하여 React에게 보냅니다.
    """
    if not ids:
        # ID가 없으면 빈 목록 반환
        return []

    # 콤마(,)로 구분된 문자열을 숫자 ID 목록 [1, 2, 3]으로 파싱
    try:
        keyword_ids = [int(id_str) for id_str in ids.split(',') if id_str.isdigit()]
    except ValueError:
        raise HTTPException(status_code=400, detail="유효하지 않은 ID 형식입니다.")
        
    if not keyword_ids:
        return []

    # ❗️ [쿼리 수정]
    # Survey와 Keyword 테이블을 JOIN
    # Survey.keyword_id가 keyword_ids 목록에 포함(in_)된 것만 필터링
    results = db.query(
        models.Survey,             # (Survey 모델 객체)
        models.Keyword.keyword_nm  # (Keyword 테이블의 이름)
    ).join(
        models.Keyword, models.Survey.keyword_id == models.Keyword.keyword_id
    ).filter(
        models.Survey.keyword_id.in_(keyword_ids) # ❗️ IN (...)
    ).order_by(
        models.Survey.keyword_id, models.Survey.question_id
    ).all()

    if not results:
        return []
        
    # ❗️ [반환 방식 수정]
    # (Survey, keyword_nm) 튜플을 -> QuestionWithKeyword 스키마로 매핑
    # (schemas.py에 Question 스키마를 상속받는 새 스키마 필요)
    questions_with_keyword = [
        schemas.QuestionWithKeyword(
            **question.__dict__, # Survey 객체의 모든 필드를 복사
            keyword_nm=keyword_name  # JOIN한 keyword_nm 추가
        ) for question, keyword_name in results
    ]
    
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
    current_user: models.User = Depends(get_current_user)
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
        models.ProductScore.survey_score.desc()
    ).all()
    
    if not scores:
        return []
    
    return scores