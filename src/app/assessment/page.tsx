"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/lib/AssessmentContext';
import dynamic from 'next/dynamic';

const DocumentViewer = dynamic(() => import('@/components/viewer/DocumentViewer'), {
  ssr: false,
});
import { AnswerMapping } from '@/types';
import { CheckCircle2, XCircle, AlertCircle, HelpCircle } from 'lucide-react';
import clsx from 'clsx';

export default function AssessmentPage() {
  const router = useRouter();
  const { questionPaperUrl, answerSheetUrl, result, reset } = useAssessment();
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  useEffect(() => {
    if (!questionPaperUrl || !answerSheetUrl || !result) {
      router.push('/');
    }
  }, [questionPaperUrl, answerSheetUrl, result, router]);

  if (!result || !answerSheetUrl) return null;

  const handleGoBack = () => {
    reset();
    router.push('/');
  };

  const getStatusIcon = (status: string, confidence: number) => {
    if (status === 'answered' && confidence >= 70) {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
    if (status === 'answered' && confidence < 70) {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
    if (status === 'unanswered') {
      return <XCircle className="w-5 h-5 text-gray-400" />;
    }
    return <HelpCircle className="w-5 h-5 text-orange-500" />;
  };

  const getStatusText = (status: string, confidence: number) => {
    if (status === 'answered' && confidence >= 70) return 'Answered';
    if (status === 'answered' && confidence < 70) return 'Low Confidence';
    if (status === 'unanswered') return 'Unanswered';
    return 'Unmatched';
  };

  // Find active regions based on selected question
  const activeMapping = result.mappings.find((m) => m.questionId === selectedQuestionId);
  const activeRegions = activeMapping?.regions || [];
  const targetPage = activeRegions.length > 0 ? activeRegions[0].page : undefined;

  // Stats
  const total = result.questions.length;
  const answered = result.mappings.filter((m) => m.status === 'answered').length;
  const unanswered = result.mappings.filter((m) => m.status === 'unanswered').length;
  const unmatched = result.mappings.filter((m) => m.status === 'unmatched').length;
  
  // Grading Stats
  const totalScore = result.mappings.reduce((acc, m) => acc + (m.score || 0), 0);
  const maxPossibleScore = total * 10;

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900 overflow-hidden">
      {/* Header */}
      <header className="flex-none bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-20">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Assessment Review</h1>
          <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
            <span className="font-medium">{total} Questions</span>
            <span className="text-green-600">{answered} Answered</span>
            <span className="text-gray-500">{unanswered} Unanswered</span>
            {unmatched > 0 && <span className="text-orange-500">{unmatched} Unmatched</span>}
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md font-bold ml-4">
              Est. Score: {totalScore}/{maxPossibleScore}
            </span>
          </div>
        </div>
        <button
          onClick={handleGoBack}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          New Assessment
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Questions List */}
        <aside className="w-1/3 min-w-[320px] max-w-[480px] bg-white border-r border-slate-200 flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Questions
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {result.questions.map((q) => {
              const mapping = result.mappings.find((m) => m.questionId === q.id);
              const isSelected = selectedQuestionId === q.id;
              
              return (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuestionId(q.id)}
                  className={clsx(
                    "w-full text-left p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden",
                    isSelected 
                      ? "bg-blue-50 border-blue-200 shadow-sm" 
                      : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center space-x-2">
                        <span className={clsx(
                          "font-bold text-lg",
                          isSelected ? "text-blue-700" : "text-slate-700"
                        )}>
                          {q.displayNumber}
                        </span>
                        <span className={clsx(
                          "text-xs font-medium px-2 py-0.5 rounded-full",
                          mapping?.status === 'answered' && mapping.confidence >= 70 ? "bg-green-100 text-green-700" :
                          mapping?.status === 'answered' ? "bg-yellow-100 text-yellow-700" :
                          mapping?.status === 'unanswered' ? "bg-gray-100 text-gray-600" :
                          "bg-orange-100 text-orange-700"
                        )}>
                          {getStatusText(mapping?.status || 'unanswered', mapping?.confidence || 0)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {q.text}
                      </p>
                    </div>
                    <div className="mt-1">
                      {getStatusIcon(mapping?.status || 'unanswered', mapping?.confidence || 0)}
                    </div>
                  </div>
                  
                  {isSelected && mapping?.reasoning && (
                    <div className="mt-3 pt-3 border-t border-blue-100/50 space-y-2">
                      {mapping.score !== undefined && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                            AI Score: {mapping.score}/10
                          </span>
                        </div>
                      )}
                      {mapping.feedback && (
                        <p className="text-xs text-blue-900 leading-relaxed italic">
                          "{mapping.feedback}"
                        </p>
                      )}
                      <p className="text-xs text-blue-800/80 leading-relaxed">
                        <span className="font-semibold text-blue-900">Mapping Note:</span> {mapping.reasoning}
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Panel: Document Viewer */}
        <section className="flex-1 p-6 bg-slate-50">
          <DocumentViewer 
            fileUrl={answerSheetUrl} 
            regions={activeRegions} 
            targetPage={targetPage}
          />
        </section>
      </main>
    </div>
  );
}
