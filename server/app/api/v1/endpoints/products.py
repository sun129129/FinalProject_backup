from typing import List
from fastapi import APIRouter, Depends, Query, Body
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas.product import ProductSchema, NaturalSearchRequest, NaturalSearchResponse
from app.crud import crud_product

router = APIRouter()

# [개발자 안내] 이전에 사용되던 간단한 GET 검색 엔드포인트입니다.
# 새로운 POST /natural-search 엔드포인트로 대체되었으므로 주석 처리하거나 삭제할 수 있습니다.
# @router.get("/search", response_model=List[ProductSchema])
# def search_products(...):
#     ...

@router.post("/natural-search", response_model=NaturalSearchResponse)
def natural_language_search(
    request: NaturalSearchRequest = Body(...),
    db: Session = Depends(deps.get_db),
    # [개발자 안내] 추천형 검색의 경우 현재 로그인한 사용자의 정보가 필요할 수 있습니다.
    # current_user: user_model.User = Depends(deps.get_current_user)
):
    """
    [MOCK API] 자연어 질의 기반 제품 검색 API
    
    사용자의 자연어 질의를 "추천형"과 "정보형"으로 분류하고,
    각 유형에 맞는 목업(mock) 데이터를 반환하는 API 템플릿입니다.

    Args:
        request (NaturalSearchRequest): 사용자의 검색어(query)를 포함하는 요청 바디.
        db (Session): 데이터베이스 세션. 실제 구현 시 사용됩니다.
        
    Returns:
        NaturalSearchResponse: 검색 유형(`search_type`)과 결과 데이터(`data`)를 포함하는 응답.
    """
    query = request.query
    
    # [개발자 안내] 다음은 실제 구현을 위한 키워드 기반의 간단한 분류 로직 예시입니다.
    # 실제 구현 시에는 Ko-NLP 라이브러리(예: Okt, Mecab)나 머신러닝 모델을 사용하여
    # 더 정교한 의도 분류(Intent Classification)를 수행해야 합니다.
    recommendation_keywords = ["추천", "뭐 먹어", "골라줘", "뭐가 좋아"]
    information_keywords = ["효능", "부작용", "하루", "최대", "성분", "차이"]
    
    search_type = "unknown"
    if any(keyword in query for keyword in recommendation_keywords):
        search_type = "recommendation"
    elif any(keyword in query for keyword in information_keywords):
        search_type = "information"
        
    # --- [MOCK DATA] ---
    if search_type == "recommendation":
        # [개발자 안내] "추천형" 질의에 대한 목업 데이터입니다.
        # 실제 구현 시에는 사용자의 건강 설문 결과, 나이, 성별 등을 기반으로
        # 개인화된 영양제를 추천하는 로직이 필요합니다.
        
        mock_data = []
        # '눈'이라는 단어가 포함된 경우 눈 관련 목업 데이터를 반환합니다.
        if "눈" in query:
            mock_data.append({"PRDLST_NM": "아이맥스 루테인", "PRIMARY_FNCLTY": "노화로 인해 감소될 수 있는 황반색소밀도를 유지하여 눈 건강에 도움을 줌", "BSSH_NM": "우리의약"})
            mock_data.append({"PRDLST_NM": "아이조아 빌베리", "PRIMARY_FNCLTY": "눈의 피로도 개선에 도움을 줄 수 있음", "BSSH_NM": "비타민마을"})
        else:
            # 그 외의 경우 일반적인 추천 목업 데이터를 반환합니다.
            mock_data.append({"PRDLST_NM": f"'{query}' 맞춤 추천 영양제", "PRIMARY_FNCLTY": "피로 회복", "BSSH_NM": "추천 제약"})

        return NaturalSearchResponse(
            search_type=search_type,
            data=mock_data,
            message="영양제 추천 결과입니다." # 메시지 단순화
        )
        
    elif search_type == "information":
        # [개발자 안내] "정보형" 질의에 대한 목업 데이터입니다.
        # 실제 구현 시에는 `crud_product.search_products_by_text` 등을 사용하여
        # 데이터베이스에서 관련 정보를 검색해야 합니다.
        mock_data = [
             {
                "PRDLST_REPORT_NO": 2004002001410,
                "PRDLST_NM": f"'{query}' 관련 정보: 밀크씨슬＋(플러스)",
                "BSSH_NM": "우리의약",
                "PRIMARY_FNCLTY": "간 건강에 도움을 줄 수 있음",
                "NTK_MTHD": "1일 1회, 1회 1정을 물과 함께 섭취하십시오.",
                "IFTKN_ATNT_MATR_CN": "알레르기 반응이 나타나는 경우에는 섭취를 중단하십시오.",
            }
        ]
        return NaturalSearchResponse(
            search_type=search_type,
            data=mock_data,
            message="요청하신 영양제 정보입니다."
        )

    # [개발자 안내] 분류되지 않은 유형의 질의에 대한 기본 응답입니다.
    return NaturalSearchResponse(
        search_type=search_type,
        data=[],
        message="검색 유형을 특정할 수 없습니다. 더 명확한 질문을 입력해주세요."
    )
