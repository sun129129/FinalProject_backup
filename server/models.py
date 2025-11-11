# server/models.py

from sqlalchemy import (
    Column, Integer, String, Boolean, Enum, TIMESTAMP, Float, ForeignKey,
    DATETIME, CHAR
)
from sqlalchemy.sql import func
from database import Base

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

# '인증 코드' 임시 저장 테이블
class VerificationCode(Base):
    __tablename__ = "verification_codes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), nullable=False)
    code = Column(String(6), nullable=False)
    purpose = Column(Enum('signup', 'password_reset', name='purpose_enum'), nullable=False)
    expires_at = Column(TIMESTAMP, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

# '설문' (질문 목록)
class Survey(Base):
    __tablename__ = "survey"
    question_id = Column(Integer, primary_key=True, autoincrement=True)
    question = Column(String(255), nullable=False)
    question_category = Column(CHAR(2), nullable=False) # 질문 카테고리 필드 추가

# '키워드' (카테고리)
class Keyword(Base):
    __tablename__ = "keyword"
    keyword_id = Column(Integer, primary_key=True, autoincrement=True)
    keyword_nm = Column(String(100), nullable=False)

# '설문_키워드' (매핑)
class SurveyKeyword(Base):
    __tablename__ = "survey_keyword"
    question_id = Column(Integer, ForeignKey("survey.question_id"), primary_key=True)
    keyword_id = Column(Integer, ForeignKey("keyword.keyword_id"), primary_key=True)

# '설문 응답'
class SurveyResponse(Base):
    __tablename__ = "survey_response"
    response_id = Column(Integer, primary_key=True, autoincrement=True)
    question_id = Column(Integer, ForeignKey("survey.question_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False) # 외래 키 변경
    answer = Column(Integer, nullable=False)
    created_at = Column(DATETIME, nullable=False, server_default=func.now())

# '제품 점수'
class ProductScore(Base):
    __tablename__ = "product_score"
    user_id = Column(Integer, ForeignKey("users.user_id"), primary_key=True) # 외래 키 변경
    keyword_id = Column(Integer, ForeignKey("keyword.keyword_id"), primary_key=True)
    survey_score = Column(Float, default=None)
    card_score = Column(Float, default=None)
