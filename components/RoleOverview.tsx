
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Store, Users, User, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface RoleOverviewProps {
  language: Language;
  t: (key: string) => string;
  onGoBack: () => void;
}

export const RoleOverview: React.FC<RoleOverviewProps> = ({ language, t, onGoBack }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const roles = [
    {
      id: 'admin',
      title: t('admin'),
      icon: <Shield size={48} className="text-brand-500" />,
      color: 'from-brand-500/20 to-brand-600/20',
      features: [
        'Full System Control',
        'Financial Reports & AI Insights',
        'Manage All Vendors & Staff',
        'System Settings & Integrations',
        'Security & Access Logs'
      ]
    },
    {
      id: 'vendor',
      title: t('vendor'),
      icon: <Store size={48} className="text-emerald-500" />,
      color: 'from-emerald-500/20 to-teal-600/20',
      features: [
        'Personal Store Dashboard',
        'Inventory Management',
        'Sales Tracking',
        'Staff Management',
        'Custom Store URL'
      ]
    },
    {
      id: 'staff',
      title: t('staff'),
      icon: <Users size={48} className="text-blue-500" />,
      color: 'from-blue-500/20 to-indigo-600/20',
      features: [
        'POS Terminal Access',
        'Process Sales & Returns',
        'View Assigned Inventory',
        'Basic Daily Reports',
        'Customer Management'
      ]
    },
    {
      id: 'customer',
      title: t('customer'),
      icon: <User size={48} className="text-orange-500" />,
      color: 'from-orange-500/20 to-red-600/20',
      features: [
        'Browse Products',
        'Online Ordering',
        'Wallet & Loyalty Points',
        'Order History',
        'Support Chat'
      ]
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % roles.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + roles.length) % roles.length);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 lg:p-12 flex flex-col">
      <header className="flex items-center justify-between mb-12">
        <button 
          onClick={onGoBack}
          className="p-3 bg-zinc-900 border border-white/10 rounded-2xl text-zinc-400 hover:text-white transition-all flex items-center gap-2 group"
        >
          <ChevronLeft className="rtl:rotate-180" size={24} />
          <span className="font-bold uppercase tracking-widest text-xs">{t('back')}</span>
        </button>
        <h2 className="text-2xl font-black tracking-tighter italic uppercase">{t('roleOverview')}</h2>
        <div className="w-12"></div>
      </header>

      <div className="flex-1 flex items-center justify-center relative">
        <button 
          onClick={prevSlide}
          className="absolute left-0 z-10 p-4 bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-full hover:bg-zinc-800 transition-all"
        >
          <ChevronLeft size={32} />
        </button>

        <div className="w-full max-w-4xl overflow-hidden px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`bg-gradient-to-br ${roles[currentSlide].color} border border-white/10 rounded-[3rem] p-12 flex flex-col lg:flex-row items-center gap-12`}
            >
              <div className="flex-1 space-y-6 text-center lg:text-left">
                <div className="w-24 h-24 bg-zinc-900 rounded-[2rem] flex items-center justify-center mx-auto lg:mx-0 shadow-2xl">
                  {roles[currentSlide].icon}
                </div>
                <h3 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic">
                  {roles[currentSlide].title}
                </h3>
                <p className="text-zinc-400 text-lg">
                  Explore the capabilities and permissions assigned to the {roles[currentSlide].id} role within the easyPOS ecosystem.
                </p>
              </div>

              <div className="flex-1 w-full space-y-4">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">Key Permissions</h4>
                {roles[currentSlide].features.map((feature, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-black/20 backdrop-blur-sm border border-white/5 rounded-2xl"
                  >
                    <CheckCircle2 size={20} className="text-brand-500 shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button 
          onClick={nextSlide}
          className="absolute right-0 z-10 p-4 bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-full hover:bg-zinc-800 transition-all"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      <div className="flex justify-center gap-4 mt-12">
        {roles.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-12 bg-brand-500' : 'w-2 bg-zinc-800'}`}
          />
        ))}
      </div>
    </div>
  );
};
