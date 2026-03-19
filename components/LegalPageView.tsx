
import React from 'react';
import { ChevronLeft, FileText } from 'lucide-react';
import { LegalPage, Language } from '../types';

interface LegalPageViewProps {
  page: LegalPage;
  language: Language;
  onBack: () => void;
  isDarkMode: boolean;
}

export const LegalPageView: React.FC<LegalPageViewProps> = ({ page, language, onBack, isDarkMode }) => {
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-slate-900'} p-6 lg:p-12`}>
      <div className="max-w-4xl mx-auto space-y-8">
        <button 
          onClick={onBack}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl ${isDarkMode ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-slate-100 hover:bg-slate-200'} transition-all text-sm font-bold uppercase tracking-widest`}
        >
          <ChevronLeft size={18} className="rtl:rotate-180" />
          {language === 'ar' ? 'عودة' : 'Back'}
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-brand-500">
            <FileText size={24} />
            <span className="text-xs font-black uppercase tracking-[0.3em]">{page.category}</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic">{page.title}</h1>
        </div>

        <div 
          className={`prose prose-sm lg:prose-base ${isDarkMode ? 'prose-invert' : ''} max-w-none font-medium leading-relaxed text-zinc-400`}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
};
