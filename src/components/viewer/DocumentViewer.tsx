"use client";

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { AnswerRegion } from '@/types';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

// Setup worker with matching version from CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ViewerProps {
  fileUrl: string;
  regions?: AnswerRegion[];
  targetPage?: number;
  questionDisplay?: string;
}

export default function DocumentViewer({ fileUrl, regions = [], targetPage, questionDisplay }: ViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isPdf, setIsPdf] = useState(true); // Assuming true until error or checking extension

  React.useEffect(() => {
    if (targetPage) {
      setPageNumber(targetPage);
    }
  }, [targetPage]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsPdf(true);
  }

  function onDocumentLoadError() {
    setIsPdf(false);
  }

  const activeRegions = regions.filter((r) => r.page === pageNumber);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Figma Black Toolbar */}
      <div className="h-12 bg-gray-900 text-white flex items-center justify-between px-4 flex-shrink-0 z-10">
        <span className="font-semibold text-sm">Answer Sheet</span>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-2 py-1">
            <button onClick={() => setScale((s) => Math.max(0.2, s - 0.2))} className="p-1 hover:text-gray-300 transition-colors"><ZoomOut className="w-3.5 h-3.5" /></button>
            <span className="text-xs font-medium w-10 text-center">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale((s) => Math.min(3, s + 0.2))} className="p-1 hover:text-gray-300 transition-colors"><ZoomIn className="w-3.5 h-3.5" /></button>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-2 py-1">
            <button 
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={pageNumber <= 1}
              className="p-1 hover:text-gray-300 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-medium min-w-[60px] text-center">Page {pageNumber} of {numPages || 1}</span>
            <button 
              onClick={() => setPageNumber((p) => Math.min(numPages || p, p + 1))}
              disabled={numPages ? pageNumber >= numPages : false}
              className="p-1 hover:text-gray-300 disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Viewer Area */}
      <div className="flex-1 overflow-auto relative p-4 flex justify-center bg-slate-200/50">
        <div className="relative shadow-lg bg-white inline-block">
          {isPdf ? (
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              className="relative"
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="relative"
              >
                {/* Highlights Overlay */}
                {activeRegions.map((region) => (
                  <div
                    key={region.id}
                    className="absolute border-4 border-green-500 bg-green-400/20 rounded-md pointer-events-none transition-all duration-300 z-20"
                    style={{
                      left: `${region.bbox.x * 100}%`,
                      top: `${region.bbox.y * 100}%`,
                      width: `${region.bbox.width * 100}%`,
                      height: `${region.bbox.height * 100}%`,
                    }}
                  >
                    {questionDisplay && (
                      <div className="absolute -top-3 -left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm">
                        {questionDisplay}
                      </div>
                    )}
                  </div>
                ))}
              </Page>
            </Document>
          ) : (
            <div className="relative" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
              <img src={fileUrl} alt="Answer Sheet" className="max-w-full h-auto" />
                {activeRegions.map((region) => (
                  <div
                    key={region.id}
                    className="absolute border-4 border-green-500 bg-green-400/20 rounded-md pointer-events-none transition-all duration-300 z-20"
                    style={{
                      left: `${region.bbox.x * 100}%`,
                      top: `${region.bbox.y * 100}%`,
                      width: `${region.bbox.width * 100}%`,
                      height: `${region.bbox.height * 100}%`,
                    }}
                  >
                    {questionDisplay && (
                      <div className="absolute -top-3 -left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm">
                        {questionDisplay}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
