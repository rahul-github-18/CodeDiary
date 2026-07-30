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

// Helper to load QR code image safely
const loadQRCodeImage = (verifyUrl) => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(null);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verifyUrl)}&color=16213E&bgcolor=FAFAF7`;
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Create fallback QR representation canvas
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 150;
        canvas.height = 150;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FAFAF7';
        ctx.fillRect(0, 0, 150, 150);
        ctx.fillStyle = '#16213E';
        // Outer box
        ctx.fillRect(10, 10, 130, 130);
        ctx.fillStyle = '#FAFAF7';
        ctx.fillRect(20, 20, 110, 110);
        // Position patterns
        const drawSquare = (x, y) => {
          ctx.fillStyle = '#16213E';
          ctx.fillRect(x, y, 35, 35);
          ctx.fillStyle = '#FAFAF7';
          ctx.fillRect(x + 5, y + 5, 25, 25);
          ctx.fillStyle = '#16213E';
          ctx.fillRect(x + 10, y + 10, 15, 15);
        };
        drawSquare(25, 25);
        drawSquare(90, 25);
        drawSquare(25, 90);
        const fallbackImg = new Image();
        fallbackImg.onload = () => resolve(fallbackImg);
        fallbackImg.src = canvas.toDataURL('image/png');
      } catch (e) {
        resolve(null);
      }
    };
    img.src = qrUrl;
  });
};

// Format a realistic Certificate ID
const generateCertificateId = (topic) => {
  const catCode = (topic?.category || 'ALG').substring(0, 3).toUpperCase();
  const slugCode = (topic?.title || 'BS').replace(/[^a-zA-Z]/g, '').substring(0, 2).toUpperCase() || 'BS';
  const year = new Date().getFullYear();
  const randomNum = String(topic?.id || Math.floor(Math.random() * 90000) + 10000).padStart(6, '0');
  return `CD-${catCode}-${slugCode}-${year}-${randomNum}`;
};

/**
 * Generates and downloads a world-class, premium landscape PDF Certificate of Completion.
 */
export const generateCertificatePDF = async ({
  recipientName = 'Rahul Ranjan',
  courseTitle = 'Binary Search',
  category = 'Algorithms',
  difficulty = 'Medium',
  lessonsCount = 18,
  problemsCount = 120,
  topicId = null
}) => {
  try {
    const { jsPDF } = await import('jspdf');

    let logoImg = null;
    try {
      logoImg = await loadLogoImage();
    } catch (e) {
      console.warn("Logo image load fallback:", e);
    }

    const certId = generateCertificateId({ category, title: courseTitle, id: topicId });
    const verifyUrl = `https://kodediary.vercel.app/verify/${certId}`;

    let qrImg = null;
    try {
      qrImg = await loadQRCodeImage(verifyUrl);
    } catch (e) {
      console.warn("QR code fallback:", e);
    }

    // Create Landscape A4 PDF: 297mm width x 210mm height
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 297;
    const pageHeight = 210;
    const centerX = pageWidth / 2;

    // Palette Colors
    const colorNavy = [22, 33, 62];      // #16213E
    const colorRoyal = [37, 99, 235];    // #2563EB
    const colorGold = [197, 157, 42];    // #C59D2A
    const colorIvory = [250, 250, 247];  // #FAFAF7
    const colorTextDark = [30, 41, 59];  // #1E293B
    const colorTextMuted = [71, 85, 105]; // #475569

    // --- 1. Background Fill ---
    doc.setFillColor(...colorIvory);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // --- 2. Watermark (Center background logo/emblem at 3-5% opacity) ---
    if (logoImg) {
      try {
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.04 }));
        const wmW = 75;
        const wmH = (wmW * logoImg.height) / logoImg.width;
        doc.addImage(logoImg, 'PNG', centerX - (wmW / 2), (pageHeight / 2) - (wmH / 2), wmW, wmH);
        doc.restoreGraphicsState();
      } catch (wmErr) {
        // Ignore watermark errors if graphicsState isn't supported
      }
    }

    // --- 3. Luxurious Triple Border System ---
    // Outer 4px (~1.2mm) Navy Border
    doc.setDrawColor(...colorNavy);
    doc.setLineWidth(1.2);
    doc.rect(6, 6, pageWidth - 12, pageHeight - 12);

    // Middle 1.5px (~0.5mm) Metallic Gold Border
    doc.setDrawColor(...colorGold);
    doc.setLineWidth(0.5);
    doc.rect(8.5, 8.5, pageWidth - 17, pageHeight - 17);

    // Inner 1px (~0.3mm) Navy Border
    doc.setDrawColor(...colorNavy);
    doc.setLineWidth(0.3);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Corner Metallic Gold Corner Ornaments
    const drawGoldCorner = (x, y, scaleX = 1, scaleY = 1) => {
      doc.setDrawColor(...colorGold);
      doc.setLineWidth(0.8);
      doc.line(x, y, x + (14 * scaleX), y);
      doc.line(x, y, x, y + (14 * scaleY));
      doc.setLineWidth(0.3);
      doc.line(x + (2.5 * scaleX), y + (2.5 * scaleY), x + (11.5 * scaleX), y + (2.5 * scaleY));
      doc.line(x + (2.5 * scaleX), y + (2.5 * scaleY), x + (2.5 * scaleX), y + (11.5 * scaleY));
    };

    drawGoldCorner(12, 12, 1, 1);
    drawGoldCorner(pageWidth - 12, 12, -1, 1);
    drawGoldCorner(12, pageHeight - 12, 1, -1);
    drawGoldCorner(pageWidth - 12, pageHeight - 12, -1, -1);

    // --- 4. Top Section: Logo & Brand Name ---
    let y = 16;

    if (logoImg) {
      try {
        const logoW = 20; // 80-100px equivalent
        const logoH = (logoW * logoImg.height) / logoImg.width;
        doc.addImage(logoImg, 'PNG', centerX - (logoW / 2), y, logoW, logoH);
        y += logoH + 3;
      } catch (imgErr) {
        y += 4;
      }
    } else {
      y += 4;
    }

    // "CodeDiary" Brand Heading
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...colorNavy);
    doc.text("CodeDiary", centerX, y, { align: 'center' });
    y += 9;

    // --- 5. Heading: CERTIFICATE OF COMPLETION ---
    doc.setFont('times', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(...colorNavy);
    doc.text("CERTIFICATE OF COMPLETION", centerX, y, { align: 'center' });
    y += 5;

    // Decorative Metallic Gold Horizontal Divider
    doc.setDrawColor(...colorGold);
    doc.setLineWidth(0.8);
    doc.line(centerX - 40, y, centerX + 40, y);
    
    // Center Gold Accent Square
    doc.setFillColor(...colorGold);
    doc.rect(centerX - 1.5, y - 1.5, 3, 3, 'F');
    y += 9;

    // --- 6. Recipient Subtitle ---
    doc.setFont('times', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(...colorGold);
    doc.text("This Certificate is Proudly Presented To", centerX, y, { align: 'center' });
    y += 12;

    // --- 7. Student Name (Second largest element after title) ---
    const cleanName = (recipientName || 'Rahul Ranjan').trim();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(...colorNavy);
    doc.text(cleanName, centerX, y, { align: 'center' });
    y += 3;

    // Elegant Metallic Gold Underline
    const nameWidth = Math.max(doc.getTextWidth(cleanName) + 24, 80);
    doc.setDrawColor(...colorGold);
    doc.setLineWidth(0.6);
    doc.line(centerX - (nameWidth / 2), y, centerX + (nameWidth / 2), y);
    y += 9;

    // --- 8. Formal Body Paragraph 1 ---
    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...colorTextMuted);
    const body1 = "In recognition of your dedication, commitment, and successful completion of all required learning modules, coding exercises, quizzes, practical assignments, and final assessments, this certificate is awarded as evidence of demonstrated proficiency in the following course.";
    const wrappedBody1 = doc.splitTextToSize(body1, 220);
    wrappedBody1.forEach(line => {
      doc.text(line, centerX, y, { align: 'center' });
      y += 4.5;
    });
    y += 2.5;

    // --- 9. Course Name ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    doc.setTextColor(...colorRoyal);
    const cleanCourse = (courseTitle || 'Binary Search').trim();
    doc.text(cleanCourse, centerX, y, { align: 'center' });
    y += 7.5;

    // --- 10. Formal Body Paragraph 2 ---
    doc.setFont('times', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...colorTextMuted);
    const body2 = "This achievement certifies that the recipient has successfully mastered the fundamental concepts, implementation techniques, problem-solving strategies, and practical applications covered throughout the course while meeting the academic standards established by CodeDiary.";
    const wrappedBody2 = doc.splitTextToSize(body2, 220);
    wrappedBody2.forEach(line => {
      doc.text(line, centerX, y, { align: 'center' });
      y += 4.2;
    });
    y += 4;

    // --- 11. Course Information Metadata Bar ---
    const metaBoxW = 225;
    const metaBoxH = 7.5;
    const metaBoxX = centerX - (metaBoxW / 2);
    
    doc.setFillColor(245, 243, 235); // Soft ivory metallic accent box
    doc.setDrawColor(...colorGold);
    doc.setLineWidth(0.3);
    doc.rect(metaBoxX, y, metaBoxW, metaBoxH, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...colorNavy);
    const metaStr = `Category: ${category}   |   Difficulty: ${difficulty}   |   Lessons Completed: ${lessonsCount}   |   Final Assessment: Passed   |   Status: 100%`;
    doc.text(metaStr, centerX, y + 5, { align: 'center' });
    y += 18;

    // --- 12. Bottom 3-Column Footer Section ---
    const bottomY = 148;

    // --- LEFT COLUMN: Date of Issue & Certificate ID ---
    const leftX = 22;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...colorNavy);
    doc.text("Date of Issue", leftX, bottomY);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...colorTextMuted);
    const issueDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    doc.text(issueDate, leftX, bottomY + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...colorNavy);
    doc.text("Certificate ID", leftX, bottomY + 11);

    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...colorRoyal);
    doc.text(certId, leftX, bottomY + 15.5);

    // --- CENTER COLUMN: Handwritten Signature ---
    const sigCenterX = centerX;
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(15);
    doc.setTextColor(...colorNavy);
    doc.text("Rahul Ranjan", sigCenterX, bottomY + 2, { align: 'center' });

    // Signature Line
    doc.setDrawColor(...colorGold);
    doc.setLineWidth(0.4);
    doc.line(sigCenterX - 28, bottomY + 5, sigCenterX + 28, bottomY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...colorNavy);
    doc.text("Rahul Ranjan", sigCenterX, bottomY + 9.5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...colorTextMuted);
    doc.text("Founder & Academic Director", sigCenterX, bottomY + 13.5, { align: 'center' });
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...colorGold);
    doc.text("CodeDiary", sigCenterX, bottomY + 17, { align: 'center' });

    // --- RIGHT COLUMN: Gold Verification Seal & QR Code ---
    const sealCenterX = 222;
    const sealCenterY = bottomY + 8;
    const sealRadius = 12.5;

    // Embossed Gold Verification Seal
    doc.setDrawColor(...colorGold);
    doc.setFillColor(253, 248, 232); // Gold emboss tint
    doc.setLineWidth(0.8);
    doc.circle(sealCenterX, sealCenterY, sealRadius, 'FD');

    // Inner Dotted Seal Circle
    doc.setDrawColor(...colorGold);
    doc.setLineWidth(0.3);
    doc.circle(sealCenterX, sealCenterY, sealRadius - 1.8, 'S');

    // Seal Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...colorGold);
    doc.text("VERIFIED", sealCenterX, sealCenterY - 3, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(...colorNavy);
    doc.text("CodeDiary Certified", sealCenterX, sealCenterY + 1.5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4.8);
    doc.setTextColor(...colorTextMuted);
    doc.text("Authenticity Guaranteed", sealCenterX, sealCenterY + 5, { align: 'center' });

    // QR Code Placement (Beside Seal)
    const qrX = 246;
    const qrY = bottomY - 1;
    const qrSize = 18;

    if (qrImg) {
      try {
        doc.addImage(qrImg, 'PNG', qrX, qrY, qrSize, qrSize);
      } catch (qrErr) {
        doc.setDrawColor(...colorNavy);
        doc.rect(qrX, qrY, qrSize, qrSize);
      }
    } else {
      doc.setDrawColor(...colorNavy);
      doc.rect(qrX, qrY, qrSize, qrSize);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(...colorNavy);
    doc.text("Scan to Verify", qrX + (qrSize / 2), qrY + qrSize + 3, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.setTextColor(...colorRoyal);
    doc.text(verifyUrl, qrX + (qrSize / 2), qrY + qrSize + 5.5, { align: 'center' });

    // --- 13. Centered Bottom Border Contact Information Footer ---
    const footerLineY = pageHeight - 13;
    doc.setDrawColor(...colorGold);
    doc.setLineWidth(0.3);
    doc.line(16, footerLineY - 3, pageWidth - 16, footerLineY - 3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...colorTextMuted);
    const contactStr = "Website: https://kodediary.vercel.app   •   LinkedIn: https://www.linkedin.com/in/rahul-ranjan-6b2ab424a/   •   Email: support@codediary.com";
    doc.text(contactStr, centerX, footerLineY, { align: 'center' });

    // Save and download high-resolution PDF file
    const safeName = cleanName.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const safeTitle = cleanCourse.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const fileName = `${safeName}_${safeTitle}_Certificate.pdf`;
    doc.save(fileName);
    return true;
  } catch (err) {
    console.error("Premium Certificate generation error:", err);
    throw err;
  }
};
