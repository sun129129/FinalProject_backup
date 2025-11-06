# server/models.py


#설문DB가져오기위해서
from sqlalchemy import Column, Integer, String, Boolean, Date, Enum, TIMESTAMP, Float, ForeignKey 

from sqlalchemy import Column, Integer, String, Boolean, Date, Enum, TIMESTAMP
from sqlalchemy.sql import func
from database import Base # 1. database.py에서 '부모' Base 클래스 가져오기

# 2. 'users' 테이블을 파이썬 클래스로 정의
#    (Base를 상속받음)
class User(Base):
    __tablename__ = "users" # 3. MySQL에 있는 실제 테이블 이름

    # 4. MySQL에서 만들었던 컬럼들을 그대로 정의
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), nullable=False, unique=True)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    
    # 'gender_enum'이라는 이름으로 ENUM 타입을 명시적으로 생성
    gender = Column(Enum('male', 'female', name='gender_enum'), nullable=False) 
    
    birthdate = Column(Date, nullable=False)
    
    is_active = Column(Boolean, nullable=False, default=True)
    
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # (나중에 '설문' 테이블을 만들면, 여기에 'relationship'을 추가해서 연결하게 됨)






    # server/models.py
# ... (User 클래스 밑에 추가) ...
from sqlalchemy import ForeignKey

# [추가!] '인증 코드' 임시 저장 테이블
class VerificationCode(Base):
    __tablename__ = "verification_codes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), nullable=False)
    code = Column(String(6), nullable=False)
    purpose = Column(Enum('signup', 'password_reset', name='purpose_enum'), nullable=False)
    expires_at = Column(TIMESTAMP, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())




# 설문 DB들
# ... (User, VerificationCode 클래스 밑에 추가) ...

# [추가!] 1. '설문' (질문 목록)
class Survey(Base):
    __tablename__ = "survey"
    question_id = Column(Integer, primary_key=True, autoincrement=True)
    question = Column(String(500), nullable=False)

# [추가!] 2. '키워드' (29개 카테고리)
class Keyword(Base):
    __tablename__ = "keyword"
    keyword_id = Column(Integer, primary_key=True, autoincrement=True)
    keyword_nm = Column(String(100), nullable=False, unique=True)

# [추가!] 3. '설문_키워드' (매핑)
class SurveyKeyword(Base):
    __tablename__ = "survey_keyword"
    question_id = Column(Integer, ForeignKey("survey.question_id"), primary_key=True)
    keyword_id = Column(Integer, ForeignKey("keyword.keyword_id"), primary_key=True)

# [추가!] 4. '설문 응답' (LLM이 분석할 '날것')
class SurveyResponse(Base):
    __tablename__ = "survey_response"
    response_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("survey.question_id"), nullable=False)
    answer = Column(Integer, nullable=False) # 1=O, 0=X
    created_at = Column(TIMESTAMP, server_default=func.now())

# [추가!] 5. '제품 점수' (LLM이 채울 '성적표')
class ProductScore(Base):
    __tablename__ = "product_score"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    keyword_id = Column(Integer, ForeignKey("keyword.keyword_id"), primary_key=True)
    survey_score = Column(Float, default=0.0)
    card_score = Column(Float, default=0.0)