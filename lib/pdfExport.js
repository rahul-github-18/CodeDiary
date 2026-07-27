import { todoService, questionService } from './api';

// Helper to load logo image in browser environment safely
const loadLogoImage = async () => {
  if (typeof window === 'undefined') return null;
  const logoPaths = ['/light-logo.png', '/logo.png', '/icon.png', '/dark-logo.png'];
  for (const path of logoPaths) {
    try {
      const img = await new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'Anonymous';
        image.onload = () => resolve(image);
        image.onerror = () => reject(null);
        image.src = path;
      });
      if (img && img.width > 0) return img;
    } catch (e) {
      // Continue trying candidate paths
    }
  }
  return null;
};

// Modern Color Palette (RGB integer arrays for jsPDF compatibility)
const COLORS = {
  primaryDark: [15, 23, 42],      // #0F172A - Deep Slate Navy
  primaryBlue: [37, 99, 235],     // #2563EB - Royal Blue
  accentBlue: [59, 130, 246],     // #3B82F6 - Electric Blue
  indigo: [79, 70, 229],          // #4F46E5 - Indigo
  indigoLight: [238, 242, 255],   // #EEF2FF - Light Indigo BG
  teal: [13, 148, 136],           // #0D9488 - Teal
  tealLight: [236, 254, 255],     // #ECFEFF - Light Teal BG
  green: [16, 185, 129],          // #10B981 - Emerald Green
  greenLight: [220, 252, 231],    // #DCFCE7 - Light Green BG
  amber: [245, 158, 11],          // #F59E0B - Amber
  amberLight: [254, 243, 199],    // #FEF3C7 - Light Amber BG
  rose: [239, 68, 68],            // #EF4444 - Rose Red
  roseLight: [254, 226, 226],     // #FEE2E2 - Light Rose BG
  cardBg: [248, 250, 252],        // #F8FAFC - Card BG
  codeBg: [15, 23, 42],           // #0F172A - Dark Slate Code BG
  codeText: [241, 245, 249],      // #F1F5F9 - Code Text
  codeComment: [148, 163, 184],   // #94A3B8 - Line Numbers / Muted
  textDark: [30, 41, 59],         // #1E293B - Body Dark Text
  textMuted: [100, 116, 139],     // #64748B - Gray Text
  border: [226, 232, 240],        // #E2E8F0 - Border Line
};

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 15;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2); // 180mm
const BOTTOM_BOUNDARY = 278; // Footer margin line boundary

// Helper: Header for subsequent pages (Page 2+)
const drawSubsequentHeader = (doc, logoImg, subTitle, y) => {
  doc.setFillColor(...COLORS.primaryDark);
  doc.rect(MARGIN, y, CONTENT_WIDTH, 10, 'F');
  
  doc.setFillColor(...COLORS.primaryBlue);
  doc.rect(MARGIN, y, 3.5, 10, 'F');

  if (logoImg) {
    const maxW = 14;
    const logoH = Math.min(8, (maxW * logoImg.height) / logoImg.width);
    doc.addImage(logoImg, 'PNG', MARGIN + 6, y + (10 - logoH) / 2, maxW, logoH);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('CodeDiary', MARGIN + 22, y + 6.5);
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('CodeDiary', MARGIN + 6, y + 6.5);
  }

  if (subTitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225);
    const textToPrint = subTitle.length > 45 ? subTitle.substring(0, 42) + '...' : subTitle;
    doc.text(textToPrint, PAGE_WIDTH - MARGIN - 4, y + 6.5, { align: 'right' });
  }
};

