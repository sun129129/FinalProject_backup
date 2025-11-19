# server/routers/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr # 1. Pydantic 스키마 import
from passlib.context import CryptContext  # 2. 비밀번호 '암호화' 도구
from datetime import datetime, timedelta, timezone  # 3. 시간/토큰 만료
from jose import JWTError, jwt  # 4. JWT 토큰 생성/검증
import random  # 5. 인증 코드 생성을 위해
import string  # 6. 인증 코드 생성을 위해

# 7. 우리가 만든 파일들 import
from database import get_db, settings # 'settings' (비밀키)
import models
import schemas
# from email_utils import send_verification_email # '우체국'

# 8. 'auth' 부서를 위한 라우터(APIRouter)라는 '간판'을 만든다
router = APIRouter()

# 9. [보안] 비밀번호 해싱(암호화) 설정
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 10. [보안] 비밀번호 해싱(암호화) 함수
def get_password_hash(password: str):
    return pwd_context.hash(password)

# 11. [보안] '날것' 비밀번호와 '암호화된' 비밀번호가 일치하는지 검사
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# 12. [보안] '로그인 증표(JWT 토큰)' 생성
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        # .env에서 읽어온 '만료 시간' 사용
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.secret_key, 
        algorithm=settings.algorithm
    )
    return encoded_jwt

# 13. [DB] 이메일로 사용자를 찾는 함수 (가입 여부만 확인)
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.user_email == email).first()

# # 14. [DB] '인증 코드' 저장/업데이트 함수 (목적'purpose' 포함)
# def upsert_verification_code(db: Session, email: str, code: str, purpose: str):
#     expires_at = datetime.now(timezone.utc) + timedelta(minutes=5) # 5분 만료
    
#     db_code = db.query(models.VerificationCode).filter(
#         models.VerificationCode.email == email,
#         models.VerificationCode.purpose == purpose
#     ).first()
    
#     if db_code:
#         db_code.code = code
#         db_code.expires_at = expires_at
#     else:
#         db_code = models.VerificationCode(
#             email=email, code=code, purpose=purpose, expires_at=expires_at
#         )
#         db.add(db_code)
    
#     db.commit()
#     db.refresh(db_code)
#     return db_code

# # 15. [DB] '인증 코드' 검증 함수 (목적'purpose' 포함)
# def verify_code_and_get_email(db: Session, email: str, code: str, purpose: str):
#     db_code = db.query(models.VerificationCode).filter(
#         models.VerificationCode.email == email,
#         models.VerificationCode.code == code,
#         models.VerificationCode.purpose == purpose
#     ).first()

#     if not db_code:
#         return None # 코드가 틀리거나 목적이 다름

#     if db_code.expires_at < datetime.now(timezone.utc):
#         return None # 코드가 만료됨
    
#     return db_code.email


# --- [추가!] '경비원' 설정 ---
# React가 HTTP 헤더에 'Authorization: Bearer [토큰]' 
# 형식으로 토큰을 보내는지 검사할 '규칙'
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


# --- [추가!] '경비원' 함수 ---
# API가 호출될 때마다 이 함수가 '토큰'을 해독해서 '로그인한 유저'를 찾아냄
def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
):
    # 1. '자격 증명 실패' 시 보낼 기본 에러
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # 2. React가 보낸 '토큰'을 '비밀키'로 해독 시도
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.algorithm]
        )
        # 3. 토큰에서 '이메일'('sub'라는 이름으로 저장했었음) 꺼내기
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        # 해독 실패 (위조됐거나, 만료됐거나...)
        raise credentials_exception
    
    # 4. DB에서 해당 이메일을 가진 'user' 찾기
    user = get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
        
    # 5. [성공!] 'user' 객체를 API 함수에 전달
    return user

# --- API 엔드포인트들 ---

# 16. [API] "인증 코드 발송" (회원가입용)
@router.post("/request-verification")
async def request_verification_code(
    data: schemas.EmailRequest, 
    db: Session = Depends(get_db)
):
    if get_user_by_email(db, email=data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 사용 중인 이메일입니다."
        )
        
    code = "".join(random.choices(string.digits, k=6))
    
    # 'signup' 목적으로 코드 저장
    upsert_verification_code(db, email=data.email, code=code, purpose="signup")
    
    try:
        await send_verification_email(email_to=data.email, code=code)
        return {"message": "인증 코드가 발송되었습니다."}
    except Exception as e:
        print(f"이메일 발송 실패: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="이메일 발송에 실패했습니다."
        )

# 17. [API] "회원가입" (인증 코드 검증 포함)
@router.post("/signup", response_model=schemas.User)
def signup_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    
    if get_user_by_email(db, email=user.user_email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 사용 중인 이메일입니다."
        )
        
    # 'signup' 목적으로 코드 검증
    verified_email = verify_code_and_get_email(
        db, email=user.email, code=user.verification_code, purpose="signup"
    )
    if not verified_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="인증 코드가 유효하지 않거나 만료되었습니다."
        )

    hashed_password = get_password_hash(user.password)

    db_user = models.User(
        user_email=user.user_email,
        user_name=user.user_name,
        gender=user.gender,
        birthdate=user.birthdate,
        mobile_num=user.mobile_num,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# 18. [API] "로그인" (토큰 + 유저 정보 반환)
@router.post("/login", response_model=schemas.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    user = get_user_by_email(db, email=form_data.username)

    # 유저가 없거나, 비번이 틀렸거나, '탈퇴'(is_active=False)했는지 검사
    if not user or not verify_password(form_data.password, user.hashed_password) or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.user_email}, expires_delta=access_token_expires
    )

    # React에게 '토큰'과 'user 객체'를 둘 다 돌려줌
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.post("/find-id")
def find_id(request: schemas.FindIdRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.user_name == request.user_name,
        models.User.birthdate == request.birthdate
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="일치하는 사용자가 없습니다."
        )
    return {"user_email": user.user_email}


@router.post("/reset-password")
def reset_password(request: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, email=request.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다."
        )

    hashed_password = get_password_hash(request.password)
    user.hashed_password = hashed_password
    db.commit()

    return {"message": "비밀번호가 성공적으로 재설정되었습니다."}


@router.delete("/me", status_code=status.HTTP_200_OK)
def delete_current_user(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    현재 로그인된 사용자의 계정을 비활성화합니다 (소프트 삭제).
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다."
        )

    current_user.is_active = False
    db.commit()

    return {"message": "회원 탈퇴가 성공적으로 처리되었습니다."}