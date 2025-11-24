from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Any, Literal

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

# --- Natural Language Search Schemas ---

class NaturalSearchRequest(BaseModel):
    """
    자연어 검색 요청 스키마
    """
    query: str

class NaturalSearchResponse(BaseModel):
    """
    자연어 검색 응답 스키마
    """
    search_type: Literal["recommendation", "information", "unknown"]
    data: Any
    message: Optional[str] = None
