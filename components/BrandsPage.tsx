
import React from 'react';
import { ChevronLeft, Search, Tag } from 'lucide-react';
import { Brand, Language, StoreSettings, AppView } from '../types';

interface BrandsPageProps {
  brands: Brand[];
  language: Language;
  onBack: () => void;
  isDarkMode: boolean;
  storeSettings: StoreSettings;
  onBrandClick: (brand: Brand) => void;
}

export const BrandsPage: React.FC<BrandsPageProps> = ({ brands, language, onBack, isDarkMode, storeSettings, onBrandClick }) => {
  const t = (key: string) => language === 'ar' ? (key === 'back' ? 'عودة' : 'الماركات المفضلة') : (key === 'back' ? 'Back' : 'Favourite Brands');

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-slate-50 text-slate-900'} p-6 lg:p-12`}>
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <button 
              onClick={onBack}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${isDarkMode ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-white hover:bg-slate-100'} transition-all text-sm font-bold uppercase tracking-widest shadow-sm`}
            >
              <ChevronLeft size={18} className="rtl:rotate-180" />
              {t('back')}
            </button>
            <h1 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic">{t('favouriteBrands')}</h1>
          </div>

          <div className="relative group max-w-md w-full">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} size={16} />
            <input 
              type="text" 
              placeholder={language === 'ar' ? 'البحث عن الماركات...' : 'Search brands...'}
              className={`w-full ${isDarkMode ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'} border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-500/50 transition-all shadow-sm`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {brands.map((brand) => (
            <div 
              key={brand.id} 
              onClick={() => onBrandClick(brand)}
              className={`group cursor-pointer bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 flex flex-col items-center gap-6 hover:border-brand-500/50 transition-all shadow-sm hover:shadow-xl hover:scale-[1.02] duration-300`}
            >
              <div className="w-24 h-24 relative">
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute -top-2 -right-2 bg-brand-500 text-[8px] font-black px-2 py-1 rounded-full text-white shadow-lg">
                  NEW
                </div>
              </div>
              <div className="text-center space-y-1">
                <span className="text-xs font-black uppercase tracking-widest group-hover:text-brand-500 transition-colors">{brand.name}</span>
                <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Official Store</p>
              </div>
            </div>
          ))}
        </div>

        {brands.length === 0 && (
          <div className="text-center py-24 space-y-4">
            <div className="w-20 h-20 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto">
              <Tag size={32} className="text-brand-500" />
            </div>
            <p className="text-zinc-500 font-bold uppercase tracking-widest">No brands found</p>
          </div>
        )}
      </div>
    </div>
  );
};
