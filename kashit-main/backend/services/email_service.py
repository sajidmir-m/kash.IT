from flask_mail import Message
from threading import Thread


def send_async_email(app, mail, msg):
    with app.app_context():
        mail.send(msg)


def send_otp_email(mail, app, recipient, otp_code):
    msg = Message(
        subject='Kash.it - Email Verification OTP',
        recipients=[recipient]
    )
    msg.body = f'''
Hello,

Your OTP for email verification is: {otp_code}

This OTP will expire in 10 minutes.

If you did not request this, please ignore this email.

Best regards,
Kash.it Team
'''
    msg.html = f'''
<html>
  <body>
    <h2>Email Verification</h2>
    <p>Your OTP for email verification is:</p>
    <h1 style="color: #4CAF50; font-size: 36px; letter-spacing: 5px;">{otp_code}</h1>
    <p>This OTP will expire in 10 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
    <br>
    <p>Best regards,<br>Kash.it Team</p>
  </body>
</html>
'''
    
    thread = Thread(target=send_async_email, args=(app, mail, msg))
    thread.start()
    return thread


def send_password_reset_email(mail, app, recipient, otp_code):
    msg = Message(
        subject='Kash.it - Password Reset OTP',
        recipients=[recipient]
    )
    msg.body = f'''
Hello,

Your OTP for password reset is: {otp_code}

This OTP will expire in 10 minutes.

If you did not request this, please ignore this email and your password will remain unchanged.

Best regards,
Kash.it Team
'''
    msg.html = f'''
<html>
  <body>
    <h2>Password Reset</h2>
    <p>Your OTP for password reset is:</p>
    <h1 style="color: #FF9800; font-size: 36px; letter-spacing: 5px;">{otp_code}</h1>
    <p>This OTP will expire in 10 minutes.</p>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    <br>
    <p>Best regards,<br>Kash.it Team</p>
  </body>
</html>
'''
    
    thread = Thread(target=send_async_email, args=(app, mail, msg))
    thread.start()
    return thread
