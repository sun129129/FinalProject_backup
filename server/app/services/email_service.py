from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from app.core.config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_verification_email(email_to: str, code: str):
    """
    인증 코드를 담은 이메일을 비동기적으로 발송합니다.
    """
    template = f"""
        <html>
        <body>
            <div style="font-family: 'Arial', sans-serif; text-align: center; padding: 40px; background-color: #f9f9f9;">
                <h2 style="color: #333;">WonCare 이메일 인증</h2>
                <p style="color: #555; font-size: 16px;">회원가입을 위한 인증 코드는 다음과 같습니다.</p>
                <h3 style="color: #007bff; font-size: 24px; margin: 20px 0;"><strong>{code}</strong></h3>
                <p style="color: #888; font-size: 14px;">이 코드는 5분간 유효합니다.</p>
                <p style="color: #aaa; font-size: 12px;">만약 직접 요청하지 않으셨다면 이 이메일을 무시해 주세요.</p>
            </div>
        </body>
        </html>
    """
    
    message = MessageSchema(
        subject="[WonCare] 회원가입 인증 코드입니다.",
        recipients=[email_to],
        body=template,
        subtype="html"
    )
    
    fm = FastMail(conf)
    await fm.send_message(message)