// Helper: Main Banner Header on Page 1
const drawMainHeader = (doc, logoImg, titleStr, subtitleStr, dateStr, y) => {
  const headerH = 28;
  // Background Card
  doc.setFillColor(...COLORS.primaryDark);
  doc.roundedRect(MARGIN, y, CONTENT_WIDTH, headerH, 3, 3, 'F');

  // Gradient Top Stripe
  doc.setFillColor(...COLORS.primaryBlue);
  doc.rect(MARGIN, y, CONTENT_WIDTH / 2, 2, 'F');
  doc.setFillColor(...COLORS.indigo);
  doc.rect(MARGIN + CONTENT_WIDTH / 2, y, CONTENT_WIDTH / 2, 2, 'F');

  let textLeft = MARGIN + 8;

  if (logoImg) {
    const maxW = 28;
    const maxH = 16;
    let logoW = maxW;
    let logoH = (logoW * logoImg.height) / logoImg.width;
    if (logoH > maxH) {
      logoH = maxH;
      logoW = (logoH * logoImg.width) / logoImg.height;
    }
    const logoY = y + (headerH - logoH) / 2 + 1;
    doc.addImage(logoImg, 'PNG', MARGIN + 6, logoY, logoW, logoH);
    textLeft = MARGIN + 6 + logoW + 6;
  } else {
    // Fallback Logo Badge
    const logoY = y + 7;
    doc.setFillColor(...COLORS.primaryBlue);
    doc.roundedRect(MARGIN + 6, logoY, 14, 14, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('</>', MARGIN + 8.5, logoY + 9.5);
    textLeft = MARGIN + 24;
  }

  // App / Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('CodeDiary', textLeft, y + 13);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  const truncatedSub = subtitleStr.length > 50 ? subtitleStr.substring(0, 47) + '...' : subtitleStr;
  doc.text(truncatedSub, textLeft, y + 19);

  // Date/Timestamp on right side
  if (dateStr) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225);
    doc.text(dateStr, PAGE_WIDTH - MARGIN - 6, y + 15, { align: 'right' });
  }

  return y + headerH + 6;
};

