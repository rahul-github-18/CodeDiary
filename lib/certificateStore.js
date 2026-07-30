import { supabase } from './supabase';

// In-memory fallback cache when Supabase database table is initializing or offline
const memoryStore = new Map();

export async function getCertificateByUserAndTopic(userId, topicId) {
  const cacheKey = `${userId}_${topicId}`;
  
  // 1. Try fetching from Supabase DB
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .maybeSingle();

    if (!error && data) {
      memoryStore.set(cacheKey, data);
      memoryStore.set(data.certificate_no, data);
      return data;
    }
  } catch (e) {
    console.warn('[CertificateStore] Supabase query fallback:', e);
  }

  // 2. Fallback to memory store
  return memoryStore.get(cacheKey) || null;
}

export async function getCertificateByCode(certificateNo) {
  if (!certificateNo) return null;

  // 1. Try fetching from Supabase DB
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('certificate_no', certificateNo)
      .maybeSingle();

    if (!error && data) {
      const cacheKey = `${data.user_id}_${data.topic_id}`;
      memoryStore.set(cacheKey, data);
      memoryStore.set(data.certificate_no, data);
      return data;
    }
  } catch (e) {
    console.warn('[CertificateStore] Supabase code query fallback:', e);
  }

  // 2. Fallback to memory store
  return memoryStore.get(certificateNo) || null;
}

export async function saveCertificate(certData) {
  const cacheKey = `${certData.user_id}_${certData.topic_id}`;
  let savedCert = { ...certData };

  // 1. Try saving to Supabase DB
  try {
    const { data, error } = await supabase
      .from('certificates')
      .upsert(certData, { onConflict: 'user_id,topic_id' })
      .select('*')
      .single();

    if (!error && data) {
      savedCert = data;
    } else if (error) {
      console.warn('[CertificateStore] Supabase save warning:', error.message);
    }
  } catch (e) {
    console.warn('[CertificateStore] Supabase save fallback:', e);
  }

  // 2. Save in memory store
  memoryStore.set(cacheKey, savedCert);
  memoryStore.set(savedCert.certificate_no, savedCert);
  return savedCert;
}
