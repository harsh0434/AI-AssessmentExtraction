import { NextRequest, NextResponse } from 'next/server';
import { extractQuestions } from '@/lib/ai/extraction';
import { extractAndMapAnswers } from '@/lib/ai/mapping';
import { AssessmentResult } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const questionPaper = formData.get('questionPaper') as File | null;
    const answerSheet = formData.get('answerSheet') as File | null;

    if (!questionPaper || !answerSheet) {
      return NextResponse.json(
        { error: 'Both questionPaper and answerSheet are required' },
        { status: 400 }
      );
    }

    // 1. Convert files to buffers
    const qpBuffer = Buffer.from(await questionPaper.arrayBuffer());
    const asBuffer = Buffer.from(await answerSheet.arrayBuffer());

    // 2. Extract Questions
    const questions = await extractQuestions(qpBuffer, questionPaper.type);
    
    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions could be extracted from the question paper.' },
        { status: 400 }
      );
    }

    // 3. Extract and Map Answers
    const mappings = await extractAndMapAnswers(questions, asBuffer, answerSheet.type);

    const result: AssessmentResult = {
      questions,
      mappings,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Processing API Error:', error);
    return NextResponse.json(
      { error: error.message || 'An internal error occurred during processing' },
      { status: 500 }
    );
  }
}
