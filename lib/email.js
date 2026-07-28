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

// 1. Send OTP Verification Email (Completely box-free, clean & professional)
export async function sendOtpEmail(toEmail, otpCode, username) {
  const { transporter, from, user } = getTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>CodeDiary Verification Code</title>
    </head>
    <body style="font-family: Arial, Helvetica, sans-serif; background-color: #ffffff; color: #1e293b; line-height: 1.6; margin: 0; padding: 24px;">
      <div style="max-width: 540px; margin: 0 auto;">
        
        <!-- Logo & Brand Header -->
        <div style="margin-bottom: 24px;">
          <img src="https://kodediary.vercel.app/icon.png" alt="CodeDiary Logo" style="width: 44px; height: 44px; vertical-align: middle; margin-right: 10px; border-radius: 10px;" />
          <span style="font-size: 22px; font-weight: 800; color: #0284c7; vertical-align: middle;">CodeDiary</span>
        </div>

        <p style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">Hello ${username || 'Developer'},</p>
        
        <p style="font-size: 14px; color: #475569; margin: 0 0 16px 0; line-height: 1.6;">
          Thank you for enrolling in CodeDiary! Please use the One-Time Password (OTP) below to verify your email address:
        </p>
        
        <div style="font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #0284c7; font-family: monospace; margin: 24px 0;">
          ${otpCode}
        </div>
        
        <p style="font-size: 13px; color: #64748b; margin: 0 0 28px 0; line-height: 1.5;">
          This verification code is valid for 10 minutes. Do not share this code with anyone. If you did not request this code, please ignore this email.
        </p>
        
        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 32px; font-size: 13px; color: #64748b;">
          <p style="margin: 0 0 4px 0;">Warm regards,</p>
          <p style="margin: 0 0 12px 0; font-weight: 700; color: #0f172a;">The CodeDiary Team</p>
          <p style="margin: 0 0 16px 0;">
            Connect with founder Rahul Ranjan on <a href="https://www.linkedin.com/in/rahul-ranjan-6b2ab424a/" target="_blank" style="color: #0a66c2; font-weight: 700; text-decoration: none;">LinkedIn &rarr;</a>
          </p>
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

// 2. Send Welcome Email (Completely box-free, clean & professional with Logo & LinkedIn)
export async function sendWelcomeEmail(toEmail, username) {
  const { transporter, from, user } = getTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to CodeDiary</title>
    </head>
    <body style="font-family: Arial, Helvetica, sans-serif; background-color: #ffffff; color: #1e293b; line-height: 1.65; margin: 0; padding: 24px;">
      <div style="max-width: 560px; margin: 0 auto;">
        
        <!-- Logo & Brand Header -->
        <div style="margin-bottom: 24px;">
          <img src="https://kodediary.vercel.app/icon.png" alt="CodeDiary Logo" style="width: 48px; height: 48px; vertical-align: middle; margin-right: 12px; border-radius: 10px;" />
          <span style="font-size: 24px; font-weight: 800; color: #0284c7; vertical-align: middle;">CodeDiary</span>
        </div>

        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0;">
          Welcome aboard, ${username || 'Developer'}! 🎉
        </h2>

        <p style="font-size: 15px; color: #334155; margin: 0 0 16px 0; line-height: 1.7;">
          Your email address (<strong style="color: #0284c7;">${toEmail}</strong>) has been successfully verified, and your CodeDiary developer account is active and ready for use.
        </p>

        <p style="font-size: 14px; color: #475569; margin: 0 0 16px 0; line-height: 1.7;">
          CodeDiary is designed to help you organize your daily programming learning, master Data Structures & Algorithms, write structured notes, and track your progress in one unified platform:
        </p>

        <ul style="padding-left: 20px; margin: 0 0 24px 0; font-size: 14px; color: #334155; line-height: 1.8;">
          <li><strong style="color: #0284c7;">Structured Curriculum:</strong> Practice DSA, Core Java, Web Development, and System Design.</li>
          <li><strong style="color: #6366f1;">Code Editor & Sharing:</strong> Write, format, and share code snippets with fellow developers.</li>
          <li><strong style="color: #10b981;">Daily Progress & Notes:</strong> Track your learning streak, take structured notes, and monitor your stats.</li>
        </ul>

        <p style="margin: 28px 0;">
          <a href="https://kodediary.vercel.app/login" target="_blank" style="background-color: #0284c7; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 12px 24px; border-radius: 8px; display: inline-block;">
            Log In To Your Workspace &rarr;
          </a>
        </p>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 32px; font-size: 13px; color: #64748b;">
          <p style="margin: 0 0 4px 0;">Warm regards,</p>
          <p style="margin: 0 0 16px 0; font-size: 15px; font-weight: 700; color: #0f172a;">The CodeDiary Team</p>
          
          <p style="margin: 0 0 16px 0; font-size: 13px; color: #334155;">
            Connect with founder <strong>Rahul Ranjan</strong> on <a href="https://www.linkedin.com/in/rahul-ranjan-6b2ab424a/" target="_blank" style="color: #0a66c2; font-weight: 700; text-decoration: none;">LinkedIn &rarr;</a>
          </p>

          <p style="margin: 0; font-size: 11px; color: #94a3b8;">
            Copyright &copy; ${new Date().getFullYear()} CodeDiary. All rights reserved.
          </p>
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