// Helper: KPI Summary Cards
const drawKPIBoxes = (doc, totalTopics, totalQuestions, completedCount, y) => {
  const boxW = (CONTENT_WIDTH - 8) / 3;
  const boxH = 14;

  // Box 1: Total Topics
  doc.setFillColor(...COLORS.indigoLight);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(MARGIN, y, boxW, boxH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.indigo);
  doc.text('TOTAL TOPICS', MARGIN + 5, y + 5.5);
  doc.setFontSize(11);
  doc.text(String(totalTopics), MARGIN + 5, y + 11.5);

  // Box 2: Total Questions
  doc.setFillColor(245, 243, 255);
  doc.setDrawColor(221, 214, 254);
  doc.roundedRect(MARGIN + boxW + 4, y, boxW, boxH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(124, 58, 237);
  doc.text('TOTAL QUESTIONS', MARGIN + boxW + 9, y + 5.5);
  doc.setFontSize(11);
  doc.text(String(totalQuestions), MARGIN + boxW + 9, y + 11.5);

  // Box 3: Completed Count
  doc.setFillColor(...COLORS.greenLight);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(MARGIN + (boxW + 4) * 2, y, boxW, boxH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(4, 120, 87);
  doc.text('COMPLETED TOPICS', MARGIN + (boxW + 4) * 2 + 5, y + 5.5);
  doc.setFontSize(11);
  doc.text(`${completedCount} / ${totalTopics}`, MARGIN + (boxW + 4) * 2 + 5, y + 11.5);

  return y + boxH + 8;
};

// Helper: Topic Header Card
const drawTopicBanner = (doc, title, category, difficulty, completed, y) => {
  const bannerH = 13;
  doc.setFillColor(...COLORS.cardBg);
  doc.setDrawColor(...COLORS.border);
  doc.roundedRect(MARGIN, y, CONTENT_WIDTH, bannerH, 2, 2, 'FD');

  // Left Accent Line
  doc.setFillColor(...COLORS.primaryBlue);
  doc.rect(MARGIN, y, 3.5, bannerH, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.textDark);
  const truncatedTitle = doc.splitTextToSize(title, CONTENT_WIDTH - 70)[0];
  doc.text(truncatedTitle, MARGIN + 7, y + 8.5);

  let badgeX = PAGE_WIDTH - MARGIN - 4;

  // Status Badge
  if (completed !== undefined) {
    const statusText = completed ? '✓ Completed' : '⚡ In Progress';
    const statusBg = completed ? COLORS.greenLight : COLORS.amberLight;
    const statusFg = completed ? [21, 128, 61] : [180, 83, 9];
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    const stW = doc.getTextWidth(statusText) + 4;
    badgeX -= stW;
    doc.setFillColor(...statusBg);
    doc.roundedRect(badgeX, y + 2.5, stW, 7.5, 1.5, 1.5, 'F');
    doc.setTextColor(...statusFg);
    doc.text(statusText, badgeX + 2, y + 7.5);
    badgeX -= 3;
  }

  // Difficulty Badge
  if (difficulty) {
    const diffNorm = String(difficulty).toLowerCase();
    let diffBg = COLORS.greenLight;
    let diffFg = [4, 120, 87];
    let diffText = 'Easy';

    if (diffNorm.includes('mid') || diffNorm.includes('med') || diffNorm.includes('int')) {
      diffBg = COLORS.amberLight;
      diffFg = [180, 83, 9];
      diffText = 'Medium';
    } else if (diffNorm.includes('adv') || diffNorm.includes('hard')) {
      diffBg = COLORS.roseLight;
      diffFg = [185, 28, 28];
      diffText = 'Hard';
    }

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    const dfW = doc.getTextWidth(diffText) + 4;
    badgeX -= dfW;
    doc.setFillColor(...diffBg);
    doc.roundedRect(badgeX, y + 2.5, dfW, 7.5, 1.5, 1.5, 'F');
    doc.setTextColor(...diffFg);
    doc.text(diffText, badgeX + 2, y + 7.5);
    badgeX -= 3;
  }

  // Category Badge
  if (category) {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    const catText = category.length > 16 ? category.substring(0, 14) + '..' : category;
    const catW = doc.getTextWidth(catText) + 4;
    badgeX -= catW;
    doc.setFillColor(...COLORS.indigoLight);
    doc.roundedRect(badgeX, y + 2.5, catW, 7.5, 1.5, 1.5, 'F');
    doc.setTextColor(...COLORS.indigo);
    doc.text(catText, badgeX + 2, y + 7.5);
  }

  return y + bannerH + 5;
};

// Helper: Notes Callout
const drawNotesBox = (doc, notes, x, y, width, checkPageBreakFn) => {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  const wrappedNotes = doc.splitTextToSize(notes, width - 10);
  const boxHeight = (wrappedNotes.length * 4.5) + 9;

  y = checkPageBreakFn(boxHeight);

  doc.setFillColor(...COLORS.indigoLight);
  doc.roundedRect(x, y, width, boxHeight, 2, 2, 'F');

  doc.setFillColor(...COLORS.indigo);
  doc.rect(x, y, 2.5, boxHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.indigo);
  doc.text('📝 NOTES', x + 5, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.textDark);
  let textY = y + 10.5;
  wrappedNotes.forEach(line => {
    doc.text(line, x + 5, textY);
    textY += 4.5;
  });

  return y + boxHeight + 4;
};

// Helper: Explanation Callout
const drawExplanationBox = (doc, explanation, x, y, width, checkPageBreakFn) => {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  const wrappedExp = doc.splitTextToSize(explanation, width - 10);
  const boxHeight = (wrappedExp.length * 4.5) + 9;

  y = checkPageBreakFn(boxHeight);

  doc.setFillColor(...COLORS.tealLight);
  doc.roundedRect(x, y, width, boxHeight, 2, 2, 'F');

  doc.setFillColor(...COLORS.teal);
  doc.rect(x, y, 2.5, boxHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.teal);
  doc.text('💡 EXPLANATION', x + 5, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.textDark);
  let textY = y + 10.5;
  wrappedExp.forEach(line => {
    doc.text(line, x + 5, textY);
    textY += 4.5;
  });

  return y + boxHeight + 4;
};

// Helper: Code Box (IDE Theme)
const drawCodeBox = (doc, code, x, y, width, checkPageBreakFn) => {
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);

  const codeLines = doc.splitTextToSize(code, width - 18);
  const lineH = 4;
  const headerH = 6;
  const padding = 3;

  let lineIdx = 0;
  while (lineIdx < codeLines.length) {
    const remainingSpace = BOTTOM_BOUNDARY - y;
    const fitLines = Math.max(1, Math.floor((remainingSpace - headerH - padding * 2) / lineH));
    const batch = codeLines.slice(lineIdx, lineIdx + fitLines);
    const boxH = headerH + (batch.length * lineH) + (padding * 2);

    y = checkPageBreakFn(Math.min(boxH, 40));

    // Dark Code Box
    doc.setFillColor(...COLORS.codeBg);
    doc.roundedRect(x, y, width, boxH, 2, 2, 'F');

    // Header Strip
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(x, y, width, headerH, 2, 2, 'F');
    doc.setDrawColor(51, 65, 85);
    doc.setLineWidth(0.3);
    doc.line(x, y + headerH, x + width, y + headerH);

    // Title label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(56, 189, 248); // Sky blue
    doc.text('</> Code Solution', x + 5, y + 4.2);

    // Code lines rendering
    doc.setFont('courier', 'normal');
    doc.setFontSize(8);

    let codeY = y + headerH + padding + 3;
    batch.forEach((line, idx) => {
      const lineNum = String(lineIdx + idx + 1).padStart(2, ' ');
      doc.setTextColor(...COLORS.codeComment);
      doc.text(lineNum, x + 4, codeY);

      doc.setDrawColor(51, 65, 85);
      doc.line(x + 11, codeY - 2.5, x + 11, codeY + 1);

      doc.setTextColor(...COLORS.codeText);
      doc.text(line, x + 14, codeY);
      codeY += lineH;
    });

    lineIdx += batch.length;
    y += boxH + 4;
  }

  return y + 2;
};

// Helper: Apply footers to all pages at the end
const applyFooters = (doc, logoImg) => {
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Footer border line
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.4);
    doc.line(MARGIN, 283, PAGE_WIDTH - MARGIN, 283);

    // Left Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.textMuted);
    doc.text('CodeDiary — Developer Learning Tracker', MARGIN, 288);

    // Center Footer (Copyright + LinkedIn)
    const prefix = 'Copyright © 2026 | ';
    const linkStr = 'LinkedIn';
    doc.text(prefix, 95, 288);
    const prefixW = doc.getTextWidth(prefix);
    doc.setTextColor(...COLORS.primaryBlue);
    doc.text(linkStr, 95 + prefixW, 288);
    const linkW = doc.getTextWidth(linkStr);
    doc.link(95 + prefixW, 285, linkW, 4, { url: 'https://www.linkedin.com/in/rahul-ranjan-6b2ab424a/' });

    // Right Footer (Page X of Y)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.textMuted);
    doc.text(`Page ${i} of ${totalPages}`, PAGE_WIDTH - MARGIN, 288, { align: 'right' });
  }
};

