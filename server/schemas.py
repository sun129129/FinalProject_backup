# server/schemas.py

from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from typing import Literal, Optional, List

# --- 1. User (사용자) 스키마 ---

# (User 관련 스키마는 변경 없이 그대로 둡니다)
class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=2, max_length=100)
    gender: Literal['male', 'female']
    birthdate: date

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=20)
    verification_code: Optional[str] = Field(default=None, min_length=6, max_length=6)

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- 2. Token (로그인 토큰) 스키마 ---
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class EmailRequest(BaseModel):
    email: EmailStr

# ----------------------------------------------------------------------
# --- 3. Survey (설문) 스키마 (❗️여기부터 수정/추가) ---
# ----------------------------------------------------------------------

# ❗️ [신규] 'keyword' 테이블 자체의 스키마
# (GET /survey/keywords 응답용)

class Keyword(BaseModel):
    keyword_id: int
    keyword_nm: str

    class Config:
        from_attributes = True # (v1) orm_mode = True (v2)


# ❗️ [수정] 'survey' 테이블(질문)의 기본 스키마
# (DB의 survey 테이블을 나타냄)
class Question(BaseModel):
    question_id: int
    question: str
    keyword_id: int  # 👈 (중요) keyword 테이블과 연결하기 위한 FK 추가!

    class Config:
        from_attributes = True # DB 모델(models.Survey)을 자동 변환


# ❗️ [신규] 'Survey'와 'Keyword'를 JOIN한 결과를 위한 스키마
# (GET /survey/questions 응답용)
class QuestionWithKeyword(Question):
    # Question 스키마를 상속받고 (question_id, question, keyword_id)
    keyword_nm: str  # JOIN으로 가져온 '키워드 이름' 추가
    
    # Config는 부모(Question)의 것을 상속받음


# [기존] React가 답변 제출 시 사용할 스키마 (변경 없음)
# (POST /survey/submit 요청용)
class AnswerSubmit(BaseModel):
    question_id: int
    answer: int  # (O=2, △=1, X=0) 👈 0,1,2 사용으로 수정


# [기존] 최종 분석 결과 스키마 (변경 없음)
# (GET /survey/results 응답용)
class ScoreResult(BaseModel):
    keyword_id: int
    keyword_nm: str    # (models.Keyword에서 JOIN으로 가져올 이름)
    survey_score: float

    class Config:
        from_attributes = True # DB 모델(models.ProductScore)을 자동 변환


