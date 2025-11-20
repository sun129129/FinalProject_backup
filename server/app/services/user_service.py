# app/services/user_service.py

from sqlalchemy.orm import Session
from app.db.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash

# 이메일로 유저 찾기
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.user_email == email).first()

# 유저 생성하기
def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    
    db_user = User(
        user_email=user.user_email,
        hashed_password=hashed_password,
        user_name=user.user_name,
        gender=user.gender,
        birthdate=user.birthdate,
        mobile_num=user.mobile_num,
        is_active=True
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user