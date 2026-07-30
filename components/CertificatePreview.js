"use client";

import React from 'react';

export default function CertificatePreview({ cert }) {
  if (!cert) return null;

  const recipientName = cert.recipient_name || cert.name || 'Rahul Ranjan';
  const courseTitle = cert.topic_title || cert.courseTitle || 'Binary Search';
  const category = cert.category || 'Algorithms';
  const difficulty = cert.difficulty || 'Medium';
  const lessonsCount = cert.lessons_count || cert.lessonsCount || 18;
  const certId = cert.certificate_no || cert.certId || 'CD-ALG-BS-2026-000018';
  const issueDate = cert.issue_date 
    ? new Date(cert.issue_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

  const verifyUrl = `https://kodediary.vercel.app/verify/${certId}`;
  const qrCodeImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}&color=16213E&bgcolor=FAFAF7`;

  return (
    <div style={{
      width: '100%',
      maxWidth: '860px',
      margin: '0 auto',
      aspectRatio: '297 / 210',
      backgroundColor: '#FAFAF7',
      color: '#16213E',
      fontFamily: "'Times New Roman', Times, serif",
      position: 'relative',
      boxSizing: 'border-box',
      padding: '24px',
      boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.25)',
      borderRadius: '4px',
      border: '4px solid #16213E', // Outer Navy Border
      outline: '1.5px solid #C59D2A', // Middle Gold Accent
      outlineOffset: '-6px',
      overflow: 'hidden'
    }}>
      {/* Inner Navy Border */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        right: '10px',
        bottom: '10px',
        border: '1px solid #16213E',
        pointerEvents: 'none'
      }} />

      {/* Decorative Gold Corner Bracket Ornaments */}
      <div style={{ position: 'absolute', top: '14px', left: '14px', width: '20px', height: '20px', borderTop: '2px solid #C59D2A', borderLeft: '2px solid #C59D2A' }} />
      <div style={{ position: 'absolute', top: '14px', right: '14px', width: '20px', height: '20px', borderTop: '2px solid #C59D2A', borderRight: '2px solid #C59D2A' }} />
      <div style={{ position: 'absolute', bottom: '14px', left: '14px', width: '20px', height: '20px', borderBottom: '2px solid #C59D2A', borderLeft: '2px solid #C59D2A' }} />
      <div style={{ position: 'absolute', bottom: '14px', right: '14px', width: '20px', height: '20px', borderBottom: '2px solid #C59D2A', borderRight: '2px solid #C59D2A' }} />

      {/* Watermark Logo (Center background 4% opacity) */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0.04,
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <img src="/logo.png" alt="" style={{ width: '240px', height: 'auto' }} onError={(e) => { e.target.style.display = 'none'; }} />
      </div>

      {/* Certificate Content Container */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'center',
        padding: '8px 16px'
      }}>

        {/* Top Header */}
        <div>
          <img 
            src="/logo.png" 
            alt="CodeDiary" 
            style={{ height: '36px', width: 'auto', marginBottom: '4px' }} 
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <h2 style={{
            margin: 0,
            fontSize: '1rem',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: '800',
            color: '#16213E',
            letterSpacing: '0.5px'
          }}>
            CodeDiary
          </h2>
          
          <h1 style={{
            margin: '4px 0 2px 0',
            fontSize: '1.6rem',
            fontWeight: '800',
            color: '#16213E',
            letterSpacing: '1px'
          }}>
            CERTIFICATE OF COMPLETION
          </h1>

          {/* Gold Divider */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '6px auto 8px auto', width: '120px' }}>
            <div style={{ flex: 1, height: '1.5px', backgroundColor: '#C59D2A' }} />
            <div style={{ width: '5px', height: '5px', backgroundColor: '#C59D2A', transform: 'rotate(45deg)', margin: '0 4px' }} />
            <div style={{ flex: 1, height: '1.5px', backgroundColor: '#C59D2A' }} />
          </div>

          <p style={{
            margin: 0,
            fontSize: '0.8rem',
            fontStyle: 'italic',
            color: '#C59D2A'
          }}>
            This Certificate is Proudly Presented To
          </p>

          {/* Student Name */}
          <h2 style={{
            margin: '6px 0 0 0',
            fontSize: '1.8rem',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: '900',
            color: '#16213E'
          }}>
            {recipientName}
          </h2>
          <div style={{ width: '160px', height: '1.5px', backgroundColor: '#C59D2A', margin: '4px auto 10px auto' }} />

          {/* Body Paragraph 1 */}
          <p style={{
            margin: '0 auto',
            maxWidth: '680px',
            fontSize: '0.72rem',
            lineHeight: 1.4,
            color: '#475569'
          }}>
            In recognition of your dedication, commitment, and successful completion of all required learning modules, coding exercises, quizzes, practical assignments, and final assessments, this certificate is awarded as evidence of demonstrated proficiency in the following course.
          </p>

          {/* Course Name */}
          <h3 style={{
            margin: '8px 0',
            fontSize: '1.25rem',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: '800',
            color: '#2563EB'
          }}>
            {courseTitle}
          </h3>

          {/* Body Paragraph 2 */}
          <p style={{
            margin: '0 auto 10px auto',
            maxWidth: '680px',
            fontSize: '0.68rem',
            lineHeight: 1.35,
            color: '#475569'
          }}>
            This achievement certifies that the recipient has successfully mastered the fundamental concepts, implementation techniques, problem-solving strategies, and practical applications covered throughout the course while meeting the academic standards established by CodeDiary.
          </p>

          {/* Metadata Bar */}
          <div style={{
            backgroundColor: '#F5F3EB',
            border: '1px solid #C59D2A',
            borderRadius: '4px',
            padding: '4px 12px',
            display: 'inline-block',
            fontSize: '0.65rem',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: '700',
            color: '#16213E'
          }}>
            Category: {category} &nbsp;|&nbsp; Difficulty: {difficulty} &nbsp;|&nbsp; Lessons Completed: {lessonsCount} &nbsp;|&nbsp; Final Assessment: Passed &nbsp;|&nbsp; Status: 100%
          </div>
        </div>

        {/* Bottom 3-Column Footer Section */}
        <div style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          alignItems: 'end',
          margin: '12px 0 6px 0',
          textAlign: 'left'
        }}>
          {/* Left Column: Issue Date & Cert ID */}
          <div style={{ paddingLeft: '8px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#16213E', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Date of Issue
            </div>
            <div style={{ fontSize: '0.7rem', color: '#475569', fontFamily: 'system-ui, -apple-system, sans-serif', marginBottom: '6px' }}>
              {issueDate}
            </div>

            <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#16213E', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Certificate ID
            </div>
            <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: '700', color: '#2563EB' }}>
              {certId}
            </div>
          </div>

          {/* Center Column: Signature */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontFamily: "'Times New Roman', Times, serif", fontStyle: 'italic', fontWeight: '700', color: '#16213E', marginBottom: '2px' }}>
              Rahul Ranjan
            </div>
            <div style={{ width: '110px', height: '1px', backgroundColor: '#C59D2A', margin: '0 auto 4px auto' }} />
            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#16213E', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Rahul Ranjan
            </div>
            <div style={{ fontSize: '0.6rem', color: '#475569', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Founder & Academic Director
            </div>
            <div style={{ fontSize: '0.6rem', fontWeight: '700', color: '#C59D2A', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              CodeDiary
            </div>
          </div>

          {/* Right Column: Embossed Seal & QR Code */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', paddingRight: '8px' }}>
            {/* Gold Seal */}
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: '#FDF8E8',
              border: '2px solid #C59D2A',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              boxShadow: 'inset 0 0 0 1.5px #C59D2A'
            }}>
              <span style={{ fontSize: '0.5rem', fontWeight: '800', color: '#C59D2A', fontFamily: 'system-ui, -apple-system, sans-serif' }}>✓ VERIFIED</span>
              <span style={{ fontSize: '0.42rem', fontWeight: '700', color: '#16213E', fontFamily: 'system-ui, -apple-system, sans-serif' }}>CodeDiary Certified</span>
              <span style={{ fontSize: '0.38rem', color: '#475569', fontFamily: 'system-ui, -apple-system, sans-serif' }}>Authenticity Guaranteed</span>
            </div>

            {/* QR Code */}
            <div style={{ textAlign: 'center' }}>
              <img 
                src={qrCodeImgUrl} 
                alt="QR Verification" 
                style={{ width: '46px', height: '46px', display: 'block', margin: '0 auto' }} 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span style={{ display: 'block', fontSize: '0.45rem', fontWeight: '800', color: '#16213E', fontFamily: 'system-ui, -apple-system, sans-serif', marginTop: '2px' }}>
                Scan to Verify
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Contact Footer Line */}
        <div style={{
          width: '100%',
          borderTop: '1px solid #C59D2A',
          paddingTop: '4px',
          fontSize: '0.55rem',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#475569'
        }}>
          Website: https://kodediary.vercel.app &nbsp;&bull;&nbsp; LinkedIn: https://www.linkedin.com/in/rahul-ranjan-6b2ab424a/ &nbsp;&bull;&nbsp; Email: support@codediary.com
        </div>

      </div>
    </div>
  );
}
