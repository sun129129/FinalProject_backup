# server/schemas.py

from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from typing import Literal, Optional, List # Optional 추가

# --- 1. User (사용자) 스키마 ---

# User의 '기본' 정보 (공통 필드)
class UserBase(BaseModel):
    email: EmailStr  
    name: str = Field(..., min_length=2, max_length=100)
    gender: Literal['male', 'female'] 
    birthdate: date  


# '회원가입' 시 React에서 받아야 할 데이터 (Request Body)
class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=20)
    # [수정!] '인증 코드'를 선택 사항(Optional)으로 변경하고 기본값을 None으로 설정
    verification_code: Optional[str] = Field(default=None, min_length=6, max_length=6)


# 'API 응답'으로 React에게 돌려줄 사용자 정보 (Response Model)
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


# 3. [추가!] '이메일 인증 요청' 시 받을 데이터 양식 (이게 빠졌었음!)
class EmailRequest(BaseModel):
    email: EmailStr

# --- 3. [추가!] Survey (설문) 스키마 ---

# API가 React에게 '질문 목록'을 보내줄 때 쓸 양식
# (GET /survey/questions)
class Question(BaseModel):
    question_id: int
    question: str

    class Config:
        from_attributes = True # DB 모델(models.Survey)을 이 양식으로 자동 변환


# React가 FastAPI에게 '답변 목록'을 보낼 때 쓸 양식
# (POST /survey/submit)
class AnswerSubmit(BaseModel):
    question_id: int
    answer: int  # (O=1, X=0)


# API가 React에게 '최종 분석 결과'를 보내줄 때 쓸 양식
# (GET /survey/results)
class ScoreResult(BaseModel):
    keyword_id: int
    keyword_nm: str   # (models.Keyword에서 JOIN으로 가져올 이름)
    survey_score: float

    class Config:
        from_attributes = True # DB 모델(models.ProductScore)을 이 양식으로 자동 변환