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

// 1. Send OTP Verification Email (Clean, professional with Logo & LinkedIn)
export async function sendOtpEmail(toEmail, otpCode, username) {
  const { transporter, from, user } = getTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>CodeDiary Verification Code</title>
    </head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; color: #1e293b; line-height: 1.6; margin: 0; padding: 24px;">
      <div style="max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0284c7 0%, #4f46e5 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
          <img src="https://kodediary.vercel.app/icon.png" alt="CodeDiary Logo" style="width: 48px; height: 48px; border-radius: 12px; background: #ffffff; padding: 5px; box-shadow: 0 4px 10px rgba(0,0,0,0.15); display: block; margin: 0 auto 10px auto;" />
          <h1 style="font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.5px; color: #ffffff;">CodeDiary</h1>
        </div>

        <!-- Body -->
        <div style="padding: 32px 28px;">
          <p style="font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px;">Hello ${username || 'Developer'},</p>
          
          <p style="font-size: 14px; color: #475569; margin-bottom: 16px; line-height: 1.6;">
            Thank you for enrolling in CodeDiary! Please use the One-Time Password (OTP) below to verify your email address:
          </p>
          
          <div style="text-align: center; margin: 24px 0;">
            <span style="font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #0284c7; font-family: monospace; background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 12px 24px; border-radius: 12px; display: inline-block;">
              ${otpCode}
            </span>
          </div>
          
          <p style="font-size: 13px; color: #64748b; margin-bottom: 24px; line-height: 1.5;">
            This verification code is valid for 10 minutes. Do not share this code with anyone. If you did not request this code, please ignore this email.
          </p>
          
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 28px; font-size: 13px; color: #64748b;">
            <p style="margin: 0 0 4px 0;">Warm regards,</p>
            <p style="margin: 0 0 14px 0; font-weight: 700; color: #0f172a;">The CodeDiary Team</p>
            <p style="margin: 0; font-size: 12px;">
              Connect with founder Rahul Ranjan on <a href="https://www.linkedin.com/in/rahul-ranjan-6b2ab424a/" target="_blank" style="color: #0a66c2; font-weight: 700; text-decoration: none;">LinkedIn &rarr;</a>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 28px; text-align: center; font-size: 11px; color: #94a3b8;">
          Copyright &copy; ${new Date().getFullYear()} CodeDiary. All rights reserved.
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

// 2. Send Bigger, Professional Welcome Email with Logo & Founder's LinkedIn
export async function sendWelcomeEmail(toEmail, username) {
  const { transporter, from, user } = getTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to CodeDiary</title>
    </head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; color: #1e293b; line-height: 1.65; margin: 0; padding: 24px;">
      <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
        
        <!-- Top Header Banner with Logo -->
        <div style="background: linear-gradient(135deg, #0284c7 0%, #4f46e5 100%); padding: 32px 28px; text-align: center; color: #ffffff;">
          <img src="https://kodediary.vercel.app/icon.png" alt="CodeDiary Logo" style="width: 56px; height: 56px; border-radius: 14px; background: #ffffff; padding: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: block; margin: 0 auto 12px auto;" />
          <h1 style="font-size: 26px; font-weight: 800; margin: 0 0 4px 0; letter-spacing: -0.5px; color: #ffffff;">CodeDiary</h1>
          <p style="font-size: 13px; margin: 0; opacity: 0.9; font-weight: 500;">Your Personal Developer Workspace & Learning Platform</p>
        </div>

        <!-- Main Content Body -->
        <div style="padding: 36px 32px;">
          <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 16px;">
            Welcome aboard, ${username || 'Developer'}! 🎉
          </h2>

          <p style="font-size: 15px; color: #334155; margin-bottom: 18px; line-height: 1.7;">
            Your email address (<strong style="color: #0284c7;">${toEmail}</strong>) has been successfully verified, and your CodeDiary developer account is now active and fully ready for use.
          </p>

          <p style="font-size: 14px; color: #475569; margin-bottom: 20px; line-height: 1.7;">
            CodeDiary is designed to help you organize your daily programming learning, master Data Structures & Algorithms, write structured notes, and track your progress in one unified platform.
          </p>

          <!-- Feature Bullet Highlights -->
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px 24px; margin-bottom: 28px;">
            <p style="font-size: 13px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">What you can do in your workspace:</p>
            
            <div style="margin-bottom: 12px; font-size: 14px; color: #334155;">
              <strong style="color: #0284c7;">&bull; Structured Curriculum:</strong> Practice DSA, Core Java, Web Development, and System Design.
            </div>
            <div style="margin-bottom: 12px; font-size: 14px; color: #334155;">
              <strong style="color: #6366f1;">&bull; Code Editor & Sharing:</strong> Write, format, and share code snippets with fellow developers.
            </div>
            <div style="font-size: 14px; color: #334155;">
              <strong style="color: #10b981;">&bull; Daily Progress & Notes:</strong> Track your learning streak, take structured notes, and monitor your stats.
            </div>
          </div>

          <!-- Log In Button -->
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://kodediary.vercel.app/login" target="_blank" style="background: linear-gradient(135deg, #0284c7 0%, #4f46e5 100%); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 32px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);">
              Log In To Your Workspace &rarr;
            </a>
          </div>

          <!-- Signature Section -->
          <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 32px;">
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #475569;">Warm regards,</p>
            <p style="margin: 0 0 20px 0; font-size: 15px; font-weight: 700; color: #0f172a;">The CodeDiary Team</p>

            <!-- Founder LinkedIn Box -->
            <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 14px; padding: 16px 20px; margin-top: 20px;">
              <div style="margin-bottom: 8px;">
                <p style="margin: 0 0 2px 0; font-size: 13px; font-weight: 800; color: #0369a1;">Connect with Rahul Ranjan (Founder)</p>
                <p style="margin: 0; font-size: 12px; color: #0284c7;">Have feedback, feature ideas, or questions? Let's connect!</p>
              </div>
              <div style="margin-top: 10px;">
                <a href="https://www.linkedin.com/in/rahul-ranjan-6b2ab424a/" target="_blank" style="background-color: #0a66c2; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 700; padding: 8px 16px; border-radius: 8px; display: inline-block;">
                  Connect on LinkedIn &rarr;
                </a>
              </div>
            </div>

          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center; font-size: 12px; color: #94a3b8;">
          <p style="margin: 0 0 6px 0;">CodeDiary &bull; Developer Workspace & Learning Platform</p>
          <p style="margin: 0;">Copyright &copy; ${new Date().getFullYear()} CodeDiary. All rights reserved.</p>
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
