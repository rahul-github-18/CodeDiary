// Helper to load logo image safely in browser environment
const loadLogoImage = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(null);
    const logoPaths = ['/light-logo.png', '/logo.png', '/icon.png', '/dark-logo.png'];
    let idx = 0;

    const tryNext = () => {
      if (idx >= logoPaths.length) return resolve(null);
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const insetX = Math.floor(img.width * 0.05);
          const insetY = Math.floor(img.height * 0.05);
          const cropW = img.width - (insetX * 2);
          const cropH = img.height - (insetY * 2);

          canvas.width = cropW;
          canvas.height = cropH;

          ctx.drawImage(img, insetX, insetY, cropW, cropH, 0, 0, cropW, cropH);

          const croppedImg = new Image();
          croppedImg.crossOrigin = 'Anonymous';
          croppedImg.onload = () => resolve(croppedImg);
          croppedImg.onerror = () => resolve(img);
          croppedImg.src = canvas.toDataURL('image/png');
        } catch (e) {
          resolve(img);
        }
      };
      img.onerror = () => {
        idx++;
        tryNext();
      };
      img.src = logoPaths[idx];
    };
    tryNext();
  });
};

// Generate a random certificate verification code
const generateCertificateId = (topicId) => {
  const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
  const year = new Date().getFullYear();
  return `CD-CERT-${topicId || '00'}-${randomHex}-${year}`;
};

/**
 * Generates and downloads an elegant landscape PDF certificate of completion.
 */
