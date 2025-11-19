from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from app.db.models.user import VerificationCode

def upsert_verification_code(db: Session, email: str, code: str, purpose: str) -> VerificationCode:
    """
    인증 코드를 저장하거나 업데이트합니다.
    """
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=5) # 5분 만료
    
    db_code = db.query(VerificationCode).filter(
        VerificationCode.email == email,
        VerificationCode.purpose == purpose
    ).first()
    
    if db_code:
        db_code.code = code
        db_code.expires_at = expires_at
    else:
        db_code = VerificationCode(
            email=email, code=code, purpose=purpose, expires_at=expires_at
        )
        db.add(db_code)
    
    db.commit()
    db.refresh(db_code)
    return db_code

def verify_code_and_get_email(db: Session, email: str, code: str, purpose: str) -> str | None:
    """
    인증 코드를 검증하고 이메일을 반환합니다.
    """
    db_code = db.query(VerificationCode).filter(
        VerificationCode.email == email,
        VerificationCode.code == code,
        VerificationCode.purpose == purpose
    ).first()

    if not db_code:
        return None # 코드가 틀리거나 목적이 다름

    if db_code.expires_at < datetime.now(timezone.utc):
        return None # 코드가 만료됨
    
    # 성공 시 이메일 반환
    return db_code.email
