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
  regions: AnswerRegion[];
  targetPage?: number;
}

export default function DocumentViewer({ fileUrl, regions, targetPage }: ViewerProps) {
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
    <div className="flex flex-col h-full bg-slate-100/50 rounded-xl overflow-hidden border border-slate-200">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shadow-sm z-10">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <span className="text-sm font-medium text-slate-700 min-w-[80px] text-center">
            Page {pageNumber} {numPages ? `of ${numPages}` : ''}
          </span>
          <button
            onClick={() => setPageNumber((p) => Math.min(numPages || p, p + 1))}
            disabled={numPages ? pageNumber >= numPages : false}
            className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
          <button onClick={() => setScale((s) => s - 0.2)} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-slate-500 w-12 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale((s) => s + 0.2)} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => setScale(1)} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 ml-2">
            <Maximize className="w-4 h-4" />
          </button>
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
                    className="absolute border-4 border-yellow-400 bg-yellow-400/20 rounded-md pointer-events-none transition-all duration-300 shadow-[0_0_15px_rgba(250,204,21,0.5)] z-20"
                    style={{
                      left: `${region.bbox.x * 100}%`,
                      top: `${region.bbox.y * 100}%`,
                      width: `${region.bbox.width * 100}%`,
                      height: `${region.bbox.height * 100}%`,
                    }}
                  />
                ))}
              </Page>
            </Document>
          ) : (
            <div className="relative" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
              <img src={fileUrl} alt="Answer Sheet" className="max-w-full h-auto" />
              {activeRegions.map((region) => (
                <div
                  key={region.id}
                  className="absolute border-4 border-yellow-400 bg-yellow-400/20 rounded-md pointer-events-none transition-all duration-300 shadow-[0_0_15px_rgba(250,204,21,0.5)] z-20"
                  style={{
                    left: `${region.bbox.x * 100}%`,
                    top: `${region.bbox.y * 100}%`,
                    width: `${region.bbox.width * 100}%`,
                    height: `${region.bbox.height * 100}%`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
