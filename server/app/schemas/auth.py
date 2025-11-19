from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from .user import User # user 스키마 import

# --- Token (로그인 토큰) 및 인증 관련 스키마 ---
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User # 로그인 시 사용자 정보도 함께 반환하도록 추가

class EmailRequest(BaseModel):
    email: EmailStr

class VerificationCodeRequest(EmailRequest):
    verification_code: str = Field(..., min_length=6, max_length=6)

class FindIdRequest(BaseModel):
    user_name: str
    birthdate: str

class FindPasswordRequest(BaseModel):
    user_name: str
    birthdate: str
    user_email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    password: str
