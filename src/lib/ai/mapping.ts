import { getGeminiClient } from './gemini';
import { Question, AnswerMapping } from '@/types';

export async function extractAndMapAnswers(
  questions: Question[],
  answerSheetBuffer: Buffer,
  mimeType: string
): Promise<AnswerMapping[]> {
  const ai = getGeminiClient();

  const prompt = `
You are an expert at evaluating handwritten answer sheets.
I will provide the list of extracted questions, followed by the image/PDF of a student's answer sheet.

Your task is to identify the student's handwritten answers and map them to the correct questions.
The student may have answered questions out of order.
For each mapped answer, provide the bounding box regions.

IMPORTANT INSTRUCTIONS FOR BOUNDING BOXES:
Gemini can return bounding boxes. I need you to provide bounding box coordinates for each answer region.
Represent bounding boxes using the [ymin, xmin, ymax, xmax] format where each value is an integer between 0 and 1000.
Example: [100, 150, 200, 850] means ymin=100, xmin=150, ymax=200, xmax=850.
A single answer can span multiple pages or multiple separate regions. 

QUESTIONS:
${JSON.stringify(questions, null, 2)}

Requirements for Output:
Return a JSON object containing a "mappings" array.
Each mapping must match the following schema:
- questionId: The id of the question from the provided list.
- status: "answered", "unanswered", or "unmatched". Use "unanswered" if the student did not answer this question. Use "unmatched" if there is handwriting that you cannot link to a specific question.
- answerText: The transcribed text of the student's answer (if status is answered or unmatched).
- confidence: A number between 0 and 100 representing your confidence in this mapping.
- reasoning: A short explanation of why you made this mapping.
- score: If status is 'answered', provide an estimated score out of 10 for correctness.
- feedback: A short 1-2 sentence feedback on the correctness of the answer.
- regions: An array of region objects.
  Each region object must have:
  - id: A unique string for the region.
  - page: The page number where this region is located (1-indexed).
  - text: The transcribed text in this specific region.
  - bbox: An object { ymin, xmin, ymax, xmax } with values 0-1000.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: answerSheetBuffer.toString('base64'),
                mimeType,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const textResponse = response.text;
    if (!textResponse) throw new Error('No response from Gemini');
    
    const parsed = JSON.parse(textResponse);
    
    // Normalize coordinates from 0-1000 to 0.0-1.0
    const mappings: AnswerMapping[] = (parsed.mappings || []).map((m: any) => {
      const regions = (m.regions || []).map((r: any) => ({
        id: r.id,
        page: r.page,
        text: r.text,
        bbox: {
          x: r.bbox.xmin / 1000,
          y: r.bbox.ymin / 1000,
          width: (r.bbox.xmax - r.bbox.xmin) / 1000,
          height: (r.bbox.ymax - r.bbox.ymin) / 1000,
        },
        confidence: m.confidence || 100, // Inherit confidence
      }));

      return {
        questionId: m.questionId,
        status: m.status,
        answerText: m.answerText,
        confidence: m.confidence,
        reasoning: m.reasoning,
        score: m.score,
        feedback: m.feedback,
        regions,
      };
    });

    // Make sure we have a mapping for every question, even if unanswered
    const finalMappings: AnswerMapping[] = questions.map((q) => {
      const found = mappings.find((m) => m.questionId === q.id);
      if (found) return found;
      return {
        questionId: q.id,
        status: 'unanswered',
        regions: [],
        confidence: 100,
        reasoning: 'No answer found for this question in the output.',
      };
    });

    // Add unmatched mappings
    const unmatched = mappings.filter((m) => m.status === 'unmatched');
    
    return [...finalMappings, ...unmatched];
  } catch (error) {
    console.error('Error mapping answers:', error);
    throw new Error('Failed to map answers');
  }
}
