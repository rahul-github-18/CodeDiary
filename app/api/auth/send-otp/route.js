import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendOtpEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

// In-memory fallback store for OTP codes with expiration
const memoryOtpStore = new Map();

export async function POST(req) {
  try {
    const { email, username } = await req.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return NextResponse.json({ message: 'Valid email address is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store in memory store
    memoryOtpStore.set(cleanEmail, { code: otpCode, expiresAt });

    // Try storing in Supabase if table exists
    try {
      await supabase.from('otp_codes').delete().eq('email', cleanEmail);
      await supabase.from('otp_codes').insert({ email: cleanEmail, code: otpCode });
    } catch (e) {
      console.warn('Supabase otp_codes insert ignored:', e.message);
    }

    // Send Email via SMTP
    const emailResult = await sendOtpEmail(cleanEmail, otpCode, username);

    return NextResponse.json({
      message: emailResult.sent 
        ? `Verification OTP sent to ${cleanEmail}` 
        : `OTP code generated for ${cleanEmail}`,
      sent: emailResult.sent,
      devOtp: otpCode
    }, { status: 200 });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ message: 'Failed to generate and send OTP' }, { status: 500 });
  }
}

// Export verification helper for server side
export function verifyInMemoryOtp(email, otp) {
  const cleanEmail = String(email).trim().toLowerCase();
  const stored = memoryOtpStore.get(cleanEmail);
  if (!stored) return false;
  if (Date.now() > stored.expiresAt) {
    memoryOtpStore.delete(cleanEmail);
    return false;
  }
  return stored.code === String(otp).trim();
}
