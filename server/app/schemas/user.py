from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

# --- User (사용자) 스키마 ---

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

# API 응답으로 보낼 사용자 정보 (개인정보 포함)
class User(UserBase):
    user_id: int # id -> user_id로 변경
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True # ORM 모델과 자동으로 매핑
