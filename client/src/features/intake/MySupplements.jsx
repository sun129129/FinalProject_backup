import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderWithBack from '../../components/common/HeaderWithBack';
import apiClient from '../../api/apiClient';
import Button from '../../components/common/Button';
import HomeButton from '../../components/common/HomeButton';

const MySupplements = () => {
  const navigate = useNavigate();
  const [intakeList, setIntakeList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIntakeList = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/user-intake');
        setIntakeList(response);
      } catch (err) {
        setError('영양제 목록을 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIntakeList();
  }, []);

  const handleDelete = async (intakeId) => {
    if (!window.confirm('정말로 이 영양제를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await apiClient.delete(`/user-intake/${intakeId}`);
      // UI에서 즉시 삭제된 항목을 반영
      setIntakeList(intakeList.filter((item) => item.intake_id !== intakeId));
    } catch (err) {
      alert('삭제에 실패했습니다. 다시 시도해주세요.');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <HeaderWithBack title="나의 영양제 관리" />
      <div className="flex-grow p-6">
        <div className="mb-6">
          <Button onClick={() => navigate('/intake-ocr')}>
            + 새 영양제 등록하기
          </Button>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-sm">
          {isLoading ? (
            <p className="text-center text-gray-500">목록을 불러오는 중...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : intakeList.length > 0 ? (
            <ul className="space-y-4">
              {intakeList.map((intake) => (
                <li key={intake.intake_id} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm">
                  <div>
                    <p className="font-bold text-lg text-gray-800">{intake.product.PRDLST_NM}</p>
                    <p className="text-md text-gray-600 mt-1">{intake.product.BSSH_NM}</p>
                    <p className="text-sm text-gray-500 mt-2">등록일: {new Date(intake.created_at).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(intake.intake_id)}
                    className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">등록된 영양제가 없습니다.</p>
              <p className="text-gray-400 text-sm mt-2">아래 버튼을 눌러 첫 영양제를 등록해보세요.</p>
            </div>
          )}
        </div>
      </div>
      <HomeButton />
    </div>
  );
};

export default MySupplements;
