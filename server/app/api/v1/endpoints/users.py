from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

# 1. 필요한 모듈 가져오기
from app.api import deps                  # DB 세션(get_db) 의존성
from app.schemas.user import UserCreate, UserResponse  # 스키마 (아까 이름을 UserResponse로 바꿨다고 가정!)
from app.services import user_service     # DB 작업 담당 서비스

router = APIRouter()

# --- 회원가입 API ---
@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(
    user_in: UserCreate, 
    db: Session = Depends(deps.get_db)
):
    """
    새로운 사용자를 등록합니다 (회원가입).
    - 이메일 중복 확인 후 가입을 진행합니다.
    """
    # 1. [중복 체크] 이메일이 이미 DB에 있는지 확인
    # user_service에 있는 함수를 사용해서 깔끔하게 처리
    existing_user = user_service.get_user_by_email(db, email=user_in.user_email)
    
    if existing_user:
        # 2. [실패] 중복이면 400 에러 발생 (프론트엔드에 메시지 전달)
        raise HTTPException(
            status_code=400,
            detail="이미 가입된 이메일입니다."
        )
    
    # 3. [성공] 중복이 아니면 유저 생성 (비밀번호 해싱 등은 service 내부에서 처리)
    new_user = user_service.create_user(db, user=user_in)
    
    return new_user

# --- (참고) 내 정보 조회 API 예시 ---
# 나중에 로그인 기능 만들고 나서, 토큰으로 내 정보를 불러올 때 이런 식으로 추가하면 돼.
# @router.get("/me", response_model=UserResponse)
# def read_user_me(
#     current_user: User = Depends(deps.get_current_active_user)
# ):
#     return current_user



