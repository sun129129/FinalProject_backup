# server/database.py

from pydantic_settings import BaseSettings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import DeclarativeBase

# 1. '.env' 파일에서 모든 설정을 읽어오는 '설정' 클래스
class Settings(BaseSettings):
    # .env 파일에서 읽어올 변수들
    database_url: str 
    secret_key: str  
    algorithm: str   
    access_token_expire_minutes: int 

# [추가!] 이메일(우체부) 설정
    mail_username: str
    mail_password: str
    mail_from: str
    mail_port: int
    mail_server: str
    mail_starttls: bool
    mail_ssl_tls: bool

    class Config:
        env_file = ".env" # 읽어올 파일 이름 (.env)

# 2. 설정 객체 생성 (이제 settings.database_url, settings.secret_key 처럼 사용 가능)
settings = Settings()

# 3. [핵심] DB 연결 '엔진' 만들기 (SQLAlchemy)
#    이 '엔진'이 DB와 연결되는 실제 통로야.
engine = create_engine(settings.database_url)

# 4. DB와 대화하는 '세션(창구)' 만들기
#    API 요청이 올 때마다 이 'SessionLocal'을 사용해서
#    DB와 대화할 수 있는 '일회용 창구'를 만들 거야.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 5. DB 모델(테이블)의 '부모' 클래스 만들기
#    나중에 models.py에서 만들 'User' 테이블이
#    이 'Base'를 상속받을 거야.
class Base(DeclarativeBase):
    pass

# 6. [제일 중요!] API 요청마다 DB 세션을 열고 닫는 함수 (의존성 주입)
def get_db():
    db = SessionLocal() # 1. API가 호출되면 DB '창구'를 연다
    try:
        yield db  # 2. API 함수에 'db' 세션을 전달한다
    finally:
        db.close() # 3. API 처리가 끝나면(성공/실패 상관없이) 창구를 닫는다