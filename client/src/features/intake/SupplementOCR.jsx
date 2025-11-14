import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderWithBack from '../../components/common/HeaderWithBack';
import Button from '../../components/common/Button';
import apiClient from '../../api/apiClient'; // API 클라이언트 임포트
import HomeButton from '../../components/common/HomeButton';

const SupplementOCR = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [ocrResults, setOcrResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setOcrResults([]);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('먼저 이미지 파일을 선택해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');
    setOcrResults([]);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await apiClient.post('/ocr/upload', formData, { // Corrected path
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setOcrResults(response);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || '제품을 찾지 못했습니다. 다른 사진으로 시도해보세요.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProduct = async (product) => {
    setIsLoading(true);
    try {
      await apiClient.post('/user-intake', { // Corrected path
        prdlst_report_no: product.PRDLST_REPORT_NO,
      });
      alert(`${product.PRDLST_NM}이(가) 나의 영양제로 등록되었습니다.`);
      navigate('/my-supplements'); // 등록 후 내 영양제 페이지로 이동
    } catch (err) {
      const errorMessage = err.response?.data?.detail || '등록에 실패했습니다. 다시 시도해주세요.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HeaderWithBack title="영양제 등록 (OCR)" />
      <div className="flex-grow p-6 flex flex-col items-center">
        <p className="text-gray-600 mb-4 text-center">
          복용 중인 영양제 사진을 업로드하여
          <br />
          간편하게 내 정보를 등록하세요.
        </p>

        <div className="w-full max-w-sm mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {preview && (
          <div className="w-full max-w-sm mb-4 border rounded-lg p-2">
            <img src={preview} alt="Preview" className="w-full h-auto rounded-md" />
          </div>
        )}

        <div className="w-full max-w-sm">
          <Button onClick={handleUpload} disabled={isLoading || !selectedFile}>
            {isLoading ? '분석 중...' : '사진으로 영양제 찾기'}
          </Button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {ocrResults.length > 0 && (
          <div className="w-full max-w-sm mt-6">
            <h3 className="text-lg font-bold mb-2">분석 결과</h3>
            <p className="text-sm text-gray-600 mb-4">아래 목록에서 등록할 영양제를 선택하세요.</p>
            <ul className="space-y-2">
              {ocrResults.map((product) => (
                <li key={product.PRDLST_REPORT_NO}>
                  <button
                    onClick={() => handleSelectProduct(product)}
                    className="w-full text-left p-3 bg-gray-100 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    <p className="font-semibold">{product.PRDLST_NM}</p>
                    <p className="text-sm text-gray-500">{product.BSSH_NM}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <HomeButton />
    </div>
  );
};

export default SupplementOCR;
