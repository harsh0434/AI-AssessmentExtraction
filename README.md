# AI Assessment Extraction & Answer Mapping

This application allows teachers to upload a question paper and a student's handwritten answer sheet. It automatically extracts the questions, detects the handwritten answers, maps them together (handling out-of-order answers), and provides an interactive UI to review the exact region of the student's answer highlighted on the original document.

## Features
- **Question Extraction**: Automatically parses question papers while preserving original numbering (e.g., `11(a)`) and logical ordering.
- **Handwritten Answer OCR**: Detects handwritten student answers, including spatial coordinates (bounding boxes).
- **Intelligent Mapping**: Maps out-of-order student answers to the correct questions using semantic similarity and explicit numbering.
- **Interactive Review UI**: Split-screen interface for selecting a question and instantly seeing the highlighted answer on the original scanned document.
- **Edge Cases Handled**: Out-of-order answers, multi-page answers, missing (unanswered) questions, and unmatched handwriting.

## Architecture & Technology Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS, Framer Motion, Lucide Icons.
- **Document Rendering**: `react-pdf` is used to render PDFs directly in the browser. 
- **State Management**: React Context (`AssessmentContext`) is used to store assessment data in memory to avoid needing a database for this assignment.
- **AI Model/API**: Gemini 1.5 Pro via `@google/genai`. 
  - *Why?* The prompt allowed replacing Google Cloud Vision with a suitable alternative. Gemini 1.5 Pro excels at multimodal processing. It can take a raw PDF or image and directly output structured data (questions) and precise bounding boxes for spatial mapping (OCR). This significantly simplifies the architecture into a single API while maintaining high accuracy for both transcription and coordinate extraction.
- **Highlighting Logic**: Normalizes bounding boxes (0.0 to 1.0) on the server, which are then applied to responsive CSS absolute-positioned overlays on the client viewer.

## Setup Instructions

1. Clone or download this project.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Environment Variables:
   - Copy `.env.example` to `.env`
   - Add your Gemini API key:
     ```env
     GEMINI_API_KEY=your_gemini_api_key_here
     ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment
This project is deployment-ready for platforms like Vercel. 
Simply push to GitHub and import the project in Vercel, ensuring you add the `GEMINI_API_KEY` to your Vercel Environment Variables. No other configuration is needed as it uses Next.js App Router seamlessly.

## Limitations & Future Improvements
- **OCR Accuracy**: While Gemini 1.5 Pro bounding boxes are generally good, a dedicated OCR service like Google Cloud Vision Document AI provides slightly more pixel-perfect bounding polygons for cursive handwriting. 
- **AI Confidence**: AI-generated mappings should always be treated as a starting point. The "Low Confidence" flag correctly guides the teacher to verify uncertain mappings.
- **Future Enhancements**: Implement a human-in-the-loop correction feature allowing teachers to manually redraw bounding boxes or remap answers, improving the system over time via few-shot prompting or fine-tuning.
