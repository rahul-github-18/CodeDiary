"use client";

import React, { useState, useEffect } from 'react';
import { generateCertificatePDF } from '@/lib/certificateExport';
import { certificateService } from '@/lib/api';

export default function CertificateModal({
  isOpen,
  onClose,
  topic,
  user
}) {
  const [fullName, setFullName] = useState('');
  const [existingCert, setExistingCert] = useState(null);
  const [loadingCert, setLoadingCert] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen && topic?.id) {
      setError('');
      setSuccess('');
      setExistingCert(null);
      setLoadingCert(true);

      certificateService.getCertificateByTopic(topic.id)
        .then((cert) => {
          if (cert && cert.certificate_no) {
            setExistingCert(cert);
            setFullName(cert.recipient_name);
          } else {
            const defaultName = user?.name || user?.username || (user?.email ? user.email.split('@')[0] : '');
            setFullName(defaultName || '');
          }
        })
        .catch((err) => {
          console.warn("Error checking existing certificate:", err);
          const defaultName = user?.name || user?.username || (user?.email ? user.email.split('@')[0] : '');
          setFullName(defaultName || '');
        })
        .finally(() => {
          setLoadingCert(false);
        });
    }
  }, [isOpen, topic, user]);

  if (!isOpen || !topic) return null;

  const handleDownload = async (e) => {
    e.preventDefault();
    setError('');

    let certToUse = existingCert;

    if (!certToUse) {
      if (!fullName.trim()) {
        setError('Please enter your name.');
        return;
      }

      setGenerating(true);
      try {
        certToUse = await certificateService.createCertificate({
          topic_id: topic.id,
          recipient_name: fullName.trim(),
          topic_title: topic.title,
          category: topic.category,
          difficulty: topic.difficulty,
          lessons_count: topic.lessons_count || topic.total_questions || 18
        });
        setExistingCert(certToUse);
      } catch (createErr) {
        console.error("Certificate creation error:", createErr);
        setError(createErr.message || 'Failed to issue certificate. Please try again.');
        setGenerating(false);
        return;
      }
    } else {
      setGenerating(true);
    }

    try {
      await generateCertificatePDF({
        recipientName: certToUse.recipient_name,
        courseTitle: certToUse.topic_title || topic.title,
        category: certToUse.category || topic.category,
        difficulty: certToUse.difficulty || topic.difficulty,
        lessonsCount: certToUse.lessons_count || 18,
        topicId: certToUse.topic_id || topic.id
      });

      setSuccess('Certificate downloaded successfully!');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1500);
    } catch (pdfErr) {
      console.error("PDF Export error:", pdfErr);
      setError('Failed to generate PDF document. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(3px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'var(--card-bg, #ffffff)',
          color: 'var(--text-color, #0f172a)',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '460px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          border: '1px solid var(--card-border, #e2e8f0)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: '20px 24px 16px 24px',
          borderBottom: '1px solid var(--card-border, #e2e8f0)'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-heading, #0f172a)' }}>
            {existingCert ? 'Official Certificate Issued' : 'Download Certificate'}
          </h3>
        </div>

        {loadingCert ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted, #64748b)' }}>
            Checking certificate records...
          </div>
        ) : (
          <form onSubmit={handleDownload} style={{ padding: '24px' }}>
            {error && (
              <div style={{
                padding: '10px 14px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                color: '#dc2626',
                fontSize: '0.85rem',
                marginBottom: '16px'
              }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{
                padding: '10px 14px',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '6px',
                color: '#059669',
                fontSize: '0.85rem',
                marginBottom: '16px',
                fontWeight: '600'
              }}>
                {success}
              </div>
            )}

            {existingCert ? (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#059669', fontWeight: '600' }}>
                  ✓ Certificate already issued for this topic.
                </p>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted, #64748b)' }}>
                    Name on Certificate
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={existingCert.recipient_name}
                    disabled
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: '0.95rem',
                      borderRadius: '6px',
                      border: '1px solid var(--card-border, #cbd5e1)',
                      backgroundColor: 'var(--btn-secondary-bg, #f1f5f9)',
                      color: 'var(--text-color, #0f172a)',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                  <span>ID: {existingCert.certificate_no}</span>
                  <span>Issued: {existingCert.issue_date}</span>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '24px' }}>
                <label 
                  htmlFor="certificateNameInput"
                  style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-heading, #0f172a)', marginBottom: '8px' }}
                >
                  Enter Your Name To be printed on certificate <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="certificateNameInput"
                  type="text"
                  className="form-control"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter Your Name"
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '0.95rem',
                    borderRadius: '6px',
                    border: '1px solid var(--card-border, #cbd5e1)',
                    backgroundColor: 'var(--input-bg, #ffffff)',
                    color: 'var(--text-color, #0f172a)',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={generating}
                style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: '600' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={generating}
                style={{
                  padding: '8px 18px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: generating ? 'not-allowed' : 'pointer'
                }}
              >
                {generating ? 'Downloading...' : 'Download Certificate'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
