
import React, { useState } from 'react';
import { Store, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { Language } from '../types';

interface ShopAccessProps {
  language: Language;
  t: (key: string) => string;
  onVerify: (code: string) => void;
  initialCode?: string;
}

export const ShopAccess: React.FC<ShopAccessProps> = ({
  language,
  t,
  onVerify,
  initialCode = ''
}) => {
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 4) {
      setError('Please enter a valid shop code');
      return;
    }
    onVerify(code);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-brand-500/10 border border-brand-500/20 text-brand-500 mb-4">
            <Store size={40} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Shop Access</h1>
          <p className="text-zinc-500 text-sm">Enter the shop code provided by the merchant to browse their specific collection.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError('');
              }}
              placeholder="ENTER SHOP CODE"
              className="w-full bg-zinc-900 border-2 border-white/5 rounded-2xl py-4 px-6 text-center text-2xl font-black tracking-[0.5em] focus:border-brand-500 outline-none transition-all placeholder:text-zinc-800"
              maxLength={8}
            />
            <div className="absolute inset-0 rounded-2xl bg-brand-500/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity" />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-xs font-bold justify-center animate-shake">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-500 hover:text-white transition-all group"
          >
            Access Shop <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="pt-8 border-t border-white/5 text-center">
          <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            <ShieldCheck size={14} /> Secure Merchant Node Connection
          </div>
        </div>
      </div>
    </div>
  );
};
