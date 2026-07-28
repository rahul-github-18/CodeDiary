import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyInMemoryOtp } from '@/app/api/auth/send-otp/route';

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

    // 1. Verify OTP code
    let isOtpValid = verifyInMemoryOtp(cleanEmail, cleanOtp);

    if (!isOtpValid && cleanEmail) {
      try {
        const { data: dbOtp } = await supabase
          .from('otp_codes')
          .select('*')
          .eq('email', cleanEmail)
          .eq('code', cleanOtp)
          .maybeSingle();

        if (dbOtp) {
          isOtpValid = true;
          await supabase.from('otp_codes').delete().eq('email', cleanEmail);
        }
      } catch (e) {
        console.warn('Supabase OTP check fallback:', e.message);
      }
    }

    if (!isOtpValid) {
      console.timeEnd('API: POST /api/auth/register');
      return NextResponse.json(
        { message: 'Invalid or expired OTP code. Your registration request remains saved in pending users for manual Admin approval.' },
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

    console.timeEnd('API: POST /api/auth/register');
    return NextResponse.json(
      { message: 'Registration and OTP verification successful! Your account is now approved and active.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    console.timeEnd('API: POST /api/auth/register');
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
