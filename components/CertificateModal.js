"use client";

import React, { useState, useEffect } from 'react';
import { generateCertificatePDF } from '@/lib/certificateExport';

export default function CertificateModal({
  isOpen,
  onClose,
  topic,
  user
}) {
  const [fullName, setFullName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Pre-fill user's name from account if available
      const defaultName = user?.name || user?.username || (user?.email ? user.email.split('@')[0] : '');
      setFullName(defaultName || '');
      setError('');
      setSuccess('');
    }
  }, [isOpen, user]);

  if (!isOpen || !topic) return null;

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your Full Name to be printed on the certificate.');
      return;
    }

    setError('');
    setGenerating(true);

    try {
      await generateCertificatePDF({
        recipientName: fullName.trim(),
        courseTitle: topic.title,
        category: topic.category,
        difficulty: topic.difficulty,
        topicId: topic.id
      });

      setSuccess('Certificate downloaded successfully!');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Failed to generate certificate PDF. Please try again.');
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
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'var(--card-bg, #ffffff)',
          color: 'var(--text-color, #0f172a)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--card-border, #e2e8f0)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          padding: '28px 24px',
          textAlign: 'center',
          color: '#ffffff',
          position: 'relative'
        }}>
          <div style={{
            fontSize: '2.8rem',
            lineHeight: 1,
            marginBottom: '8px',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
          }}>
            🎓
          </div>
          <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Course Completion Certificate
          </h3>
          <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: '#e0f2fe', opacity: 0.95 }}>
            Congratulations on completing 100% of this course!
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleDownload} style={{ padding: '24px' }}>
          {error && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
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
              borderRadius: '8px',
              color: '#059669',
              fontSize: '0.85rem',
              marginBottom: '16px',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              {success}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
              Course Title
            </label>
            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-heading, #0f172a)' }}>
              {topic.title}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label 
              htmlFor="certificateFullNameInput"
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-heading, #0f172a)', marginBottom: '8px' }}
            >
              Enter Your Full Name for Certificate <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="certificateFullNameInput"
              type="text"
              className="form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Rahul Ranjan"
              required
              autoFocus
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '1.5px solid var(--card-border, #cbd5e1)',
                backgroundColor: 'var(--input-bg, #ffffff)',
                color: 'var(--text-color, #0f172a)',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <p style={{ margin: '6px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
              This exact name will be prominently printed on your official Certificate of Completion.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={generating}
              style={{ padding: '10px 18px', fontSize: '0.85rem', fontWeight: '600' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={generating}
              style={{
                padding: '10px 22px',
                fontSize: '0.85rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: generating ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {generating ? (
                <>
                  <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙</span> Generating PDF...
                </>
              ) : (
                <>
                  <span>🎓</span> Download Certificate
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
