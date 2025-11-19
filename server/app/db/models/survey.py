from sqlalchemy import (
    Column, Integer, String, Float, ForeignKey,
    DATETIME, CHAR
)
from sqlalchemy.sql import func
from app.core.database import Base # 경로 수정

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
