# app/schemas/user.py
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

# --- User (사용자) 기본 스키마 ---
# 공통적으로 사용되는 필드 정의
class UserBase(BaseModel):
    user_email: EmailStr
    # min/max length 설정 아주 좋아!
    user_name: str = Field(..., min_length=2, max_length=100) 
    gender: str       # DB: VARCHAR(10) -> python: str (OK)
    birthdate: str    # DB: VARCHAR(10) -> python: str (OK)
    mobile_num: str = Field(..., min_length=10, max_length=15)

# --- 회원가입 요청 (Request) ---
# UserBase를 상속받고, 비밀번호만 추가
class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=20)

# --- 사용자 정보 응답 (Response) ---
# DB 데이터를 프론트로 보낼 때 사용
# 이름 변경: User -> UserResponse (모델과 겹치지 않게!)
class UserResponse(UserBase):
    user_id: int      # DB의 PK
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True # Pydantic v2 문법 (orm_mode 대체)