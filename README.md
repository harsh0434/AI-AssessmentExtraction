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

## Assignment Submission Details

**Live deployed URL:**
[https://aiassessmentextraction.vercel.app/](https://aiassessmentextraction.vercel.app/)

**GitHub repository:**
[https://github.com/harsh0434/AI-Assessment-Extraction](https://github.com/harsh0434/AI-Assessment-Extraction)

**Brief explanation of your approach:**
I built the application using Next.js (App Router), React, and Tailwind CSS. To avoid the complexity of an unnecessary backend database, I implemented an in-memory state management system using React Context, allowing seamless data flow between the Upload and Assessment screens. 

For the core flow, I utilized a hybrid AI mapping architecture. The system first prompts the AI to extract and structure the questions logically (treating sub-parts like `11(a)` as distinct entries). Then, it processes the student's answer sheet in a single multimodal pass to extract the handwriting, calculate normalized bounding box coordinates (`x, y, width, height`), and semantically map each answer to the correct question ID regardless of the order they were written in. Finally, the UI renders the original document using `react-pdf` and overlays responsive CSS bounding-boxes based on the active question. 

As a bonus feature, I implemented the optional AI Grading system. The AI evaluates the correctness of the answer, provides a score out of 10, generates 1-2 sentences of feedback, and the UI displays a Total Estimated Score summary.

**AI model/API used:**
Gemini 3.6 Flash via the `@google/genai` SDK. I chose this model because it natively supports extracting highly accurate multimodal spatial coordinates (bounding polygons) alongside semantic transcription and reasoning in a single pass. This eliminated the need for a separate, complex OCR pipeline while easily handling edge cases like unmatched text and missing answers. 

**Any important assumptions or limitations:**
1. **Handwriting Legibility:** The system assumes the uploaded handwritten answer sheet is legible enough for standard multimodal vision models to parse. Extremely poor handwriting may result in a "Low Confidence" flag.
2. **AI Grading Estimation:** The AI-generated scores and feedback are estimations designed to act as a teacher's assistant. They should be manually verified by the teacher for final grading. 
3. **In-Memory Storage:** As per the requirements, no database was used. If the user refreshes the page during the Assessment Review, the session data is cleared, and they will need to re-upload the files.
