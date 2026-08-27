import fs from 'fs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function createSamples() {
  // --- Create Question Paper ---
  const qpDoc = await PDFDocument.create();
  const timesRomanFont = await qpDoc.embedFont(StandardFonts.TimesRoman);
  
  const qpPage = qpDoc.addPage([595, 842]); // A4 size
  const { height: qpHeight } = qpPage.getSize();
  const qpFontSize = 14;

  qpPage.drawText('Midterm Examination - Computer Science', {
    x: 50,
    y: qpHeight - 50,
    size: 18,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });

  const questions = [
    'Q1. What is the main purpose of a compiler?',
    'Q2. Explain the concept of inheritance in OOP.',
    '11(a). Describe how a hash table works.',
    '11(b). What is the time complexity of searching in a hash table?',
  ];

  let yOffset = qpHeight - 100;
  for (const q of questions) {
    qpPage.drawText(q, {
      x: 50,
      y: yOffset,
      size: qpFontSize,
      font: timesRomanFont,
    });
    yOffset -= 40;
  }

  const qpBytes = await qpDoc.save();
  fs.writeFileSync('public/sample_question_paper.pdf', qpBytes);


  // --- Create Answer Sheet ---
  const asDoc = await PDFDocument.create();
  const font = await asDoc.embedFont(StandardFonts.HelveticaOblique); // Simulating handwriting
  
  const asPage = asDoc.addPage([595, 842]);
  const { height: asHeight } = asPage.getSize();
  
  asPage.drawText('Student Name: John Doe', { x: 50, y: asHeight - 50, size: 12, font });

  // Writing answers out of order!
  const answers = [
    { text: 'Q2. Inheritance allows a class to inherit properties from another class.', y: asHeight - 100 },
    { text: '11(b). The average time complexity is O(1).', y: asHeight - 200 },
    { text: 'Q1. A compiler translates source code into machine code.', y: asHeight - 300 },
    // Notice 11(a) is missing (unanswered)
  ];

  for (const a of answers) {
    asPage.drawText(a.text, {
      x: 50,
      y: a.y,
      size: 14,
      font,
      color: rgb(0, 0, 0.5), // Blue ink
    });
  }

  const asBytes = await asDoc.save();
  fs.writeFileSync('public/sample_answer_sheet.pdf', asBytes);

  console.log('Sample PDFs created successfully in the /public directory.');
}

createSamples().catch(console.error);
