from pydantic import BaseModel
from datetime import datetime

# 복용 영양제 생성을 위한 스키마
class UserSupplementCreate(BaseModel):
    prdlst_report_no: str
    source: str

# 복용 영양제 정보 조회를 위한 스키마
class UserSupplementSchema(BaseModel):
    user_id: int
    prdlst_report_no: str
    source: str
    add_at: datetime
    
    # product: ProductSchema # Include product details if needed

    class Config:
        orm_mode = True
