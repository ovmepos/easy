
import React from 'react';
import { ShoppingCart, Package, BarChart3, LogOut, ScanLine, Settings, MessageCircle, X, History, Wifi, WifiOff, RefreshCw, List, Moon, Sun, Globe, LayoutDashboard, ChevronLeft, ChevronRight, QrCode, CalendarDays, Store } from 'lucide-react';
import { AppView, User, UserRole, Language } from '../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  onLogout: () => void;
  currentUser: User;
  onClose?: () => void;
  isOnline: boolean;
  isSyncing: boolean;
  isDarkMode: boolean;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, onChangeView, onLogout, currentUser, onClose, isOnline, isSyncing,
  isDarkMode, toggleTheme, language, toggleLanguage, t
}) => {
  
  const getNavItems = (role: UserRole) => {
    // VENDOR / VENDOR_STAFF: Only show Vendor Panel and Basic Logins
    if (role === 'VENDOR' || role === 'VENDOR_STAFF') {
      return [
        { view: AppView.VENDOR_PANEL, label: t('vendorPanel'), icon: Store },
      ];
    }

    const items = [
      { view: AppView.POS, label: t('posTerminal'), icon: ShoppingCart },
      { view: AppView.BOOKINGS, label: t('bookings'), icon: CalendarDays },
    ];
    
    // CASHIER: Restricted to POS & Bookings Only
    if (role === 'CASHIER') return items;

    // STAFF & ABOVE
    if (['ADMIN', 'MANAGER', 'STAFF'].includes(role)) {
       items.push({ view: AppView.ORDERS, label: t('ordersReturns'), icon: History });
    }

    if (['ADMIN', 'MANAGER', 'STAFF'].includes(role)) {
      items.push({ view: AppView.INVENTORY, label: t('inventory'), icon: Package });
      items.push({ view: AppView.CATEGORIES, label: t('categoryList'), icon: List });
      items.push({ view: AppView.STOCK_CHECK, label: t('stockCheck'), icon: ScanLine });
      items.push({ view: AppView.PRINT_BARCODE, label: t('printBarcode'), icon: QrCode });
    }

    // MANAGER & ADMIN
    if (['ADMIN', 'MANAGER'].includes(role)) {
      items.push({ view: AppView.REPORTS, label: t('reportsAi'), icon: BarChart3 });
    }

    // ADMIN ONLY
    if (role === 'ADMIN') {
      items.push({ view: AppView.SETTINGS, label: t('settings'), icon: Settings });
      items.push({ view: AppView.BAILEYS_SETUP, label: t('whatsappSetup'), icon: MessageCircle });
    }

    return items;
  };

  const navItems = getNavItems(currentUser.role);

  return (
    <div className="w-full bg-[#0f172a] dark:bg-[#020617] text-slate-200 flex flex-col h-full shadow-2xl no-print border-r border-slate-800/50 transition-all duration-300">
      {/* Brand Header */}
      <div className="p-6 pb-8 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3.5 group cursor-pointer">
           <div className="bg-brand-500 p-2.5 rounded-2xl shadow-lg shadow-brand-500/20 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
              <LayoutDashboard size={24} className="text-white" />
           </div>
           <div>
              <h1 className="text-xl font-black tracking-tight text-white uppercase italic leading-none group-hover:text-brand-400 transition-colors">easyPOS</h1>
              <div className="flex items-center gap-1.5 mt-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">
                    {isOnline ? 'System Live' : 'Offline Mode'}
                  </p>
              </div>
           </div>
        </div>
        
        {onClose && (
            <button 
                onClick={onClose} 
                className="p-2 hover:bg-slate-800/50 rounded-xl text-slate-500 hover:text-white transition-all active:scale-95 lg:hidden"
                title="Hide Sidebar"
            >
                <ChevronLeft size={20} className="rtl:rotate-180" />
            </button>
        )}
      </div>

      {/* User Status Section */}
      <div className="px-4 mb-8">
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 dark:from-slate-900/60 dark:to-slate-950/80 p-4 rounded-[2.5rem] border border-slate-700/30 flex items-center gap-4 backdrop-blur-md shadow-xl">
              <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 flex items-center justify-center font-black text-2xl text-white shadow-2xl transform hover:scale-105 transition-transform">
                      {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-lg"></div>
              </div>
              <div className="overflow-hidden flex-1">
                  <p className="font-black text-sm truncate text-white leading-tight tracking-tight">{currentUser.name}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                      <span className="px-2 py-0.5 bg-brand-500/10 text-brand-400 text-[8px] font-black uppercase tracking-widest rounded-lg border border-brand-500/20">
                        {currentUser.role}
                      </span>
                  </div>
              </div>
          </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
        <div className="px-4 mb-4 flex items-center gap-3">
           <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] whitespace-nowrap italic">Operational Matrix</span>
           <div className="h-px bg-slate-800/30 flex-1"></div>
        </div>
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onChangeView(item.view)}
              className={`w-full group flex items-center gap-3.5 px-4 py-4 rounded-[1.5rem] transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-brand-500/20 to-transparent text-brand-400 border border-brand-500/20 shadow-lg shadow-brand-500/5'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-brand-500/20 text-brand-400' : 'bg-slate-800/30 text-slate-500 group-hover:bg-brand-500/10 group-hover:text-brand-400 group-hover:scale-110'}`}>
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`font-black text-xs uppercase tracking-widest transition-all ${isActive ? 'text-white' : 'group-hover:translate-x-1'}`}>{item.label}</span>
              
              {isActive && (
                 <>
                   <div className="absolute right-4 w-1.5 h-1.5 bg-brand-400 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)] animate-pulse"></div>
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 rounded-r-full"></div>
                 </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Actions */}
      <div className="p-4 border-t border-slate-800/50 space-y-4 bg-slate-900/20">
        <div className="px-4 mb-2 flex items-center gap-3">
           <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.3em] whitespace-nowrap">System Core</span>
           <div className="h-px bg-slate-800/30 flex-1"></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
            <button 
                onClick={toggleTheme}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-[1.5rem] bg-slate-800/30 hover:bg-slate-800/50 transition-all border border-slate-700/20 group relative overflow-hidden"
            >
                <div className="relative z-10">
                    {isDarkMode ? <Sun size={20} className="text-amber-400 group-hover:rotate-90 transition-transform duration-500"/> : <Moon size={20} className="text-brand-400 group-hover:-rotate-12 transition-transform duration-500" />}
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 relative z-10">{isDarkMode ? t('light') : t('dark')}</span>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <button 
                onClick={toggleLanguage}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-[1.5rem] bg-slate-800/30 hover:bg-slate-800/50 transition-all border border-slate-700/20 group relative overflow-hidden"
            >
                <div className="relative z-10">
                    <Globe size={20} className="text-emerald-400 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 relative z-10">
                  {language === 'en' ? 'Arabic' : 'English'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
        </div>

        <div className={`p-4 rounded-[1.5rem] transition-all border shadow-inner ${isOnline ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400' : 'bg-red-500/5 border-red-500/10 text-red-400'}`}>
             <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${isOnline ? 'bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-red-500/10'}`}>
                    {isSyncing ? (
                        <RefreshCw size={18} className="animate-spin" />
                    ) : isOnline ? (
                        <Wifi size={18} />
                    ) : (
                        <WifiOff size={18} />
                    )}
                </div>
                
                <div className="flex-1 overflow-hidden">
                    <div className="text-[9px] font-black uppercase tracking-[0.15em] leading-none mb-1.5">{isSyncing ? t('syncing') : isOnline ? t('onlineMode') : t('offlineMode')}</div>
                    <div className="text-[8px] opacity-60 truncate font-black uppercase tracking-widest italic">
                        {isOnline ? t('synced') : t('savedDevice')}
                    </div>
                </div>
             </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-[1.5rem] text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-black text-[10px] uppercase tracking-[0.2em] border border-transparent hover:border-red-500/20 group shadow-sm active:scale-95"
        >
          <LogOut size={18} className="shrink-0 group-hover:-translate-x-1.5 transition-transform duration-300" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </div>
  );
};
