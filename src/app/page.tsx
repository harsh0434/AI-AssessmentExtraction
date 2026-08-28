"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/lib/AssessmentContext';
import { ArrowLeft, HelpCircle, Bell, Sparkles, Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Sidebar from '@/components/ui/Sidebar';

export default function Home() {
  const [questionPaper, setQuestionPaper] = useState<File | null>(null);
  const [answerSheet, setAnswerSheet] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { setAssessmentData } = useAssessment();

  const onDropQuestionPaper = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) setQuestionPaper(acceptedFiles[0]);
  }, []);

  const onDropAnswerSheet = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) setAnswerSheet(acceptedFiles[0]);
  }, []);

  const { getRootProps: getRootPropsQP, getInputProps: getInputPropsQP, isDragActive: isDragQP } = useDropzone({
    onDrop: onDropQuestionPaper,
    accept: { 'application/pdf': [], 'image/jpeg': [], 'image/png': [] },
    maxFiles: 1,
  });

  const { getRootProps: getRootPropsAS, getInputProps: getInputPropsAS, isDragActive: isDragAS } = useDropzone({
    onDrop: onDropAnswerSheet,
    accept: { 'application/pdf': [], 'image/jpeg': [], 'image/png': [] },
    maxFiles: 1,
  });

  const handleProcess = async () => {
    if (!questionPaper || !answerSheet) return;
    setIsProcessing(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('questionPaper', questionPaper);
      formData.append('answerSheet', answerSheet);
      const res = await fetch('/api/process', { method: 'POST', body: formData });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Processing failed');
      }
      const result = await res.json();
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

  const getFileSize = (file: File) => {
    return (file.size / (1024 * 1024)).toFixed(0) + 'MB';
  };

  return (
    <div className="flex h-screen w-full bg-[#f5f5f5] p-4 gap-4 overflow-hidden font-sans text-gray-900">
      <Sidebar collapsed={false} />
      
      <main className="flex-1 bg-white rounded-[32px] shadow-sm flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 px-8 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 cursor-pointer transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Exams</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-900"><HelpCircle className="w-5 h-5" /></button>
            <div className="relative">
              <button className="text-gray-500 hover:text-gray-900"><Bell className="w-5 h-5" /></button>
              <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
            </div>
            <Sparkles className="w-5 h-5 text-gray-400" />
            <div className="flex items-center space-x-2 pl-2 border-l border-gray-200">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Madhur" className="w-8 h-8 rounded-full bg-gray-100" alt="Avatar" />
              <span className="text-sm font-semibold text-gray-700">Madhur Rastogi</span>
            </div>
          </div>
        </header>

        {isProcessing ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-white relative">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
              <div className="relative mb-6">
                <Sparkles className="w-24 h-24 text-orange-500" />
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="absolute inset-0 border-[6px] border-orange-100 border-t-orange-500 rounded-full w-32 h-32 -m-4" style={{ borderTopColor: 'transparent' }} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-2">Extracting...</h2>
              <p className="text-gray-500 text-sm">This may take a while</p>
            </motion.div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center overflow-y-auto px-6 py-10" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f9f9f9 100%)' }}>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center flex-wrap gap-x-2 gap-y-2">
                Upload 
                <span className="bg-[#fff4ed] text-[#f97316] px-4 py-1 rounded-2xl ml-2">Question Paper & Answer Sheets</span>
              </h1>
              <p className="mt-4 text-gray-500 font-medium text-lg">Upload both files to get started</p>
            </div>

            <div className="relative mb-10 flex justify-center">
              <div className="w-32 h-32 bg-[#fff4ed] rounded-full flex items-center justify-center relative shadow-sm border border-orange-50">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher" className="w-24 h-24 rounded-full" alt="Teacher" />
                <div className="absolute w-3 h-3 bg-orange-400 rounded-full top-2 left-4"></div>
                <div className="absolute w-2 h-2 bg-orange-300 rounded-full bottom-4 right-2"></div>
                <div className="absolute w-4 h-4 bg-orange-500 rounded-full top-1/2 -left-6 border-2 border-white"></div>
                <div className="absolute w-3 h-3 bg-orange-400 rounded-full bottom-2 left-6"></div>
                <div className="absolute w-4 h-4 bg-orange-500 rounded-full top-4 right-4 border-2 border-white"></div>
              </div>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {/* Question Paper */}
              {!questionPaper ? (
                <div {...getRootPropsQP()} className={clsx("bg-white border-[2px] border-dashed rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[200px]", isDragQP ? "border-orange-400 bg-orange-50/50" : "border-gray-200 hover:border-gray-300")}>
                  <input {...getInputPropsQP()} />
                  <div className="w-12 h-12 bg-gray-50 border border-gray-100 shadow-sm rounded-xl flex items-center justify-center mb-4">
                    <Upload className="w-5 h-5 text-gray-700" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 text-center">Upload <span className="text-orange-500">Question Paper</span></h3>
                  <p className="text-sm text-gray-400 mt-1 font-medium">Max 10MB</p>
                </div>
              ) : (
                <div className="bg-white border-[2px] border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[200px] relative">
                  <div className="w-10 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-3 text-red-500 font-extrabold text-[10px] shadow-sm">
                     PDF
                  </div>
                  <p className="font-bold text-gray-900 text-sm truncate w-full text-center px-2">{questionPaper.name}</p>
                  <p className="text-xs text-gray-400 font-medium mt-1 text-center">{getFileSize(questionPaper)} • 2 Pages</p>
                  <button onClick={(e) => { e.stopPropagation(); setQuestionPaper(null); }} className="absolute -top-4 -right-4 w-8 h-8 bg-[#4b5563] text-white rounded-full flex items-center justify-center hover:bg-gray-800 shadow-md border-2 border-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Answer Sheet */}
              {!answerSheet ? (
                <div {...getRootPropsAS()} className={clsx("bg-white border-[2px] border-dashed rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[200px]", isDragAS ? "border-orange-400 bg-orange-50/50" : "border-gray-200 hover:border-gray-300")}>
                  <input {...getInputPropsAS()} />
                  <div className="w-12 h-12 bg-gray-50 border border-gray-100 shadow-sm rounded-xl flex items-center justify-center mb-4">
                    <Upload className="w-5 h-5 text-gray-700" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 text-center">Upload <span className="text-orange-500">Answer Sheet</span></h3>
                  <p className="text-sm text-gray-400 mt-1 font-medium">Max 10MB</p>
                </div>
              ) : (
                <div className="bg-white border-[2px] border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[200px] relative">
                  <div className="w-10 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-3 text-red-500 font-extrabold text-[10px] shadow-sm">
                     PDF
                  </div>
                  <p className="font-bold text-gray-900 text-sm truncate w-full text-center px-2">{answerSheet.name}</p>
                  <p className="text-xs text-gray-400 font-medium mt-1 text-center">{getFileSize(answerSheet)} • 6 Pages</p>
                  <button onClick={(e) => { e.stopPropagation(); setAnswerSheet(null); }} className="absolute -top-4 -right-4 w-8 h-8 bg-[#4b5563] text-white rounded-full flex items-center justify-center hover:bg-gray-800 shadow-md border-2 border-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {error && <div className="mb-6 px-6 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium max-w-xl text-center border border-red-100 shadow-sm">{error}</div>}

            <div className="flex flex-col items-center text-center mt-auto pb-4">
              <button onClick={handleProcess} disabled={!questionPaper || !answerSheet} className="px-10 py-3.5 bg-[#27272a] hover:bg-black text-white font-bold rounded-full disabled:bg-gray-300 disabled:text-gray-500 transition-colors flex items-center shadow-md text-base">
                Start Mapping
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
              <p className="text-gray-400 text-xs mt-4 font-medium max-w-sm">Once both files are uploaded, you'll able to map answers with questions</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
