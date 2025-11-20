from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import random
import string

from app.api import deps
from app.core import security
from app.core.config import settings
from app.schemas import auth as auth_schema
from app.schemas import user as user_schema
from app.crud import crud_user, crud_verification
from app.services import email_service

router = APIRouter()

@router.post("/login", response_model=auth_schema.Token)
def login_for_access_token(
    db: Session = Depends(deps.get_db), 
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    OAuth2 호환 로그인, 액세스 토큰 반환
    """
    user = crud_user.get_user_by_email(db, email=form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password) or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = security.create_access_token(data={"sub": user.user_email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/check-email", status_code=status.HTTP_200_OK)
def check_email_exists(
    email: str,
    db: Session = Depends(deps.get_db)
):
    """
    이메일이 이미 존재하는지 확인
    """
    user = crud_user.get_user_by_email(db, email=email)
    if user:
        return {"is_duplicate": True}
    return {"is_duplicate": False}

@router.post("/signup", response_model=user_schema.UserResponse)
def signup_user(
    user_in: user_schema.UserCreate,
    db: Session = Depends(deps.get_db)
):
    """
    새로운 사용자 회원가입
    """
    user = crud_user.get_user_by_email(db, email=user_in.user_email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="이미 사용 중인 이메일입니다.",
        )
    user = crud_user.create_user(db=db, user=user_in)
    return user

@router.post("/request-verification", status_code=status.HTTP_200_OK)
async def request_verification_code(
    data: auth_schema.EmailRequest, 
    db: Session = Depends(deps.get_db)
):
    """
    회원가입을 위한 이메일 인증 코드 발송
    """
    if crud_user.get_user_by_email(db, email=data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 사용 중인 이메일입니다."
        )
        
    code = "".join(random.choices(string.digits, k=6))
    crud_verification.upsert_verification_code(db, email=data.email, code=code, purpose="signup")
    
    try:
        await email_service.send_verification_email(email_to=data.email, code=code)
        return {"message": "인증 코드가 발송되었습니다."}
    except Exception as e:
        # 로깅 추가 권장
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="이메일 발송에 실패했습니다."
        )

@router.post("/find-id", response_model=auth_schema.EmailRequest)
def find_id(
    request: auth_schema.FindIdRequest, 
    db: Session = Depends(deps.get_db)
):
    """
    이름과 생년월일로 이메일 아이디 찾기
    """
    user = crud_user.get_user_by_name_and_birthdate(
        db, name=request.user_name, birthdate=request.birthdate
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="일치하는 사용자가 없습니다."
        )
    return {"user_email": user.user_email}

@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(
    request: auth_schema.ResetPasswordRequest, 
    db: Session = Depends(deps.get_db)
):
    """
    비밀번호 재설정
    """
    user = crud_user.get_user_by_email(db, email=request.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다."
        )

    hashed_password = security.get_password_hash(request.password)
    user.hashed_password = hashed_password
    db.commit()

    return {"message": "비밀번호가 성공적으로 재설정되었습니다."}


