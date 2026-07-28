import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendOtpEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

// In-memory fallback store for OTP codes with expiration
const memoryOtpStore = new Map();

// Helper to clean up expired OTPs from memory store
function cleanupMemoryStore() {
  const now = Date.now();
  for (const [email, data] of memoryOtpStore.entries()) {
    if (now > data.expiresAt) {
      memoryOtpStore.delete(email);
    }
  }
}

export async function POST(req) {
  try {
    const { email, username, password } = await req.json();

    if (!username || !username.trim()) {
      return NextResponse.json({ message: 'Username is required' }, { status: 400 });
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return NextResponse.json({ message: 'Valid email address is required' }, { status: 400 });
    }

    if (username.trim().toLowerCase() === 'admin') {
      return NextResponse.json({ message: 'Cannot register with username "admin"' }, { status: 400 });
    }

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Clean up memory store
    cleanupMemoryStore();

    // 1. Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, username, approved')
      .eq('username', cleanUsername)
      .maybeSingle();

    if (existingUser && existingUser.approved) {
      return NextResponse.json({ message: 'Username is already registered and approved. Please log in.' }, { status: 400 });
    }

    // 2. Insert or update user in `users` table with approved: false (Pending OTP or Manual Admin Approval)
    const userPayload = {
      username: cleanUsername,
      password: password || '1234',
      role: 'user',
      approved: false, // Set to false so admin can manually approve if OTP fails!
      can_view: true,
      can_edit: false,
      can_delete: false,
      email: cleanEmail
    };

    if (existingUser) {
      // Update pending user password & email
      let { error: updateError } = await supabase
        .from('users')
        .update(userPayload)
        .eq('id', existingUser.id);

      if (updateError && updateError.message && updateError.message.toLowerCase().includes('email')) {
        delete userPayload.email;
        await supabase.from('users').update(userPayload).eq('id', existingUser.id);
      }
    } else {
      // Insert new pending user with approved = false
      let { error: insertError } = await supabase
        .from('users')
        .insert(userPayload);

      if (insertError && insertError.message && insertError.message.toLowerCase().includes('email')) {
        delete userPayload.email;
        await supabase.from('users').insert(userPayload);
      }
    }

    // 3. Generate OTP & Store in DB / memory (10 Minute Expiration)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const nowMs = Date.now();
    const expiresAtMs = nowMs + 10 * 60 * 1000; // Exactly 10 minutes
    const expiresAtIso = new Date(expiresAtMs).toISOString();

    memoryOtpStore.set(cleanEmail, { code: otpCode, expiresAt: expiresAtMs });

    // Store in Supabase and delete any expired OTP codes from database
    try {
      // Delete old/expired OTPs for this email or past 10 minutes
      await supabase.from('otp_codes').delete().eq('email', cleanEmail);
      await supabase.from('otp_codes').delete().lt('expires_at', new Date(nowMs).toISOString());
      
      let { error: insertOtpErr } = await supabase.from('otp_codes').insert({ 
        email: cleanEmail, 
        code: otpCode,
        expires_at: expiresAtIso
      });

      // Fallback if expires_at column is not present in DB schema yet
      if (insertOtpErr && insertOtpErr.message && insertOtpErr.message.toLowerCase().includes('expires_at')) {
        await supabase.from('otp_codes').insert({ email: cleanEmail, code: otpCode });
      }
    } catch (e) {
      console.warn('Supabase otp_codes insert ignored:', e.message);
    }

    // 4. Send Email via SMTP
    const emailResult = await sendOtpEmail(cleanEmail, otpCode, cleanUsername);

    return NextResponse.json({
      message: `Verification OTP code sent to ${cleanEmail}. Account saved (Pending OTP or Admin approval).`,
      sent: emailResult.sent
    }, { status: 200 });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ message: 'Failed to process registration request' }, { status: 500 });
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
  const isMatch = stored.code === String(otp).trim();
  if (isMatch) {
    memoryOtpStore.delete(cleanEmail); // Remove immediately after successful verification
  }
  return isMatch;
}
