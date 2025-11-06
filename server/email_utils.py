# server/email_utils.py
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from database import settings  # '전기실'에서 'settings' 가져오기

# .env에서 읽어온 설정값으로 'ConnectionConfig' 생성
conf = ConnectionConfig(
    MAIL_USERNAME = settings.mail_username,
    MAIL_PASSWORD = settings.mail_password,
    MAIL_FROM = settings.mail_from,
    MAIL_PORT = settings.mail_port,
    MAIL_SERVER = settings.mail_server,
    MAIL_STARTTLS = settings.mail_starttls,
    MAIL_SSL_TLS = settings.mail_ssl_tls,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)

# 'FastMail' 인스턴스 생성 (이게 '우체국' 본체!)
fm = FastMail(conf)

# '인증 코드' 이메일 발송 함수
async def send_verification_email(email_to: str, code: str):
    message = MessageSchema(
        subject="[WonCare] 회원가입 인증 코드입니다.",
        recipients=[email_to],  # 받는 사람
        body=f"""
        <div style="font-family: 'Arial', sans-serif; text-align: center; padding: 20px;">
            <h2>WonCare 회원가입 인증 코드</h2>
            <p>회원가입을 완료하려면 아래 6자리 코드를 입력해 주세요.</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; background-color: #f4f4f4; padding: 10px 20px; margin: 20px 0; display: inline-block;">
                {code}
            </div>
            <p style="color: #888;">이 코드는 5분간 유효합니다.</p>
        </div>
        """,
        subtype="html"
    )

    await fm.send_message(message)
    return True