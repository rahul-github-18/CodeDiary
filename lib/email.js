import nodemailer from 'nodemailer';

export async function sendOtpEmail(toEmail, otpCode, username) {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.GMAIL_USER || '';
  const pass = process.env.SMTP_PASS || process.env.GMAIL_PASS || '';
  const from = process.env.SMTP_FROM || `"CodeDiary Verification" <${user || 'no-reply@codediary.com'}>`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>CodeDiary Verification Code</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
        .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
        .header { background: linear-gradient(135deg, #0284c7 0%, #4f46e5 100%); padding: 32px 24px; text-align: center; color: white; }
        .title { font-size: 24px; font-weight: 800; margin-bottom: 4px; letter-spacing: -0.5px; }
        .subtitle { font-size: 13px; opacity: 0.9; font-weight: 500; }
        .body { padding: 32px 28px; text-align: center; }
        .greeting { font-size: 16px; font-weight: 700; color: #334155; margin-bottom: 12px; }
        .text { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 24px; }
        .otp-box { background: #f0fdf4; border: 2px dashed #22c55e; border-radius: 14px; padding: 16px 24px; display: inline-block; margin: 8px 0 24px 0; }
        .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #15803d; }
        .expiry { font-size: 12px; color: #94a3b8; margin-top: 8px; }
        .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="title">CodeDiary</div>
          <div class="subtitle">Developer Workspace & Learning Platform</div>
        </div>
        <div class="body">
          <div class="greeting">Hello ${username || 'Developer'},</div>
          <div class="text">Thank you for enrolling! Please use the One-Time Password (OTP) below to verify your email address:</div>
          <div class="otp-box">
            <div class="otp-code">${otpCode}</div>
          </div>
          <div class="text" style="margin-bottom: 8px;">This verification code is valid for 10 minutes. Do not share this code with anyone.</div>
          <div class="expiry">If you did not request this verification email, please ignore it.</div>
        </div>
        <div class="footer">
          <p style="margin: 0 0 6px 0;">Best regards,<br><strong>The CodeDiary Team</strong></p>
          <p style="margin: 0;">Copyright &copy; ${new Date().getFullYear()} CodeDiary. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass }
      });

      await transporter.sendMail({
        from,
        to: toEmail,
        subject: `${otpCode} is your CodeDiary Verification Code`,
        html: htmlContent
      });
      return { sent: true, mode: 'smtp' };
    } catch (err) {
      console.error('SMTP Send Error:', err);
      return { sent: false, mode: 'smtp_error', error: err.message, devOtp: otpCode };
    }
  } else {
    console.log(`[SMTP DEV MODE] OTP Code generated for ${toEmail}: ${otpCode}`);
    return { sent: false, mode: 'dev', devOtp: otpCode };
  }
}
