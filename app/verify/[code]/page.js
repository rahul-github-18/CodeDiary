"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import CertificatePreview from '@/components/CertificatePreview';
import { certificateService } from '@/lib/api';
import { generateCertificatePDF } from '@/lib/certificateExport';

export default function VerifyCertificatePage() {
  const params = useParams() || {};
  const { code } = params;

  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!code) return;

    setLoading(true);
    setError('');

    certificateService.verifyCertificate(code)
      .then((data) => {
        if (data && (data.certificate_no || data.recipient_name)) {
          setCert(data);
        } else {
          setError('Certificate record not found. Please verify the certificate ID.');
        }
      })
      .catch((err) => {
        console.error("Verification error:", err);
        setError('Could not verify certificate. Record not found.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [code]);

  const handleDownloadPDF = async () => {
    if (!cert) return;
    setDownloading(true);
    try {
      await generateCertificatePDF({
        recipientName: cert.recipient_name,
        courseTitle: cert.topic_title || 'Course',
        category: cert.category || 'Algorithms',
        difficulty: cert.difficulty || 'Medium',
        lessonsCount: cert.lessons_count || 18,
        topicId: cert.topic_id || null
      });
    } catch (err) {
      console.error("Failed to generate PDF from verification page:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Layout>
      <div style={{
        maxWidth: '920px',
        margin: '20px auto 40px auto',
        padding: '0 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted, #64748b)', fontSize: '1.1rem' }}>
            Verifying certificate authenticity...
          </div>
        ) : error || !cert ? (
          <div style={{
            width: '100%',
            maxWidth: '520px',
            textAlign: 'center',
            padding: '32px 24px',
            backgroundColor: 'var(--card-bg, #ffffff)',
            border: '1px solid var(--card-border, #e2e8f0)',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              padding: '16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '0.95rem',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              {error || 'Certificate record not found.'}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted, #64748b)', margin: 0 }}>
              Searched Verification Code: <strong>{code}</strong>
            </p>
          </div>
        ) : (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            {/* Top Verified Header Bar */}
            <div style={{
              width: '100%',
              backgroundColor: 'var(--card-bg, #ffffff)',
              border: '1px solid var(--card-border, #e2e8f0)',
              borderRadius: '12px',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  padding: '6px 14px',
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #10b981',
                  borderRadius: '6px',
                  color: '#059669',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  letterSpacing: '0.5px'
                }}>
                  ✓ OFFICIALLY VERIFIED CERTIFICATE
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted, #64748b)' }}>
                  ID: <strong style={{ fontFamily: 'monospace', color: 'var(--text-heading, #0f172a)' }}>{cert.certificate_no}</strong>
                </span>
              </div>

              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                style={{
                  padding: '10px 22px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: downloading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
                }}
              >
                {downloading ? 'Downloading...' : 'Download Certificate (PDF)'}
              </button>
            </div>

            {/* Visual Certificate Rendering */}
            <div style={{ width: '100%', overflowX: 'auto', padding: '4px 0' }}>
              <CertificatePreview cert={cert} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
