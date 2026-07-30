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
      setError('Please enter your name.');
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
        lessonsCount: topic.lessons_count || topic.total_questions || 18,
        problemsCount: topic.problems_count || (topic.total_questions ? topic.total_questions * 8 : 120),
        topicId: topic.id
      });

      setSuccess('Certificate generated successfully!');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Download error:", err);
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
            Download Certificate
          </h3>
        </div>

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
              {generating ? 'Generating...' : 'Download Certificate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
