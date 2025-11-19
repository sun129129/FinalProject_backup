from sqlalchemy import (
    Column, Integer, String, Boolean, Enum, TIMESTAMP,
    DATETIME, CHAR
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base  # 경로 수정

# 'users' 테이블을 새로운 스키마에 맞게 정의
class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    user_name = Column(String(100), nullable=False)
    user_email = Column(String(255), nullable=False, unique=True)
    hashed_password = Column(String(255), nullable=False)
    gender = Column(String(10), nullable=False)
    birthdate = Column(String(10), nullable=False)
    mobile_num = Column(String(15), nullable=False) # 전화번호 필드 추가
    created_at = Column(DATETIME, nullable=False, server_default=func.now())
    updated_at = Column(DATETIME, nullable=False, server_default=func.now(), onupdate=func.now())
    is_active = Column(Boolean, nullable=False, default=True) # TINYINT(1)은 Boolean으로 처리

    supplements = relationship("UserSupplement", back_populates="user")

# '인증 코드' 임시 저장 테이블
class VerificationCode(Base):
    __tablename__ = "verification_codes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), nullable=False)
    code = Column(String(6), nullable=False)
    purpose = Column(Enum('signup', 'password_reset', name='purpose_enum'), nullable=False)
    expires_at = Column(TIMESTAMP, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
