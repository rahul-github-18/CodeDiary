import { NextResponse } from 'next/server';
import { getCertificateByUserAndTopic, saveCertificate } from '@/lib/certificateStore';
import { getCachedUser } from '@/lib/cache';

export const dynamic = 'force-dynamic';

async function checkUser(req) {
  const reqUserId = req.headers.get('x-user-id');
  if (!reqUserId) return null;
  const user = await getCachedUser(reqUserId);
  if (!user || !user.approved) return null;
  return user;
}

const generateCertificateNo = (category, title, topicId) => {
  const catCode = (category || 'ALG').substring(0, 3).toUpperCase();
  const slugCode = (title || 'BS').replace(/[^a-zA-Z]/g, '').substring(0, 2).toUpperCase() || 'BS';
  const year = new Date().getFullYear();
  const randomNum = String(topicId || Math.floor(Math.random() * 90000) + 10000).padStart(6, '0');
  return `CD-${catCode}-${slugCode}-${year}-${randomNum}`;
};

export async function POST(req) {
  try {
    const user = await checkUser(req);
    if (!user) {
      return NextResponse.json({ message: 'Access Denied. Insufficient permissions.' }, { status: 403 });
    }

    const body = await req.json();
    const { topic_id, recipient_name, topic_title, category, difficulty, lessons_count } = body;

    if (!topic_id || !recipient_name) {
      return NextResponse.json({ message: 'topic_id and recipient_name are required' }, { status: 400 });
    }

    // 1. Check if user already generated a certificate for this topic
    const existing = await getCertificateByUserAndTopic(user.id, topic_id);
    if (existing) {
      // User cannot re-generate with a new name! Return existing certificate.
      return NextResponse.json(existing);
    }

    // 2. Generate new certificate record
    const certNo = generateCertificateNo(category, topic_title, topic_id);
    const issueDateStr = new Date().toISOString().split('T')[0];

    const certData = {
      certificate_no: certNo,
      user_id: user.id,
      topic_id: parseInt(topic_id, 10),
      recipient_name: recipient_name.trim(),
      topic_title: topic_title || 'Course',
      category: category || 'General',
      difficulty: difficulty || 'Medium',
      lessons_count: lessons_count || 18,
      issue_date: issueDateStr,
      created_at: new Date().toISOString()
    };

    const saved = await saveCertificate(certData);
    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    console.error('API Error: POST /api/certificates', err);
    return NextResponse.json({ message: err.message || 'Server Error' }, { status: 500 });
  }
}
