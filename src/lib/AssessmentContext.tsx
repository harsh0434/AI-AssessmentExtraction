"use client";

import React, { createContext, useContext, useState } from 'react';
import { AssessmentResult } from '@/types';

type AssessmentState = {
  questionPaperUrl: string | null;
  answerSheetUrl: string | null;
  result: AssessmentResult | null;
  setAssessmentData: (
    qpUrl: string, 
    asUrl: string, 
    result: AssessmentResult
  ) => void;
  reset: () => void;
};

const AssessmentContext = createContext<AssessmentState | undefined>(undefined);

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [questionPaperUrl, setQuestionPaperUrl] = useState<string | null>(null);
  const [answerSheetUrl, setAnswerSheetUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const setAssessmentData = (qpUrl: string, asUrl: string, res: AssessmentResult) => {
    setQuestionPaperUrl(qpUrl);
    setAnswerSheetUrl(asUrl);
    setResult(res);
  };

  const reset = () => {
    setQuestionPaperUrl(null);
    setAnswerSheetUrl(null);
    setResult(null);
  };

  return (
    <AssessmentContext.Provider
      value={{
        questionPaperUrl,
        answerSheetUrl,
        result,
        setAssessmentData,
        reset,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}
