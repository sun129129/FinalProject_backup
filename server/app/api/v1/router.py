from fastapi import APIRouter
from app.api.v1.endpoints import auth, survey, ocr, user_supplement

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(survey.router, prefix="/survey", tags=["Survey"])
api_router.include_router(ocr.router, prefix="/ocr", tags=["OCR"])
api_router.include_router(user_supplement.router, prefix="/user-supplements", tags=["User Supplements"])
