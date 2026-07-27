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

export const generateNotesPDF = async (setGlobalError) => {
  try {
    const { jsPDF } = await import('jspdf');

    // Fetch todos and all questions in parallel
    const [todos, allQuestions] = await Promise.all([
      todoService.getTodos(),
      questionService.getAllQuestions()
    ]);

    if (!todos || !todos.length) {
      alert("No data available to export. Create some todos first!");
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

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = margin;

    const checkPageBreak = (neededHeight) => {
      if (y + neededHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
        return true;
      }
      return false;
    };

    // --- Header Section ---
    if (logoImg) {
      const logoW = 16;
      const logoH = (logoW * logoImg.height) / logoImg.width;
      doc.addImage(logoImg, 'PNG', margin, y - 2, logoW, logoH);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(26, 115, 232); // Blue
      doc.text("CodeDiary", margin + logoW + 4, y + 6);
      y += Math.max(logoH, 10) + 4;
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(26, 115, 232);
      doc.text("CodeDiary", margin, y);
      y += 10;
    }

    // Date
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(95, 99, 104);
    const dateStr = `Exported on: ${new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`;
    doc.text(dateStr, margin, y);
    y += 10;

    // Divider Line
    doc.setDrawColor(218, 220, 224);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // --- Render Todos ---
    for (const todo of fullData) {
      checkPageBreak(15);

      // Todo Heading
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(32, 33, 36);
      doc.text(todo.title, margin, y);
      y += 6;

      // Status info
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(128, 134, 139);
      doc.text(`Category: ${todo.category || 'General'}  |  Status: ${todo.completed ? 'Completed' : 'In Progress'}`, margin, y);
      y += 8;

      if (todo.questions.length === 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(95, 99, 104);
        doc.text("No questions under this topic.", margin + 4, y);
        y += 10;
        continue;
      }

      for (let qIdx = 0; qIdx < todo.questions.length; qIdx++) {
        const q = todo.questions[qIdx];
        checkPageBreak(25);

        // Question Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(26, 115, 232);
        doc.text(`Q${qIdx + 1}. ${q.title}`, margin + 4, y);
        y += 6;

        // Notes
        if (q.notes && q.notes.trim() !== '') {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(60, 64, 67);
          doc.text("Notes:", margin + 4, y);
          y += 4.5;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(32, 33, 36);
          const wrappedNotes = doc.splitTextToSize(q.notes, contentWidth - 4);
          const notesHeight = wrappedNotes.length * 4.5;
          checkPageBreak(notesHeight + 4);

          wrappedNotes.forEach(line => {
            doc.text(line, margin + 4, y);
            y += 4.5;
          });
          y += 3;
        }

        // Explanation (Colorful Teal Section)
        if (q.explanation && q.explanation.trim() !== '') {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(13, 148, 136); // Teal #0D9488
          doc.text("Explanation:", margin + 4, y);
          y += 4.5;

          const wrappedExp = doc.splitTextToSize(q.explanation, contentWidth - 10);
          const expBoxH = (wrappedExp.length * 4.5) + 5;
          checkPageBreak(expBoxH + 4);

          // Soft Teal Box
          doc.setFillColor(236, 254, 255); // #ECFEFF light cyan/teal BG
          doc.setDrawColor(153, 246, 228); // #99F6E4 border
          doc.roundedRect(margin + 4, y - 2.5, contentWidth - 4, expBoxH, 1.5, 1.5, 'FD');

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(15, 118, 110); // Dark teal text #0F766E
          let expY = y + 1.5;
          wrappedExp.forEach(line => {
            doc.text(line, margin + 7, expY);
            expY += 4.5;
          });
          y += expBoxH + 3;
        }

        // Code (Colorful Dark Box Section)
        if (q.code && q.code.trim() !== '') {
          checkPageBreak(15);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(79, 70, 229); // Indigo #4F46E5
          doc.text("Code:", margin + 4, y);
          y += 5;

          doc.setFont('courier', 'normal');
          doc.setFontSize(8.5);

          const codeLines = doc.splitTextToSize(q.code, contentWidth - 12);
          const codeLineHeight = 4.2;
          const padding = 3.5;

          let currentLineIndex = 0;
          while (currentLineIndex < codeLines.length) {
            const remainingPageHeight = pageHeight - margin - y;
            const linesThatFit = Math.floor((remainingPageHeight - (padding * 2)) / codeLineHeight);

            if (linesThatFit <= 0) {
              doc.addPage();
              y = margin;
              continue;
            }

            const batchLines = codeLines.slice(currentLineIndex, currentLineIndex + linesThatFit);
            const currentBoxHeight = (batchLines.length * codeLineHeight) + (padding * 2);

            // Sleek Dark Navy Code Box (#0F172A)
            doc.setFillColor(15, 23, 42);
            doc.roundedRect(margin + 4, y, contentWidth - 4, currentBoxHeight, 2, 2, 'F');

            let codeY = y + padding + 3;
            doc.setTextColor(241, 245, 249); // #F1F5F9 Bright Code Text
            batchLines.forEach(line => {
              doc.text(line, margin + 7, codeY);
              codeY += codeLineHeight;
            });

            y += currentBoxHeight + 4;
            currentLineIndex += linesThatFit;
          }
        }
        y += 4;
      }
      y += 6;
    }

    return doc;
  } catch (error) {
    console.error("PDF generation failed:", error);
    if (setGlobalError) {
      setGlobalError("Failed to generate PDF export.");
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

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = margin;

    const checkPageBreak = (neededHeight) => {
      if (y + neededHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
        return true;
      }
      return false;
    };

    // --- Header Section ---
    if (logoImg) {
      const logoW = 16;
      const logoH = (logoW * logoImg.height) / logoImg.width;
      doc.addImage(logoImg, 'PNG', margin, y - 2, logoW, logoH);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(26, 115, 232); // Blue
      doc.text("CodeDiary", margin + logoW + 4, y + 6);
      y += Math.max(logoH, 10) + 4;
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(26, 115, 232);
      doc.text("CodeDiary", margin, y);
      y += 10;
    }

    // Topic Name Subtitle
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(32, 33, 36);
    doc.text(topic.title, margin, y);
    y += 6;

    // Metadata
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(95, 99, 104);
    doc.text(`Category: ${topic.category || 'General'}  |  Difficulty: ${topic.difficulty || 'Easy'}`, margin, y);
    y += 6;

    // Copyright & LinkedIn Link
    const prefix = "Copyright © 2026 All Rights Reserved | ";
    const linkText = "LinkedIn";
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);
    doc.text(prefix, margin, y);
    const prefixW = doc.getTextWidth(prefix);
    doc.setTextColor(26, 115, 232);
    doc.text(linkText, margin + prefixW, y);
    doc.link(margin + prefixW, y - 3, doc.getTextWidth(linkText), 4, { url: 'https://www.linkedin.com/in/rahul-ranjan-6b2ab424a/' });
    y += 7;

    // Divider Line
    doc.setDrawColor(218, 220, 224);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // --- Render Questions ---
    if (!questions || questions.length === 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(95, 99, 104);
      doc.text("No questions under this topic.", margin, y);
    } else {
      for (let qIdx = 0; qIdx < questions.length; qIdx++) {
        const q = questions[qIdx];
        checkPageBreak(25);

        // Question Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11.5);
        doc.setTextColor(26, 115, 232);
        doc.text(`${qIdx + 1}. ${q.title}`, margin, y);
        y += 6;

        // Notes (Original Clean Style)
        if (q.notes && q.notes.trim() !== '') {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(60, 64, 67);
          doc.text("Notes:", margin, y);
          y += 4.5;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(32, 33, 36);
          const wrappedNotes = doc.splitTextToSize(q.notes, contentWidth);
          const notesHeight = wrappedNotes.length * 4.5;
          checkPageBreak(notesHeight + 4);

          wrappedNotes.forEach(line => {
            doc.text(line, margin, y);
            y += 4.5;
          });
          y += 3;
        }

        // Explanation (Colorful Teal Section)
        if (q.explanation && q.explanation.trim() !== '') {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(13, 148, 136); // Teal #0D9488
          doc.text("Explanation:", margin, y);
          y += 4.5;

          const wrappedExp = doc.splitTextToSize(q.explanation, contentWidth - 6);
          const expBoxH = (wrappedExp.length * 4.5) + 5;
          checkPageBreak(expBoxH + 4);

          // Soft Teal Box
          doc.setFillColor(236, 254, 255); // #ECFEFF light cyan/teal BG
          doc.setDrawColor(153, 246, 228); // #99F6E4 border
          doc.roundedRect(margin, y - 2.5, contentWidth, expBoxH, 1.5, 1.5, 'FD');

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(15, 118, 110); // Dark teal text #0F766E
          let expY = y + 1.5;
          wrappedExp.forEach(line => {
            doc.text(line, margin + 3, expY);
            expY += 4.5;
          });
          y += expBoxH + 3;
        }

        // Code (Colorful Dark Box Section)
        if (q.code && q.code.trim() !== '') {
          checkPageBreak(15);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(79, 70, 229); // Indigo #4F46E5
          doc.text("Code:", margin, y);
          y += 5;

          doc.setFont('courier', 'normal');
          doc.setFontSize(8.5);

          const codeLines = doc.splitTextToSize(q.code, contentWidth - 8);
          const codeLineHeight = 4.2;
          const padding = 3.5;

          let currentLineIndex = 0;
          while (currentLineIndex < codeLines.length) {
            const remainingPageHeight = pageHeight - margin - y;
            const linesThatFit = Math.floor((remainingPageHeight - (padding * 2)) / codeLineHeight);

            if (linesThatFit <= 0) {
              doc.addPage();
              y = margin;
              continue;
            }

            const batchLines = codeLines.slice(currentLineIndex, currentLineIndex + linesThatFit);
            const currentBoxHeight = (batchLines.length * codeLineHeight) + (padding * 2);

            // Sleek Dark Navy Code Box (#0F172A)
            doc.setFillColor(15, 23, 42);
            doc.roundedRect(margin, y, contentWidth, currentBoxHeight, 2, 2, 'F');

            let codeY = y + padding + 3;
            doc.setTextColor(241, 245, 249); // #F1F5F9 Bright Code Text
            batchLines.forEach(line => {
              doc.text(line, margin + 3, codeY);
              codeY += codeLineHeight;
            });

            y += currentBoxHeight + 4;
            currentLineIndex += linesThatFit;
          }
        }
        y += 4;
      }
    }

    return doc;
  } catch (error) {
    console.error("PDF generation for topic failed:", error);
    return null;
  }
};
