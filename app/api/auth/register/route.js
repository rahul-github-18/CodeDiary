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

    if (username.trim().toLowerCase() === 'admin') {
      console.timeEnd('API: POST /api/auth/register');
      return NextResponse.json({ message: 'Cannot register with the username "admin"' }, { status: 400 });
    }

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
          // Clean up used OTP
          await supabase.from('otp_codes').delete().eq('email', cleanEmail);
        }
      } catch (e) {
        console.warn('Supabase OTP check fallback:', e.message);
      }
    }

    if (!isOtpValid) {
      console.timeEnd('API: POST /api/auth/register');
      return NextResponse.json(
        { message: 'Invalid or expired OTP code. Please check your email and enter the correct code.' },
        { status: 400 }
      );
    }

    // 2. Check if user already exists
    console.time('Supabase: Check user existence (register)');
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username.trim())
      .maybeSingle();
    console.timeEnd('Supabase: Check user existence (register)');

    if (checkError) throw checkError;

    if (existingUser) {
      console.timeEnd('API: POST /api/auth/register');
      return NextResponse.json({ message: 'Username is already taken' }, { status: 400 });
    }

    // 3. Insert user
    console.time('Supabase: Insert User (register)');
    const userPayload = {
      username: username.trim(),
      password: password,
      role: 'user',
      approved: true,
      can_view: true,
      can_edit: false,
      can_delete: false
    };
    if (email) {
      userPayload.email = email.trim();
    }

    let { error: insertError } = await supabase
      .from('users')
      .insert(userPayload);

    // Fallback if email column does not exist in DB yet
    if (insertError && insertError.message && insertError.message.toLowerCase().includes('email')) {
      delete userPayload.email;
      const fallback = await supabase
        .from('users')
        .insert(userPayload);
      insertError = fallback.error;
    }
    console.timeEnd('Supabase: Insert User (register)');

    if (insertError) throw insertError;

    console.timeEnd('API: POST /api/auth/register');
    return NextResponse.json(
      { message: 'Registration and OTP verification successful! Your account is now active.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    console.timeEnd('API: POST /api/auth/register');
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
