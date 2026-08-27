import { getGeminiClient } from './gemini';
import { Question } from '@/types';

export async function extractQuestions(
  fileBuffer: Buffer,
  mimeType: string
): Promise<Question[]> {
  const ai = getGeminiClient();

  const prompt = `
You are an expert at extracting questions from examination papers.
I have provided an image/PDF of a question paper.
Extract all questions from it exactly as they appear.

Requirements:
1. Preserve original printed order.
2. Preserve original numbering.
3. Detect sub-parts and treat labelled sub-parts (e.g., 11(a), 11(b)) as separate questions.
4. Do NOT combine sub-parts into one question.
5. Return a JSON object with a "questions" array.

Schema for each question in the array:
- id: A unique string identifier (e.g., "11-a")
- number: The main question number (e.g., "11")
- subPart: The sub-part if any (e.g., "a")
- displayNumber: The combined display string (e.g., "11(a)")
- text: The actual question text.
- order: The sequential integer order (1, 2, 3...)
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
                data: fileBuffer.toString('base64'),
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
    return parsed.questions || [];
  } catch (error) {
    console.error('Error extracting questions:', error);
    throw new Error('Failed to extract questions');
  }
}
