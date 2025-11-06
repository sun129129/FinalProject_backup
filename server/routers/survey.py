# server/routers/survey.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List


import models
import schemas
from database import get_db
from .auth import get_current_user # 1. '경비원' 함수 import!

# 2. 'survey' 부서를 위한 라우터(APIRouter) '간판' 생성
router = APIRouter()


# --- API 1: '설문 질문' 목록 가져오기 ---
@router.get("/questions", response_model=List[schemas.Question])
def get_survey_questions(
    db: Session = Depends(get_db),
    # 3. [보호!] '경비원'을 통과해야만(로그인해야만) 이 함수가 실행됨
    current_user: models.User = Depends(get_current_user) 
):
    """
    DB에 저장된 '모든' 설문 질문 목록을 React에게 보냅니다.
    (예: 1. 피부가 건조한 편이다, 2. 눈이 침침하다, ...)
    """
    questions = db.query(models.Survey).all()
    if not questions:
        # (DB에 아직 질문을 안 넣었을 경우)
        raise HTTPException(status_code=404, detail="설문 질문이 없습니다.")
    return questions


# --- API 2: '설문 답변' 제출하기 (LLM을 위한 '날것' 저장) ---
@router.post("/submit")
def submit_survey_answers(
    answers: List[schemas.AnswerSubmit], # 4. React가 보낸 '답변 목록'
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user) # '경비원'
):
    """
    React에서 받은 O/X 답변 목록을 'survey_response' 테이블에 
    '날것' 그대로 저장합니다. (점수 계산 X)
    """
    
    # 5. (중요!) 이 사용자가 '이미' 제출한 응답이 있으면 싹 지운다 (덮어쓰기)
    db.query(models.SurveyResponse).filter(
        models.SurveyResponse.user_id == current_user.id
    ).delete()
    
    # 6. React가 보낸 답변들을 'survey_response' 테이블에 저장
    new_responses = []
    for answer in answers:
        db_answer = models.SurveyResponse(
            user_id=current_user.id,
            question_id=answer.question_id,
            answer=answer.answer # (O=1, X=0)
        )
        new_responses.append(db_answer)
    
    db.add_all(new_responses) # 7. 답변 목록을 '한번에' DB에 추가
    db.commit() # 8. '최종 저장'
    
    return {"message": "Survey submitted successfully. Awaiting analysis."}


# --- API 3: '설문 결과' (LLM 분석 점수) 가져오기 ---
@router.get("/results", response_model=List[schemas.ScoreResult])
def get_survey_results(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user) # '경비원'
):
    """
    'product_score' 테이블에서 (LLM이 분석한) '로그인한 유저'의
    '키워드별 점수'를 가져옵니다.
    """
    
    # 9. 'product_score'와 'keyword' 테이블을 JOIN
    scores = db.query(
        models.ProductScore.keyword_id,
        models.Keyword.keyword_nm, # (keyword 테이블에서 이름 가져오기)
        models.ProductScore.survey_score
    ).join(
        models.Keyword, models.ProductScore.keyword_id == models.Keyword.keyword_id
    ).filter(
        models.ProductScore.user_id == current_user.id
    ).order_by(
        models.ProductScore.survey_score.desc() # 점수 높은 순
    ).all()
    
    if not scores:
        # (아직 LLM이 분석을 안 했거나, 결과가 없을 경우)
        return [] # 빈 목록 반환
    
    return scores