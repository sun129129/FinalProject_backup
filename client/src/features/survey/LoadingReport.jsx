// src/components/LoadingReport.js

// ⚠️ 참고: 실제 이미지 파일은 src/assets/ 폴더 등에 넣고 경로를 수정하세요.
import loadingBeeImage from '../assets/loading-bee.png'; 

function LoadingReport() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      
      {/* 텍스트 */}
      <h1 className="text-3xl font-bold text-gray-800">
        리포트 생성 중입니다.
      </h1>
      <h2 className="text-3xl font-bold text-gray-800 mt-2">
        잠시 기다려 주세요.
      </h2>

      {/* 로딩 캐릭터 이미지 */}
      {/*         위 태그 대신 실제 이미지 태그를 사용합니다.
      */}
      <img 
        src={loadingBeeImage} 
        alt="로딩 중 캐릭터" 
        className="w-48 h-48 my-10" 
      />

    </div>
  );
}

export default LoadingReport;