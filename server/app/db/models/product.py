from sqlalchemy import (
    Column, Integer, String, Text, ForeignKey,
    DATETIME
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base # 경로 수정

# '제품' 테이블
class Product(Base):
    __tablename__ = "product"

    PRDLST_REPORT_NO = Column(Integer, primary_key=True, index=True)
    BSSH_NM = Column(String(255), nullable=True)
    PRDLST_NM = Column(String(255), nullable=True)
    POG_DAYCNT = Column(String(255), nullable=True)
    DISPOS = Column(String(255), nullable=True)
    NTK_MTHD = Column(Text, nullable=True)
    PRIMARY_FNCLTY = Column(Text, nullable=True)
    IFTKN_ATNT_MATR_CN = Column(Text, nullable=True)
    CSTDY_MTHD = Column(Text, nullable=True)
    STDR_STND = Column(String(255), nullable=True)
    PRDT_SHAP_CD_NM = Column(String(255), nullable=True)
    RAWMTRL_NM = Column(Text, nullable=True)
    LAST_UPDT_DTM = Column(Integer, nullable=True)
    INDIV_RAWMTRL_NM = Column(Text, nullable=True)
    ETC_RAWMTRL_NM = Column(Text, nullable=True)
    CAP_RAWMTRL_NM = Column(Text, nullable=True)
    NAVER_RANK = Column(Integer, nullable=True)
    INDEX_LAST_UPDATED = Column(DATETIME, nullable=True)

    takers = relationship("UserSupplement", back_populates="product")

