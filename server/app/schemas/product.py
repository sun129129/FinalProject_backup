from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# --- Product and Intake (제품 및 섭취 기록) 스키마 ---

class ProductSchema(BaseModel):
    PRDLST_REPORT_NO: int
    BSSH_NM: Optional[str] = None
    PRDLST_NM: Optional[str] = None
    POG_DAYCNT: Optional[str] = None
    DISPOS: Optional[str] = None
    NTK_MTHD: Optional[str] = None
    PRIMARY_FNCLTY: Optional[str] = None
    IFTKN_ATNT_MATR_CN: Optional[str] = None
    CSTDY_MTHD: Optional[str] = None
    STDR_STND: Optional[str] = None
    PRDT_SHAP_CD_NM: Optional[str] = None
    RAWMTRL_NM: Optional[str] = None
    LAST_UPDT_DTM: Optional[int] = None
    INDIV_RAWMTRL_NM: Optional[str] = None
    ETC_RAWMTRL_NM: Optional[str] = None
    CAP_RAWMTRL_NM: Optional[str] = None
    NAVER_RANK: Optional[int] = None
    INDEX_LAST_UPDATED: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserIntakeCreate(BaseModel):
    prdlst_report_no: int

class UserIntakeSchema(BaseModel):
    intake_id: int
    created_at: datetime
    product: ProductSchema

    class Config:
        from_attributes = True
