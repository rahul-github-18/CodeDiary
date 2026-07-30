import { NextResponse } from 'next/server';
import { getCertificateByUserAndTopic } from '@/lib/certificateStore';
import { getCachedUser } from '@/lib/cache';

export const dynamic = 'force-dynamic';

async function checkUser(req) {
  const reqUserId = req.headers.get('x-user-id');
  if (!reqUserId) return null;
  const user = await getCachedUser(reqUserId);
  if (!user || !user.approved) return null;
  return user;
}

export async function GET(req, { params }) {
  try {
    const user = await checkUser(req);
    if (!user) {
      return NextResponse.json({ message: 'Access Denied. Insufficient permissions.' }, { status: 403 });
    }

    const { topicId } = params;
    if (!topicId) {
      return NextResponse.json({ message: 'topicId parameter required' }, { status: 400 });
    }

    const cert = await getCertificateByUserAndTopic(user.id, parseInt(topicId, 10));
    if (!cert) {
      return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
    }

    return NextResponse.json(cert);
  } catch (err) {
    console.error('API Error: GET /api/certificates/topic/[topicId]', err);
    return NextResponse.json({ message: err.message || 'Server Error' }, { status: 500 });
  }
}
