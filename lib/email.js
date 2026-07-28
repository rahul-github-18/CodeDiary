import nodemailer from 'nodemailer';

const getTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.GMAIL_USER || '';
  const pass = process.env.SMTP_PASS || process.env.GMAIL_PASS || '';
  const from = process.env.SMTP_FROM || `"CodeDiary" <${user || 'no-reply@codediary.com'}>`;

  if (user && pass) {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
    return { transporter, from, user };
  }
  return { transporter: null, from, user: null };
};

// 1. Send OTP Verification Email (Clean, simple, box-free design)
export async function sendOtpEmail(toEmail, otpCode, username) {
  const { transporter, from, user } = getTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>CodeDiary Verification Code</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #ffffff; color: #1e293b; line-height: 1.6; margin: 0; padding: 24px;">
      <div style="max-width: 500px; margin: 0 auto;">
        <h2 style="color: #0284c7; font-size: 22px; margin-bottom: 20px; font-weight: 800; letter-spacing: -0.5px;">CodeDiary</h2>
        
        <p style="font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 12px;">Hello ${username || 'Developer'},</p>
        
        <p style="font-size: 14px; color: #475569; margin-bottom: 16px;">
          Thank you for enrolling in CodeDiary! Please use the One-Time Password (OTP) below to verify your email address:
        </p>
        
        <p style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0284c7; margin: 24px 0; font-family: monospace;">
          ${otpCode}
        </p>
        
        <p style="font-size: 13px; color: #64748b; margin-bottom: 24px;">
          This verification code is valid for 10 minutes. Do not share this code with anyone. If you did not request this code, please ignore this email.
        </p>
        
        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 32px; font-size: 13px; color: #64748b;">
          <p style="margin: 0 0 4px 0;">Warm regards,</p>
          <p style="margin: 0 0 16px 0; font-weight: 700; color: #0f172a;">The CodeDiary Team</p>
          <p style="margin: 0; font-size: 11px; color: #94a3b8;">Copyright &copy; ${new Date().getFullYear()} CodeDiary. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (transporter && user) {
    try {
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
    console.log(`[SMTP DEV MODE] OTP Code for ${toEmail}: ${otpCode}`);
    return { sent: false, mode: 'dev', devOtp: otpCode };
  }
}

// 2. Send Welcome Email upon successful registration (Clean, simple, box-free)
export async function sendWelcomeEmail(toEmail, username) {
  const { transporter, from, user } = getTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to CodeDiary</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #ffffff; color: #1e293b; line-height: 1.6; margin: 0; padding: 24px;">
      <div style="max-width: 500px; margin: 0 auto;">
        <h2 style="color: #0284c7; font-size: 22px; margin-bottom: 20px; font-weight: 800; letter-spacing: -0.5px;">CodeDiary</h2>
        
        <p style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 12px;">Welcome to CodeDiary, ${username || 'Developer'}! 🎉</p>
        
        <p style="font-size: 14px; color: #475569; margin-bottom: 14px;">
          Your email address (<strong>${toEmail}</strong>) has been successfully verified, and your account registration is complete!
        </p>
        
        <p style="font-size: 14px; color: #475569; margin-bottom: 24px;">
          Your developer workspace is now active and ready. You can log in at any time to organize programming topics, practice Data Structures & Algorithms, write structured notes, and track your daily learning progress.
        </p>
        
        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 32px; font-size: 13px; color: #64748b;">
          <p style="margin: 0 0 4px 0;">Warm regards,</p>
          <p style="margin: 0 0 16px 0; font-weight: 700; color: #0f172a;">The CodeDiary Team</p>
          <p style="margin: 0; font-size: 11px; color: #94a3b8;">Copyright &copy; ${new Date().getFullYear()} CodeDiary. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (transporter && user) {
    try {
      await transporter.sendMail({
        from,
        to: toEmail,
        subject: `Welcome to CodeDiary! Your Registration is Complete 🎉`,
        html: htmlContent
      });
      return { sent: true };
    } catch (err) {
      console.error('SMTP Welcome Email Error:', err);
      return { sent: false, error: err.message };
    }
  } else {
    console.log(`[SMTP DEV MODE] Welcome email triggered for ${toEmail}`);
    return { sent: false, mode: 'dev' };
  }
}
