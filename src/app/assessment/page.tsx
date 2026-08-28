"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/lib/AssessmentContext';
import dynamic from 'next/dynamic';
import { ArrowLeft, HelpCircle, Bell, ChevronDown, ChevronUp, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import Sidebar from '@/components/ui/Sidebar';

const DocumentViewer = dynamic(() => import('@/components/viewer/DocumentViewer'), {
  ssr: false,
});

export default function AssessmentPage() {
  const router = useRouter();
  const { questionPaperUrl, answerSheetUrl, result, reset } = useAssessment();
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  useEffect(() => {
    if (!questionPaperUrl || !answerSheetUrl || !result) {
      router.push('/');
    } else if (result.questions.length > 0 && !selectedQuestionId) {
      setSelectedQuestionId(result.questions[0].id);
    }
  }, [questionPaperUrl, answerSheetUrl, result, router, selectedQuestionId]);

  if (!result || !answerSheetUrl) return null;

  const handleGoBack = () => {
    reset();
    router.push('/');
  };

  const activeMapping = result.mappings.find((m) => m.questionId === selectedQuestionId);
  const activeRegions = activeMapping?.regions || [];
  const targetPage = activeRegions.length > 0 ? activeRegions[0].page : undefined;

  return (
    <div className="flex h-screen w-full bg-[#f5f5f5] p-4 gap-4 overflow-hidden font-sans text-gray-900">
      <Sidebar collapsed={true} />
      
      <main className="flex-1 bg-white rounded-[32px] shadow-sm flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 px-8 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 cursor-pointer transition-colors" onClick={handleGoBack}>
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Exams</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-900"><HelpCircle className="w-5 h-5" /></button>
            <div className="relative">
              <button className="text-gray-500 hover:text-gray-900"><Bell className="w-5 h-5" /></button>
              <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="flex items-center space-x-2 pl-4 border-l border-gray-200 cursor-pointer">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Madhur" className="w-8 h-8 rounded-full bg-gray-100" alt="Avatar" />
              <span className="text-sm font-semibold text-gray-700">Madhur Rastogi</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden p-6 gap-6 bg-gray-100">
          {/* Left Panel: Questions List */}
          <aside className="w-[500px] flex flex-col flex-shrink-0 bg-transparent">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 text-lg">Extracted Questions <span className="text-gray-500 text-sm font-normal">(from question paper)</span></h2>
              <button className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 shadow-sm">
                Expand all
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
              {result.questions.map((q, idx) => {
                const mapping = result.mappings.find((m) => m.questionId === q.id);
                const isSelected = selectedQuestionId === q.id;
                const score = mapping?.score !== undefined ? mapping.score : 0;
                const isFullScore = score >= 5; // Using 5 as a proxy threshold for "good" score here based on /10
                
                return (
                  <div
                    key={q.id}
                    onClick={() => setSelectedQuestionId(q.id)}
                    className={clsx(
                      "w-full text-left rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden border-2",
                      isSelected 
                        ? "bg-white border-orange-500 shadow-sm" 
                        : "bg-white border-gray-100 hover:border-gray-200 shadow-sm"
                    )}
                  >
                    <div className="p-4 flex items-start space-x-4 relative">
                      <div className={clsx(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0",
                        isSelected ? "bg-[#ff6722] text-white" : "bg-[#6b7280] text-white"
                      )}>
                        {q.displayNumber.replace(/[^0-9]/g, '') || idx + 1}
                      </div>
                      
                      <div className="flex-1 pr-16 min-h-[2rem] flex items-center">
                        <p className={clsx("text-sm font-medium leading-relaxed", isSelected ? "text-gray-900" : "text-gray-700")}>
                          {q.text}
                        </p>
                      </div>

                      {/* Score Pill */}
                      <div className="absolute right-4 top-4 flex items-center space-x-3">
                        <span className={clsx(
                          "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold",
                          isFullScore ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}>
                          {score}/10
                        </span>
                        {isSelected ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>
                    
                    {isSelected && mapping?.reasoning && (
                      <div className="px-4 pb-4 pt-2">
                        <div className="border-t border-gray-100 pt-3">
                          <h4 className="text-xs font-bold text-gray-900 mb-1">AI Feedback</h4>
                          <p className="text-xs text-gray-600 leading-relaxed font-medium">
                            {mapping.feedback || mapping.reasoning}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Right Panel: Answer Sheet Viewer */}
          <section className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col border border-gray-200">
            {/* The Document Area */}
            <div className="flex-1 relative bg-gray-100">
              <DocumentViewer 
                fileUrl={answerSheetUrl} 
                regions={activeRegions} 
                targetPage={targetPage}
                questionDisplay={result.questions.find(q => q.id === selectedQuestionId)?.displayNumber}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