export const generateNotesPDF = async (setGlobalError) => {
  try {
    const { jsPDF } = await import('jspdf');

    // Fetch todos & all questions
    const [todos, allQuestions] = await Promise.all([
      todoService.getTodos(),
      questionService.getAllQuestions()
    ]);

    if (!todos || todos.length === 0) {
      alert("No data available to export. Create some topics first!");
      return null;
    }

    const logoImg = await loadLogoImage();

    const questionsByTodoMap = {};
    (allQuestions || []).forEach(q => {
      if (!questionsByTodoMap[q.todo_id]) {
        questionsByTodoMap[q.todo_id] = [];
      }
      questionsByTodoMap[q.todo_id].push(q);
    });

    const fullData = todos.map(todo => ({
      ...todo,
      questions: questionsByTodoMap[todo.id] || []
    }));

    const totalQuestionsCount = (allQuestions || []).length;
    const completedCount = todos.filter(t => t.completed).length;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    let y = MARGIN;

    const checkBreak = (neededH) => {
      if (y + neededH > BOTTOM_BOUNDARY) {
        doc.addPage();
        y = MARGIN;
        drawSubsequentHeader(doc, logoImg, 'Coding Tracker Notes', y);
        y += 14;
      }
      return y;
    };

    // 1. Draw Main Title Header
    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    y = drawMainHeader(doc, logoImg, 'CodeDiary Notes', 'Full Curriculum & Topic Reference', dateStr, y);

    // 2. Draw KPI Summary
    y = drawKPIBoxes(doc, todos.length, totalQuestionsCount, completedCount, y);

    // 3. Render Topics and Questions
    for (const todo of fullData) {
      y = checkBreak(20);
      y = drawTopicBanner(doc, todo.title, todo.category || 'General', todo.difficulty, todo.completed, y);

      if (todo.questions.length === 0) {
        y = checkBreak(12);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8.5);
        doc.setTextColor(...COLORS.textMuted);
        doc.text("No questions under this topic yet.", MARGIN + 4, y);
        y += 8;
        continue;
      }

      for (let qIdx = 0; qIdx < todo.questions.length; qIdx++) {
        const q = todo.questions[qIdx];
        y = checkBreak(15);

        // Question Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...COLORS.primaryBlue);
        const qTitleText = `Q${qIdx + 1}. ${q.title}`;
        const wrappedQTitle = doc.splitTextToSize(qTitleText, CONTENT_WIDTH - 8);
        doc.text(wrappedQTitle, MARGIN + 4, y);
        y += (wrappedQTitle.length * 4.5) + 2;

        if (q.notes && q.notes.trim() !== '') {
          y = drawNotesBox(doc, q.notes, MARGIN + 4, y, CONTENT_WIDTH - 4, checkBreak);
        }

        if (q.explanation && q.explanation.trim() !== '') {
          y = drawExplanationBox(doc, q.explanation, MARGIN + 4, y, CONTENT_WIDTH - 4, checkBreak);
        }

        if (q.code && q.code.trim() !== '') {
          y = drawCodeBox(doc, q.code, MARGIN + 4, y, CONTENT_WIDTH - 4, checkBreak);
        }

        y += 4;
      }
      y += 6;
    }

    // 4. Apply Footers across all pages
    applyFooters(doc, logoImg);

    return doc;
  } catch (error) {
    console.error("PDF generation failed:", error);
    if (setGlobalError) {
      setGlobalError("Failed to generate PDF. Please try again.");
    } else {
      alert("Failed to export PDF.");
    }
    return null;
  }
};

