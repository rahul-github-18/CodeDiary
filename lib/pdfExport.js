import { todoService, questionService } from './api';

// Helper to load logo image in browser environment safely and strip any crop marks
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
          // Crop inner 90% of image to guarantee zero corner crop marks
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

export const generateNotesPDF = async (setGlobalError) => {
  try {
    const { jsPDF } = await import('jspdf');

    // 1. Fetch todos and all questions in parallel
    const [todos, allQuestions] = await Promise.all([
      todoService.getTodos(),
      questionService.getAllQuestions()
    ]);

    if (!todos || todos.length === 0) {
      alert("No data available to export. Create some todos first!");
      return null;
    }

    const logoImg = await loadLogoImage();

    // 2. Map questions to their respective topics in-memory
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

    // 3. Initialize PDF
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

    // Header Logo & App Title
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

    // Current Date
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
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

    // Render Todos
    for (const todo of fullData) {
      checkPageBreak(15);

      // Todo Heading
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(32, 33, 36);
      doc.text(todo.title, margin, y);
      y += 8;

      // Status info
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(128, 134, 139);
      doc.text(`Created: ${todo.created_date}  |  Status: ${todo.completed ? 'Completed' : 'In Progress'}`, margin, y);
      y += 10;

      if (todo.questions.length === 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(95, 99, 104);
        doc.text("No questions under this topic.", margin + 5, y);
        y += 12;
        continue;
      }

      for (const q of todo.questions) {
        checkPageBreak(25);

        // Question Title (Colorful Blue)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(26, 115, 232); // Blue
        doc.text(`Question: ${q.title}`, margin + 5, y);
        y += 6;

        // Last Updated
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(128, 134, 139);
        const lastUpdated = q.updated_at 
          ? new Date(q.updated_at).toLocaleString() 
          : 'Never';
        doc.text(`Last Updated: ${lastUpdated}`, margin + 5, y);
        y += 8;

        // Question Notes (Amber Heading Only)
        if (q.notes && q.notes.trim() !== '') {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(217, 119, 6); // Amber Heading
          doc.text("Notes:", margin + 5, y);
          y += 5;

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(32, 33, 36);
          
          const wrappedNotes = doc.splitTextToSize(q.notes, contentWidth - 5);
          const notesHeight = wrappedNotes.length * 5;
          checkPageBreak(notesHeight + 5);

          wrappedNotes.forEach(line => {
            doc.text(line, margin + 5, y);
            y += 5;
          });
          y += 4;
        }

        // Question Explanation (Teal Heading Only)
        if (q.explanation && q.explanation.trim() !== '') {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(13, 148, 136); // Teal Heading
          doc.text("Explanation:", margin + 5, y);
          y += 5;

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(32, 33, 36);
          
          const wrappedExplanation = doc.splitTextToSize(q.explanation, contentWidth - 5);
          const explanationHeight = wrappedExplanation.length * 5;
          checkPageBreak(explanationHeight + 5);

          wrappedExplanation.forEach(line => {
            doc.text(line, margin + 5, y);
            y += 5;
          });
          y += 4;
        }

        // Question Code (Indigo Heading Only, Light Gray Box Body)
        if (q.code && q.code.trim() !== '') {
          checkPageBreak(15);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(79, 70, 229); // Indigo Heading
          doc.text("Code:", margin + 5, y);
          y += 6;

          doc.setFont('courier', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(32, 33, 36);

          const codeLines = doc.splitTextToSize(q.code, contentWidth - 15);
          const codeLineHeight = 4.5;
          const padding = 4;

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

            // Light gray background box
            doc.setFillColor(245, 247, 250);
            doc.rect(margin + 5, y, contentWidth - 5, currentBoxHeight, 'F');

            let codeY = y + padding + 3;
            doc.setTextColor(51, 51, 51);
            batchLines.forEach(line => {
              doc.text(line, margin + 8, codeY);
              codeY += codeLineHeight;
            });

            y += currentBoxHeight + 5;
            currentLineIndex += linesThatFit;
          }
        }
        y += 6;
      }
      y += 10;
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

    // Header Logo & App Title
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

    // Topic Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(32, 33, 36);
    doc.text(topic.title, margin, y);
    y += 7;

    // Metadata
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(95, 99, 104);
    doc.text(`Category: ${topic.category || 'General'}  |  Difficulty: ${topic.difficulty || 'Easy'}`, margin, y);
    y += 6;

    // Copyright & LinkedIn link
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

    // Loop questions
    if (!questions || questions.length === 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(95, 99, 104);
      doc.text("No questions under this topic.", margin, y);
    } else {
      for (let qIdx = 0; qIdx < questions.length; qIdx++) {
        const q = questions[qIdx];
        checkPageBreak(25);
        
        // Question Title (Colorful Blue)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(26, 115, 232); // Blue
        doc.text(`${qIdx + 1}. ${q.title}`, margin, y);
        y += 6;

        // Notes (Amber Heading Only)
        if (q.notes && q.notes.trim() !== '') {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(217, 119, 6); // Amber Heading
          doc.text("Notes:", margin, y);
          y += 5;

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(32, 33, 36);
          const wrappedNotes = doc.splitTextToSize(q.notes, contentWidth);
          const notesHeight = wrappedNotes.length * 5;
          checkPageBreak(notesHeight + 5);

          wrappedNotes.forEach(line => {
            doc.text(line, margin, y);
            y += 5;
          });
          y += 4;
        }

        // Explanation (Teal Heading Only)
        if (q.explanation && q.explanation.trim() !== '') {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(13, 148, 136); // Teal Heading
          doc.text("Explanation:", margin, y);
          y += 5;

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(32, 33, 36);
          const wrappedExplanation = doc.splitTextToSize(q.explanation, contentWidth);
          const explanationHeight = wrappedExplanation.length * 5;
          checkPageBreak(explanationHeight + 5);

          wrappedExplanation.forEach(line => {
            doc.text(line, margin, y);
            y += 5;
          });
          y += 4;
        }

        // Code (Indigo Heading Only, Light Gray Box Body)
        if (q.code && q.code.trim() !== '') {
          checkPageBreak(15);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(79, 70, 229); // Indigo Heading
          doc.text("Code:", margin, y);
          y += 6;

          doc.setFont('courier', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(32, 33, 36);

          const codeLines = doc.splitTextToSize(q.code, contentWidth - 10);
          const codeLineHeight = 4.5;
          const padding = 4;

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

            doc.setFillColor(245, 247, 250);
            doc.rect(margin, y, contentWidth, currentBoxHeight, 'F');

            let codeY = y + padding + 3;
            doc.setTextColor(51, 51, 51);
            batchLines.forEach(line => {
              doc.text(line, margin + 3, codeY);
              codeY += codeLineHeight;
            });

            y += currentBoxHeight + 5;
            currentLineIndex += linesThatFit;
          }
        }
        y += 6;
      }
    }

    return doc;
  } catch (error) {
    console.error("PDF generation for topic failed:", error);
    return null;
  }
};
