export type Question = {
  id: string;
  number: string;
  subPart?: string;
  displayNumber: string;
  text: string;
  order: number;
  page?: number;
};

export type NormalizedBBox = {
  x: number; // 0.0 to 1.0
  y: number; // 0.0 to 1.0
  width: number; // 0.0 to 1.0
  height: number; // 0.0 to 1.0
};

export type AnswerRegion = {
  id: string;
  page: number;
  text: string;
  bbox: NormalizedBBox;
  confidence: number;
};

export type AnswerMapping = {
  questionId: string;
  status: "answered" | "unanswered" | "unmatched";
  answerText?: string;
  regions: AnswerRegion[];
  confidence: number;
  reasoning?: string;
  score?: number; // out of 10
  feedback?: string;
};

export type AssessmentResult = {
  questions: Question[];
  mappings: AnswerMapping[];
};
