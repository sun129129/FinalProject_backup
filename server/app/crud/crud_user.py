from sqlalchemy.orm import Session
from app.db.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash

def get_user_by_email(db: Session, email: str) -> User:
    """
    이메일로 사용자를 조회합니다.
    """
    return db.query(User).filter(User.user_email == email).first()

def get_user_by_name_and_birthdate(db: Session, name: str, birthdate: str) -> User:
    """
    이름과 생년월일로 사용자를 조회합니다.
    """
    return db.query(User).filter(User.user_name == name, User.birthdate == birthdate).first()

def create_user(db: Session, user: UserCreate) -> User:
    """
    새로운 사용자를 생성합니다.
    """
    hashed_password = get_password_hash(user.password)
    db_user = User(
        user_email=user.user_email,
        user_name=user.user_name,
        gender=user.gender,
        birthdate=user.birthdate,
        mobile_num=user.mobile_num,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
