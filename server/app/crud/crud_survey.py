from sqlalchemy.orm import Session
from typing import List
from app.db.models.survey import Survey, SurveyKeyword, Keyword, SurveyResponse, ProductScore
from app.schemas.survey import AnswerSubmit, QuestionWithKeyword, ScoreResult

def get_questions_by_keyword_ids(db: Session, keyword_ids: List[int]) -> List[QuestionWithKeyword]:
    """
    키워드 ID 목록에 해당하는 설문 질문 목록을 조회합니다.
    """
    if not keyword_ids:
        return []

    results = db.query(
        Survey,
        Keyword.keyword_nm,
        SurveyKeyword.keyword_id
    ).join(
        SurveyKeyword, Survey.question_id == SurveyKeyword.question_id
    ).join(
        Keyword, SurveyKeyword.keyword_id == Keyword.keyword_id
    ).filter(
        SurveyKeyword.keyword_id.in_(keyword_ids)
    ).order_by(
        SurveyKeyword.keyword_id, Survey.question_id
    ).all()

    if not results:
        return []

    questions_with_keyword = [
        QuestionWithKeyword(
            question_id=q.question_id,
            question=q.question,
            question_category=q.question_category,
            keyword_id=kid,
            keyword_nm=kn
        ) for q, kn, kid in results
    ]
    return questions_with_keyword

def submit_answers(db: Session, user_id: int, answers: List[AnswerSubmit]):
    """
    사용자의 설문 답변을 저장합니다. (기존 답변 삭제 후 새로 추가)
    """
    db.query(SurveyResponse).filter(
        SurveyResponse.user_id == user_id
    ).delete()
    
    new_responses = [
        SurveyResponse(
            user_id=user_id,
            question_id=answer.question_id,
            answer=answer.answer
        ) for answer in answers
    ]
    
    db.add_all(new_responses)
    db.commit()

def get_results(db: Session, user_id: int) -> List[ScoreResult]:
    """
    사용자의 설문 분석 결과를 조회합니다.
    """
    scores = db.query(
        ProductScore.keyword_id,
        Keyword.keyword_nm,
        ProductScore.survey_score
    ).join(
        Keyword, ProductScore.keyword_id == Keyword.keyword_id
    ).filter(
        ProductScore.user_id == user_id
    ).order_by(
        ProductScore.survey_score.desc()
    ).all()
    
    if not scores:
        return []
        
    return [
        ScoreResult(
            keyword_id=kid,
            keyword_nm=knm,
            survey_score=score
        ) for kid, knm, score in scores
    ]
