import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackArrowIcon from '../../assets/back-arrow.svg';
import SearchIcon from '../../assets/search.svg';
import MicIcon from '../../assets/mic-icon.svg';
import { searchProducts } from '../../api/productApi';

const SearchScreen = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  // API 응답 전체를 저장할 state (search_type, data, message 포함)
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const data = await searchProducts(query);
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 검색 결과 렌더링 로직
  const renderResults = () => {
    if (loading) {
      return <div className="text-center p-10">검색 중...</div>;
    }

    if (error) {
      return <div className="text-center p-10 text-red-500">오류: {error}</div>;
    }
    
    if (!response) {
      return <div className="text-center p-10 text-gray-500">"눈 영양제 추천해줘" 또는 "밀크씨슬 효능 알려줘" 와 같이 질문해보세요!</div>;
    }
    
    // 추천형 결과 렌더링
    if (response.search_type === 'recommendation') {
      return (
        <div className="p-4">
          <ul>
            {response.data.map((product, index) => (
              <li key={index} className="border rounded-lg p-4 mb-3 shadow-sm bg-blue-50">
                <div className="font-bold text-blue-800">{product.PRDLST_NM}</div>
                <div className="text-sm text-gray-700">{product.BSSH_NM}</div>
                <p className="text-sm mt-1">{product.PRIMARY_FNCLTY}</p>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    // 정보형 결과 렌더링
    if (response.search_type === 'information' && response.data.length > 0) {
      return (
        <div className="p-4">
          <ul>
            {response.data.map((product) => (
               <li key={product.PRDLST_REPORT_NO} className="border-b p-4 space-y-2">
                <div className="font-bold text-lg">{product.PRDLST_NM}</div>
                <div className="text-sm text-gray-700">{product.BSSH_NM}</div>
                <div className="text-sm"><span className="font-semibold">기능성:</span> {product.PRIMARY_FNCLTY}</div>
                {product.NTK_MTHD && (
                  <div className="text-xs text-gray-600"><span className="font-semibold">섭취 방법:</span> {product.NTK_MTHD}</div>
                )}
                {product.IFTKN_ATNT_MATR_CN && (
                  <div className="text-xs text-red-600 bg-red-50 p-2 rounded-md"><span className="font-semibold">주의사항:</span> {product.IFTKN_ATNT_MATR_CN}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    // 결과가 없거나, 유형이 'unknown'일 경우
    return <div className="text-center p-10">{response.message || "검색 결과가 없습니다."}</div>;
  };

  return (
    <div className="bg-white min-h-screen font-sans flex flex-col">
      <header className="flex justify-between items-center px-4 h-14 border-b">
        <button 
          className="cursor-pointer p-2" 
          aria-label="뒤로가기"
          onClick={handleBackClick}
        >
          <img src={BackArrowIcon} alt="뒤로가기" className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-black">영양제 검색</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-4">
        <div className="bg-[#D6F2FA] rounded-full p-2 flex items-center shadow-sm">
          <div className="bg-white rounded-full flex-1 h-11 flex items-center pl-5 pr-2.5 mr-2">
            <input 
              type="text" 
              placeholder="찾고 싶은 영양제를 검색해 보세요" 
              className="border-none outline-none text-sm w-full text-gray-800 bg-transparent placeholder-gray-400"
              value={query}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="cursor-pointer flex items-center justify-center p-1.5" 
              aria-label="검색"
              onClick={handleSearch}
            >
              <img src={SearchIcon} alt="검색" className="w-5 h-5" />
            </button>
          </div>
          <button className="w-11 h-11 bg-white rounded-full border-none flex items-center justify-center cursor-pointer shadow-sm" aria-label="음성 검색">
            <img src={MicIcon} alt="음성 검색" className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        {renderResults()}
      </div>
    </div>
  );
};

export default SearchScreen;