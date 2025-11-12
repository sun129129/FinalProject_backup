# server/schemas.py

from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from typing import Literal, Optional, List

# --- 1. User (사용자) 스키마 ---

# DB 모델의 필드명과 일치하도록 수정한 기본 스키마
class UserBase(BaseModel):
    user_email: EmailStr
    user_name: str = Field(..., min_length=2, max_length=100)
    gender: str # DB가 VARCHAR(10)이므로 str로 변경
    birthdate: str # DB가 VARCHAR(10)이므로 str로 변경
    mobile_num: str = Field(..., min_length=10, max_length=15) # 새로 추가된 전화번호

# 회원가입 시 받을 데이터 (UserBase 상속)
class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=20)
    verification_code: Optional[str] = Field(default=None, min_length=6, max_length=6)

# API 응답으로 보낼 사용자 정보 (개인정보 포함)
class User(UserBase):
    user_id: int # id -> user_id로 변경
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True # ORM 모델과 자동으로 매핑

# --- 2. Token (로그인 토큰) 및 기타 스키마 ---
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User # 로그인 시 사용자 정보도 함께 반환하도록 추가

class EmailRequest(BaseModel):
    email: EmailStr

class FindIdRequest(BaseModel):
    user_name: str
    birthdate: str


# --- 3. Survey (설문) 스키마 ---

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