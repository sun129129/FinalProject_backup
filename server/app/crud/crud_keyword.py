from sqlalchemy.orm import Session
from typing import List
from app.db.models.survey import Keyword

def get_keywords(db: Session) -> List[Keyword]:
    """
    모든 키워드 목록을 조회합니다.
    """
    return db.query(Keyword).order_by(Keyword.keyword_id).all()
