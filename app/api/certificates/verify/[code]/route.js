import { NextResponse } from 'next/server';
import { getCertificateByCode } from '@/lib/certificateStore';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const { code } = params;
    if (!code) {
      return NextResponse.json({ message: 'Certificate code required' }, { status: 400 });
    }

    const cert = await getCertificateByCode(code.trim());
    if (!cert) {
      return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
    }

    return NextResponse.json(cert);
  } catch (err) {
    console.error('API Error: GET /api/certificates/verify/[code]', err);
    return NextResponse.json({ message: err.message || 'Server Error' }, { status: 500 });
  }
}
