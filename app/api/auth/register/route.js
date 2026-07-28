import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyInMemoryOtp } from '@/app/api/auth/send-otp/route';
import { sendWelcomeEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  console.time('API: POST /api/auth/register');
  try {
    const { username, email, password, otp } = await req.json();

    if (!username || !password) {
      console.timeEnd('API: POST /api/auth/register');
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    if (!otp || !String(otp).trim()) {
      console.timeEnd('API: POST /api/auth/register');
      return NextResponse.json({ message: 'OTP verification code is required' }, { status: 400 });
    }

    const cleanUsername = username.trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    // 1. Verify OTP code & check expiration
    let isOtpValid = verifyInMemoryOtp(cleanEmail, cleanOtp);

    if (!isOtpValid && cleanEmail) {
      try {
        // Delete all expired OTPs from database (older than 10 mins)
        const nowIso = new Date().toISOString();
        await supabase.from('otp_codes').delete().lt('expires_at', nowIso);

        const { data: dbOtp } = await supabase
          .from('otp_codes')
          .select('*')
          .eq('email', cleanEmail)
          .eq('code', cleanOtp)
          .maybeSingle();

        if (dbOtp) {
          // Check if DB OTP is expired (> 10 minutes old)
          if (dbOtp.expires_at && new Date(dbOtp.expires_at).getTime() < Date.now()) {
            isOtpValid = false;
          } else {
            isOtpValid = true;
          }
          // Remove OTP from database immediately after use/verification
          await supabase.from('otp_codes').delete().eq('email', cleanEmail);
        }
      } catch (e) {
        console.warn('Supabase OTP check fallback:', e.message);
      }
    }

    if (!isOtpValid) {
      console.timeEnd('API: POST /api/auth/register');
      return NextResponse.json(
        { message: 'Invalid or expired OTP code (OTPs expire after 10 minutes). Your registration request remains saved in pending users for manual Admin approval.' },
        { status: 400 }
      );
    }

    // 2. OTP is valid -> Update user in `users` table to approved: true
    console.time('Supabase: Approve User (register)');
    const { error: updateError } = await supabase
      .from('users')
      .update({ approved: true })
      .eq('username', cleanUsername);
    console.timeEnd('Supabase: Approve User (register)');

    if (updateError) {
      // Fallback if user row wasn't found, insert it with approved = true
      const userPayload = {
        username: cleanUsername,
        password: password,
        role: 'user',
        approved: true,
        can_view: true,
        can_edit: false,
        can_delete: false,
        email: cleanEmail
      };
      let { error: insertError } = await supabase.from('users').insert(userPayload);
      if (insertError && insertError.message && insertError.message.toLowerCase().includes('email')) {
        delete userPayload.email;
        await supabase.from('users').insert(userPayload);
      }
    }

    // 3. Send Registration Successful Welcome Email via SMTP
    if (cleanEmail) {
      sendWelcomeEmail(cleanEmail, cleanUsername).catch(err => {
        console.error('Failed to send welcome email:', err);
      });
    }

    console.timeEnd('API: POST /api/auth/register');
    return NextResponse.json(
      { message: 'Registration and OTP verification successful! Welcome email sent to your inbox.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    console.timeEnd('API: POST /api/auth/register');
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
