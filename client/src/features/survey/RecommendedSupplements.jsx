import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderWithBack from '../../components/common/HeaderWithBack';
import Button from '../../components/common/Button';
import { getSurveyResults } from '../../api/surveyApi';
import { searchProducts } from '../../api/productApi';

const RecommendedSupplements = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // 1. 설문 결과(키워드별 점수) 가져오기
        const surveyResults = await getSurveyResults();
        if (!surveyResults || surveyResults.length === 0) {
          throw new Error("설문 결과가 없습니다.");
        }

        // 2. 가장 점수가 높은 키워드 찾기
        const topKeyword = surveyResults.reduce((max, current) => 
          max.survey_score > current.survey_score ? max : current
        );
        
        // 3. 해당 키워드로 추천형 검색 실행
        const recommendationQuery = `${topKeyword.keyword_nm} 영양제 추천`;
        const response = await searchProducts(recommendationQuery);

        if (response.search_type === 'recommendation' && response.data) {
          setRecommendations(response.data);
        } else {
          // 추천형 검색 결과가 없는 경우, 일반 정보형 검색으로 대체
          const infoResponse = await searchProducts(topKeyword.keyword_nm);
          setRecommendations(infoResponse.data || []);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleNext = () => {
    navigate('/loading-report');
  };
  
  const renderContent = () => {
    if (loading) {
        return <div className="text-center p-10">추천 영양제를 불러오는 중...</div>;
    }
    if (error) {
        return <div className="text-center p-10 text-red-500">오류: {error}</div>;
    }
    if (recommendations.length === 0) {
        return <div className="text-center p-10">추천할 영양제가 없습니다.</div>;
    }
    return (
        <ul>
            {recommendations.map((product, index) => (
                <li key={index} className="border rounded-lg p-4 mb-3 mx-4 shadow-sm">
                    <div className="font-bold">{product.PRDLST_NM}</div>
                    <div className="text-sm text-gray-700">{product.BSSH_NM}</div>
                    <p className="text-sm mt-1">{product.PRIMARY_FNCLTY}</p>
                </li>
            ))}
        </ul>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <HeaderWithBack title="추천 영양제" />
      <div className="flex-grow overflow-y-auto pt-4">
        <h1 className="text-2xl font-bold text-center mb-6">당신을 위한 영양제 추천</h1>
        {renderContent()}
      </div>
      <div className="p-4">
        <Button onClick={handleNext} disabled={loading}>
          종합 결과 리포트 보기
        </Button>
      </div>
    </div>
  );
};

export default RecommendedSupplements;
