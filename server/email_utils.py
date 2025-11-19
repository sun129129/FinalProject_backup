# # server/email_utils.py
# from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
# from database import settings  # '전기실'에서 'settings' 가져오기

# # .env에서 읽어온 설정값으로 'ConnectionConfig' 생성
# conf = ConnectionConfig(
#     MAIL_USERNAME = settings.mail_username,
#     MAIL_PASSWORD = settings.mail_password,
#     MAIL_FROM = settings.mail_from,
#     MAIL_PORT = settings.mail_port,
#     MAIL_SERVER = settings.mail_server,
#     MAIL_STARTTLS = settings.mail_starttls,
#     MAIL_SSL_TLS = settings.mail_ssl_tls,
#     USE_CREDENTIALS = True,
#     VALIDATE_CERTS = True
# )

# # 'FastMail' 인스턴스 생성 (이게 '우체국' 본체!)
# fm = FastMail(conf)

# # '인증 링크' 이메일 발송 함수
# async def send_verification_email(email_to: str, verification_url: str):
#     message = MessageSchema(
#         subject="[WonCare] 이메일 인증을 완료해 주세요.",
#         recipients=[email_to],  # 받는 사람
#         body=f"""
#         <div style="font-family: 'Arial', sans-serif; text-align: center; padding: 40px; background-color: #f9f9f9;">
#             <h2 style="color: #333;">WonCare 이메일 인증</h2>
#             <p style="color: #555; font-size: 16px;">회원가입을 거의 다 마쳤습니다! 아래 버튼을 클릭하여 이메일 주소를 인증해 주세요.</p>
#             <a href="{verification_url}" target="_blank" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 15px 25px; margin: 20px 0; text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold;">
#                 이메일 인증하기
#             </a>
#             <p style="color: #888; font-size: 14px;">이 링크는 15분간 유효합니다.</p>
#             <p style="color: #aaa; font-size: 12px;">만약 직접 요청하지 않으셨다면 이 이메일을 무시해 주세요.</p>
#         </div>
#         """,
#         subtype="html"
#     )

#     await fm.send_message(message)
#     return True