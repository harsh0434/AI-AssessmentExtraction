"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/lib/AssessmentContext';
import { UploadCloud, File as FileIcon, X, Loader2, ArrowRight } from 'lucide-react';

export default function Home() {
  const [questionPaper, setQuestionPaper] = useState<File | null>(null);
  const [answerSheet, setAnswerSheet] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');

  const router = useRouter();
  const { setAssessmentData } = useAssessment();

  const onDropQuestionPaper = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) setQuestionPaper(acceptedFiles[0]);
  }, []);

  const onDropAnswerSheet = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) setAnswerSheet(acceptedFiles[0]);
  }, []);

  const { getRootProps: getRootPropsQP, getInputProps: getInputPropsQP } = useDropzone({
    onDrop: onDropQuestionPaper,
    accept: { 'application/pdf': [], 'image/jpeg': [], 'image/png': [] },
    maxFiles: 1,
  });

  const { getRootProps: getRootPropsAS, getInputProps: getInputPropsAS } = useDropzone({
    onDrop: onDropAnswerSheet,
    accept: { 'application/pdf': [], 'image/jpeg': [], 'image/png': [] },
    maxFiles: 1,
  });

  const handleProcess = async () => {
    if (!questionPaper || !answerSheet) return;

    setIsProcessing(true);
    setError(null);
    setProgress('Uploading files...');

    try {
      const formData = new FormData();
      formData.append('questionPaper', questionPaper);
      formData.append('answerSheet', answerSheet);

      setProgress('Extracting questions and matching answers (this may take a minute)...');
      
      const res = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Processing failed');
      }

      const result = await res.json();
      
      // Store object URLs for displaying
      const qpUrl = URL.createObjectURL(questionPaper);
      const asUrl = URL.createObjectURL(answerSheet);
      
      setAssessmentData(qpUrl, asUrl, result);
      
      router.push('/assessment');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            AI Assessment Extractor
          </h1>
          <p className="mt-4 text-xl text-slate-600">
            Upload a question paper and a student's answer sheet to automatically map handwriting to questions.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Question Paper Dropzone */}
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">1. Question Paper</h2>
              {!questionPaper ? (
                <div
                  {...getRootPropsQP()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
                >
                  <input {...getInputPropsQP()} />
                  <UploadCloud className="h-10 w-10 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600">Drag & drop or click to upload</p>
                  <p className="text-xs text-gray-500 mt-2">PDF, PNG, JPG accepted</p>
                </div>
              ) : (
                <div className="border border-green-200 bg-green-50 rounded-xl p-6 flex items-center justify-between min-h-[200px]">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <FileIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 line-clamp-1">{questionPaper.name}</p>
                      <p className="text-sm text-green-600">Ready</p>
                    </div>
                  </div>
                  <button onClick={() => setQuestionPaper(null)} className="text-gray-400 hover:text-red-500">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Answer Sheet Dropzone */}
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">2. Answer Sheet</h2>
              {!answerSheet ? (
                <div
                  {...getRootPropsAS()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
                >
                  <input {...getInputPropsAS()} />
                  <UploadCloud className="h-10 w-10 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600">Drag & drop or click to upload</p>
                  <p className="text-xs text-gray-500 mt-2">PDF, PNG, JPG accepted</p>
                </div>
              ) : (
                <div className="border border-green-200 bg-green-50 rounded-xl p-6 flex items-center justify-between min-h-[200px]">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <FileIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 line-clamp-1">{answerSheet.name}</p>
                      <p className="text-sm text-green-600">Ready</p>
                    </div>
                  </div>
                  <button onClick={() => setAnswerSheet(null)} className="text-gray-400 hover:text-red-500">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col items-center">
            <button
              onClick={handleProcess}
              disabled={!questionPaper || !answerSheet || isProcessing}
              className="flex items-center justify-center w-full sm:w-auto px-8 py-4 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl transition-colors shadow-sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Processing...
                </>
              ) : (
                <>
                  Analyze Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
            {isProcessing && (
              <p className="mt-4 text-sm text-slate-500 animate-pulse">{progress}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
