import io
import pytesseract
from PIL import Image
from fastapi.concurrency import run_in_threadpool

# Docker 환경에서는 Tesseract가 시스템 경로에 설치되므로,
# 별도의 경로 지정이 필요 없습니다.
# 로컬 Windows 개발 시 경로 설정이 필요할 수 있습니다.
# try:
#     pytesseract.pytesseract.tesseract_cmd = r'C:\ Program Files\Tesseract-OCR\tesseract.exe'
# except FileNotFoundError:
#     print("Tesseract is not installed or not in the specified path.")

def _clean_text(text: str) -> str:
    """OCR로 추출된 텍스트에서 불필요한 공백과 줄바꿈을 제거합니다."""
    return " ".join(text.replace("\n", " ").split())

async def extract_text_from_image(image_contents: bytes) -> str:
    """
    이미지 바이트에서 텍스트를 비동기적으로 추출하고 정리합니다.
    CPU 집약적인 작업을 별도 스레드에서 실행합니다.
    """
    image = Image.open(io.BytesIO(image_contents))
    
    # OCR 실행 (한글+영어)
    extracted_text = await run_in_threadpool(
        lambda: pytesseract.image_to_string(image, lang='kor+eng')
    )
    
    return _clean_text(extracted_text)


