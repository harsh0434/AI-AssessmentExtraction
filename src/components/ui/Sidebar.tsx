import React from 'react';
import { Home, BookOpen, FileText, CheckSquare, Library, Settings, ChevronLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  if (collapsed) {
    return (
      <div className="w-[88px] h-full bg-white rounded-[24px] shadow-sm flex flex-col items-center py-6 flex-shrink-0 relative">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center mb-6">
          <span className="text-white font-bold text-xl">V</span>
        </div>
        <div className="flex flex-col space-y-4 w-full px-4 items-center">
          <button className="w-12 h-12 rounded-full bg-[#1e1e1e] border-2 border-orange-500/50 text-white flex items-center justify-center shadow-md"><SparklesIcon className="w-5 h-5 text-orange-400" /></button>
          
          <button className="w-12 h-12 rounded-xl text-gray-500 hover:bg-gray-50 flex items-center justify-center transition-colors"><Home className="w-6 h-6" /></button>
          <button className="w-12 h-12 rounded-xl text-gray-500 hover:bg-gray-50 flex items-center justify-center transition-colors"><BookOpen className="w-6 h-6" /></button>
          <button className="w-12 h-12 rounded-xl text-gray-500 hover:bg-gray-50 flex items-center justify-center transition-colors"><FileText className="w-6 h-6" /></button>
          
          <div className="relative w-full flex justify-center py-2">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-black rounded-r-md"></div>
            <Link href="/" className="w-12 h-12 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center"><CheckSquare className="w-6 h-6" /></Link>
          </div>
          
          <button className="w-12 h-12 rounded-xl text-gray-500 hover:bg-gray-50 flex items-center justify-center transition-colors"><Library className="w-6 h-6" /></button>
        </div>
        <div className="mt-auto flex flex-col space-y-4 w-full px-4 items-center mb-4">
          <button className="w-12 h-12 rounded-xl text-gray-500 hover:bg-gray-50 flex items-center justify-center transition-colors"><Settings className="w-6 h-6" /></button>
          <div className="w-10 h-10 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
             <img src="https://api.dicebear.com/7.x/initials/svg?seed=DPS&backgroundColor=e6f4ea&textColor=166534" alt="DPS" className="w-full h-full rounded-full" />
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 mb-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 17 5-5-5-5M6 17l5-5-5-5"/></svg>
        </button>
      </div>
    );
  }

  return (
    <div className="w-[280px] h-full bg-white rounded-[24px] shadow-sm flex flex-col flex-shrink-0">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">V</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-black">VedaAI</span>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M15 3v18"/></svg>
        </button>
      </div>
      
      <div className="px-5 mb-6">
        <button className="w-full bg-[#1e1e1e] border border-orange-500/30 text-white rounded-full py-3.5 px-4 flex items-center justify-center space-x-3 shadow-sm hover:bg-black transition-colors">
          <SparklesIcon className="w-5 h-5 text-orange-400" />
          <span className="font-semibold text-sm">AI Teacher's Toolkit</span>
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
          <Home className="w-5 h-5" />
          <span className="text-sm">Home</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
          <BookOpen className="w-5 h-5" />
          <span className="text-sm">My Classroom</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
          <FileText className="w-5 h-5" />
          <span className="text-sm">Assignments</span>
        </button>
        <div className="relative w-full py-1">
          <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-8 bg-black rounded-r-md"></div>
          <Link href="/" className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-100 text-gray-900 rounded-xl font-semibold transition-colors">
            <CheckSquare className="w-5 h-5" />
            <span className="text-sm">Exams</span>
          </Link>
        </div>
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
          <Library className="w-5 h-5" />
          <span className="text-sm">My Library</span>
        </button>
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-4">
        <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors">
          <Settings className="w-5 h-5" />
          <span className="text-sm">Settings</span>
        </button>
        <div className="bg-gray-50 rounded-xl p-3 flex items-center space-x-3 border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
             <img src="https://api.dicebear.com/7.x/initials/svg?seed=DPS&backgroundColor=e6f4ea&textColor=166534" alt="DPS" className="w-full h-full rounded-full" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">Delhi Public School</p>
            <p className="text-[10px] text-gray-500">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
