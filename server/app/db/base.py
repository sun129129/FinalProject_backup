# 이 파일은 모든 모델을 Base에 임포트하여 Alembic이 감지할 수 있도록 합니다.
from app.core.database import Base
from app.db.models.user import User, VerificationCode
from app.db.models.product import Product
from app.db.models.user_supplement import UserSupplement
from app.db.models.survey import Survey, Keyword, SurveyKeyword, SurveyResponse, ProductScore
