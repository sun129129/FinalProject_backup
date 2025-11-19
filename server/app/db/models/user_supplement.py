from sqlalchemy import (
    Column, Integer, String, DATETIME, ForeignKey
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class UserSupplement(Base):
    __tablename__ = "user_supplement"

    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)
    prdlst_report_no = Column(String(20), ForeignKey("product.PRDLST_REPORT_NO", ondelete="CASCADE"), primary_key=True)
    source = Column(String(20), nullable=False)
    add_at = Column(DATETIME, nullable=False, server_default=func.now())

    user = relationship("User", back_populates="supplements")
    product = relationship("Product", back_populates="takers")
