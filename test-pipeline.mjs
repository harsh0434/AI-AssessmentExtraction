import fs from 'fs';

async function testPipeline() {
  console.log('Generating dummy test files...');
  fs.writeFileSync('q.txt', 'Q1. What is React?\nQ2. Explain Next.js.\n11(a) What is AI?');
  fs.writeFileSync('a.txt', 'Q2. Next.js is a React framework.\nQ1. React is a UI library.');

  const qBlob = new Blob([fs.readFileSync('q.txt')], { type: 'text/plain' });
  const aBlob = new Blob([fs.readFileSync('a.txt')], { type: 'text/plain' });

  const formData = new FormData();
  formData.append('questionPaper', qBlob, 'q.txt');
  formData.append('answerSheet', aBlob, 'a.txt');

  console.log('Sending request to /api/process...');
  const res = await fetch('http://localhost:3000/api/process', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  console.log('Response Status:', res.status);
  console.log('Result:', JSON.stringify(data, null, 2));
}

testPipeline().catch(console.error);