export const generateCertificatePDF = async ({
  recipientName = 'Valued Student',
  courseTitle = 'Course',
  category = 'General',
  difficulty = 'Easy',
  topicId = null
}) => {
  try {
    const { jsPDF } = await import('jspdf');
    const logoImg = await loadLogoImage();

    // Create Landscape A4 PDF: 297mm width x 210mm height
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 297;
    const pageHeight = 210;

    // --- 1. Background Fill ---
    doc.setFillColor(253, 253, 254);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // --- 2. Outer & Inner Frame Borders ---
    // Outer Navy Border
    doc.setDrawColor(15, 23, 42); // #0f172a (Deep Navy)
    doc.setLineWidth(1.5);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

    // Inner Gold Accent Border
    doc.setDrawColor(217, 119, 6); // #d97706 (Amber/Gold)
    doc.setLineWidth(0.6);
    doc.rect(11, 11, pageWidth - 22, pageHeight - 22);

    // Thin Navy Framing Line
    doc.setDrawColor(30, 58, 138); // #1e3a8a
    doc.setLineWidth(0.2);
    doc.rect(12.5, 12.5, pageWidth - 25, pageHeight - 25);

    // Corner Decorative Motifs (Top-Left, Top-Right, Bottom-Left, Bottom-Right)
    const drawCornerOrnament = (x, y, scaleX = 1, scaleY = 1) => {
      doc.setDrawColor(217, 119, 6);
      doc.setLineWidth(0.8);
      doc.line(x, y, x + (12 * scaleX), y);
      doc.line(x, y, x, y + (12 * scaleY));
      doc.setLineWidth(0.3);
      doc.line(x + (2 * scaleX), y + (2 * scaleY), x + (10 * scaleX), y + (2 * scaleY));
      doc.line(x + (2 * scaleX), y + (2 * scaleY), x + (2 * scaleX), y + (10 * scaleY));
    };

    drawCornerOrnament(14, 14, 1, 1);
    drawCornerOrnament(pageWidth - 14, 14, -1, 1);
    drawCornerOrnament(14, pageHeight - 14, 1, -1);
    drawCornerOrnament(pageWidth - 14, pageHeight - 14, -1, -1);

    // --- 3. Top Header: Branding & Logo ---
    let headerY = 25;
    const centerX = pageWidth / 2;

    if (logoImg) {
      const logoW = 16;
      const logoH = (logoW * logoImg.height) / logoImg.width;
      doc.addImage(logoImg, 'PNG', centerX - (logoW / 2), headerY, logoW, logoH);
      headerY += logoH + 4;
    } else {
      headerY += 4;
    }

    // Platform Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 138); // Navy
    doc.text("C O D E D I A R Y   L E A R N I N G   A C A D E M Y", centerX, headerY, { align: 'center' });
    headerY += 10;

    // Certificate Heading
    doc.setFont('times', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(15, 23, 42); // Deep slate
    doc.text("CERTIFICATE OF COMPLETION", centerX, headerY, { align: 'center' });
    headerY += 6;

    // Subtitle Line / Gold Ribbon Accent
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.8);
    doc.line(centerX - 35, headerY, centerX + 35, headerY);
    
    // Small diamond in center
    doc.setFillColor(217, 119, 6);
    doc.polygon([
      { x: centerX, y: headerY - 1.5 },
      { x: centerX + 2, y: headerY },
      { x: centerX, y: headerY + 1.5 },
      { x: centerX - 2, y: headerY }
    ], 'F');
    headerY += 10;

    // --- 4. Presentation Text ---
    doc.setFont('times', 'italic');
    doc.setFontSize(13);
    doc.setTextColor(100, 116, 139); // Muted slate
    doc.text("This is proudly presented to", centerX, headerY, { align: 'center' });
    headerY += 14;

    // --- 5. Recipient Name ---
    const cleanName = (recipientName || 'Valued Student').trim();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(15, 23, 42); // Rich Dark
    doc.text(cleanName, centerX, headerY, { align: 'center' });
    headerY += 4;

    // Name Underline Flourish
    const nameWidth = Math.max(doc.getTextWidth(cleanName) + 20, 70);
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.6);
    doc.line(centerX - (nameWidth / 2), headerY, centerX + (nameWidth / 2), headerY);
    headerY += 11;

    // --- 6. Achievement Statement ---
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(71, 85, 105);
    doc.text("for successfully mastering all curriculum topics, exercises, and problem sets for", centerX, headerY, { align: 'center' });
    headerY += 10;

    // --- 7. Course Title ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(26, 115, 232); // Vibrant Blue
    const maxCourseWidth = 200;
    const wrappedCourse = doc.splitTextToSize(courseTitle || 'Coding Course', maxCourseWidth);
    wrappedCourse.forEach((line) => {
      doc.text(line, centerX, headerY, { align: 'center' });
      headerY += 8;
    });

    // Category / Difficulty Pills
    headerY += 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    const metaText = `CATEGORY: ${String(category).toUpperCase()}   |   LEVEL: ${String(difficulty).toUpperCase()}`;
    doc.text(metaText, centerX, headerY, { align: 'center' });
    headerY += 14;

    // --- 8. Gold Verified Seal (Right Side) ---
    const sealX = pageWidth - 42;
    const sealY = pageHeight - 46;

    // Seal Outer Gold Ring
    doc.setDrawColor(217, 119, 6);
    doc.setFillColor(254, 243, 199); // Soft Gold tint
    doc.setLineWidth(1);
    doc.circle(sealX, sealY, 14, 'FD');

    // Inner Dotted Circle
    doc.setDrawColor(180, 83, 9);
    doc.setLineWidth(0.4);
    doc.circle(sealX, sealY, 11.5, 'S');

    // Seal Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(180, 83, 9);
    doc.text("VERIFIED", sealX, sealY - 3.5, { align: 'center' });
    doc.setFontSize(8);
    doc.text("★ ★ ★", sealX, sealY + 0.5, { align: 'center' });
    doc.setFontSize(5.5);
    doc.text("CODEDIARY", sealX, sealY + 4.5, { align: 'center' });
    doc.text("CERTIFIED", sealX, sealY + 7.5, { align: 'center' });

    // --- 9. Footer Details: Date, Signature & Verification ID ---
    const footerY = pageHeight - 32;

    // Left Column: Date & Certificate ID
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    const dateFormatted = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Date of Issue: ${dateFormatted}`, 32, footerY);

    const certId = generateCertificateId(topicId);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Certificate ID: ${certId}`, 32, footerY + 5);
    doc.text(`Verify at: https://codediary.com/verify/${certId}`, 32, footerY + 9);

    // Center Column: Authorized Signature
    const sigX = centerX - 10;
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.4);
    doc.line(sigX - 30, footerY + 2, sigX + 30, footerY + 2);

    // Cursive / Stylish Signature Name Representation
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 138);
    doc.text("CodeDiary Board", sigX, footerY - 1.5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text("Academic Director", sigX, footerY + 6, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text("CodeDiary Certification Board", sigX, footerY + 9.5, { align: 'center' });

    // Save and return document
    const fileName = `${cleanName.replace(/\s+/g, '_')}_${(courseTitle || 'Course').replace(/\s+/g, '_')}_Certificate.pdf`;
    doc.save(fileName);
    return true;
  } catch (err) {
    console.error("Certificate generation error:", err);
    throw err;
  }
};
