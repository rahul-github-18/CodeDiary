"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/Layout';
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
        maxWidth: '720px',
        margin: '30px auto',
        padding: '0 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          width: '100%',
          backgroundColor: 'var(--card-bg, #ffffff)',
          border: '1px solid var(--card-border, #e2e8f0)',
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {/* Top Banner */}
          <div style={{
            backgroundColor: '#16213E',
            color: '#FAFAF7',
            padding: '24px',
            textAlign: 'center',
            borderBottom: '3px solid #C59D2A'
          }}>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', letterSpacing: '1px' }}>
              CodeDiary
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#C59D2A', fontWeight: '600' }}>
              OFFICIAL CERTIFICATE VERIFICATION SYSTEM
            </p>
          </div>

          {/* Body */}
          <div style={{ padding: '32px 24px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted, #64748b)' }}>
                Verifying certificate authenticity...
              </div>
            ) : error || !cert ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{
                  padding: '16px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '10px',
                  color: '#dc2626',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  marginBottom: '20px'
                }}>
                  {error || 'Certificate not found.'}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted, #64748b)' }}>
                  Verification Code searched: <strong>{code}</strong>
                </p>
              </div>
            ) : (
              <div>
                {/* Verified Badge */}
                <div style={{
                  backgroundColor: '#ecfdf5',
                  border: '1.5px solid #10b981',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  marginBottom: '28px'
                }}>
                  <span style={{
                    display: 'inline-block',
                    fontSize: '0.9rem',
                    fontWeight: '800',
                    color: '#059669',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}>
                    ✓ OFFICIALLY VERIFIED CERTIFICATE
                  </span>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#047857' }}>
                    This certificate is authentic and registered in the CodeDiary certification database.
                  </p>
                </div>

                {/* Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase' }}>
                      Student Name
                    </span>
                    <h3 style={{ margin: '4px 0 0 0', fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-heading, #16213E)' }}>
                      {cert.recipient_name}
                    </h3>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase' }}>
                      Course / Topic
                    </span>
                    <h3 style={{ margin: '4px 0 0 0', fontSize: '1.2rem', fontWeight: '800', color: '#2563EB' }}>
                      {cert.topic_title}
                    </h3>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase' }}>
                      Category & Difficulty
                    </span>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-heading, #0f172a)' }}>
                      {cert.category || 'General'} ({cert.difficulty || 'Medium'})
                    </p>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase' }}>
                      Date of Issue
                    </span>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-heading, #0f172a)' }}>
                      {cert.issue_date || new Date(cert.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase' }}>
                      Certificate ID / Serial Number
                    </span>
                    <p style={{ margin: '4px 0 0 0', fontSize: '1.05rem', fontFamily: 'monospace', fontWeight: '700', color: '#2563EB' }}>
                      {cert.certificate_no}
                    </p>
                  </div>
                </div>

                {/* Download PDF Button */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    onClick={handleDownloadPDF}
                    disabled={downloading}
                    style={{
                      padding: '12px 28px',
                      fontSize: '0.95rem',
                      fontWeight: '700',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: downloading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    {downloading ? 'Generating PDF...' : 'Download Certificate (PDF)'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
