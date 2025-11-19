from pydantic import BaseModel

# --- Survey (설문) 스키마 ---

# 'keyword' 테이블 스키마
class Keyword(BaseModel):
    keyword_id: int
    keyword_nm: str

    class Config:
        from_attributes = True

# 'survey' 테이블(질문)의 기본 스키마 (DB 모델과 일치하도록 수정)
class Question(BaseModel):
    question_id: int
    question: str
    question_category: str # question_category 필드 추가

    class Config:
        from_attributes = True

# 'Survey'와 'Keyword'를 JOIN한 결과를 위한 스키마 (기존 구조 유지)
class QuestionWithKeyword(Question):
    keyword_id: int
    keyword_nm: str

# React가 답변 제출 시 사용할 스키마
class AnswerSubmit(BaseModel):
    question_id: int
    answer: int

# 최종 분석 결과 스키마
class ScoreResult(BaseModel):
    keyword_id: int
    keyword_nm: str
    survey_score: float

    class Config:
        from_attributes = True