export const generateTopicPDF = async (topic, questions = []) => {
  try {
    const { jsPDF } = await import('jspdf');
    const logoImg = await loadLogoImage();

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    let y = MARGIN;

    const checkBreak = (neededH) => {
      if (y + neededH > BOTTOM_BOUNDARY) {
        doc.addPage();
        y = MARGIN;
        drawSubsequentHeader(doc, logoImg, topic.title, y);
        y += 14;
      }
      return y;
    };

    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    // 1. Draw Main Header
    y = drawMainHeader(doc, logoImg, topic.title, `Topic Guide | Category: ${topic.category || 'General'}`, dateStr, y);

    // 2. Draw Topic Banner Card
    y = drawTopicBanner(doc, topic.title, topic.category || 'General', topic.difficulty, topic.completed, y);

    // 3. Render Questions
    if (questions.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9.5);
      doc.setTextColor(...COLORS.textMuted);
      doc.text("No questions under this topic yet.", MARGIN + 4, y + 4);
    } else {
      for (let qIdx = 0; qIdx < questions.length; qIdx++) {
        const q = questions[qIdx];
        y = checkBreak(15);

        // Question Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...COLORS.primaryBlue);
        const qTitleText = `Q${qIdx + 1}. ${q.title}`;
        const wrappedQTitle = doc.splitTextToSize(qTitleText, CONTENT_WIDTH - 8);
        doc.text(wrappedQTitle, MARGIN + 4, y);
        y += (wrappedQTitle.length * 4.5) + 2;

        if (q.notes && q.notes.trim() !== '') {
          y = drawNotesBox(doc, q.notes, MARGIN + 4, y, CONTENT_WIDTH - 4, checkBreak);
        }

        if (q.explanation && q.explanation.trim() !== '') {
          y = drawExplanationBox(doc, q.explanation, MARGIN + 4, y, CONTENT_WIDTH - 4, checkBreak);
        }

        if (q.code && q.code.trim() !== '') {
          y = drawCodeBox(doc, q.code, MARGIN + 4, y, CONTENT_WIDTH - 4, checkBreak);
        }

        y += 4;
      }
    }

    // 4. Apply Footers
    applyFooters(doc, logoImg);

    return doc;
  } catch (error) {
    console.error("PDF generation for topic failed:", error);
    return null;
  }
};
