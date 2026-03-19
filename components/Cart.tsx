
import React from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ChevronLeft, CreditCard, ShoppingCart } from 'lucide-react';
import { CartItem, Language, StoreSettings, AppView } from '../types';
import { formatCurrency } from '../utils/format';

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onNavigate: (view: AppView) => void;
  language: Language;
  storeSettings: StoreSettings;
  t: (key: string) => string;
}

export const Cart: React.FC<CartProps> = ({
  cart,
  onUpdateQuantity,
  onRemove,
  onNavigate,
  language,
  storeSettings,
  t
}) => {
  const subtotal = cart.reduce((acc, item) => acc + (item.sellPrice * item.quantity), 0);
  const tax = storeSettings.taxEnabled ? subtotal * (storeSettings.taxRate / 100) : 0;
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center text-slate-300 mb-6">
          <ShoppingCart size={48} strokeWidth={1} />
        </div>
        <h2 className="text-2xl font-black italic uppercase tracking-tighter dark:text-white mb-2">Your Cart is Empty</h2>
        <p className="text-slate-400 text-sm mb-8 max-w-xs">Looks like you haven't added anything to your cart yet.</p>
        <button 
          onClick={() => onNavigate(AppView.CUSTOMER_PORTAL)}
          className="px-8 py-4 bg-brand-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all flex items-center gap-2"
        >
          <ChevronLeft size={16} /> Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={() => onNavigate(AppView.CUSTOMER_PORTAL)} className="p-2 -ml-2 text-slate-400 hover:text-brand-600 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-black italic uppercase tracking-tighter dark:text-white">Your <span className="text-brand-600">Cart</span></h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      <main className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-6">
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden shrink-0">
                {item.image ? (
                  <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200">
                    <ShoppingBag size={24} />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase italic truncate">{item.name}</h4>
                <div className="flex gap-2 mt-1">
                  {item.selectedSize && <span className="text-[8px] font-black uppercase text-slate-400">Size: {item.selectedSize}</span>}
                  {item.selectedColor && <span className="text-[8px] font-black uppercase text-slate-400">Color: {item.selectedColor}</span>}
                </div>
                <p className="text-brand-600 font-black text-sm mt-1">{formatCurrency(item.sellPrice, language, storeSettings.currency)}</p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <button 
                  onClick={() => onRemove(item.id)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl">
                  <button 
                    onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-brand-600"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-xs font-black dark:text-white w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-brand-600"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal, language, storeSettings.currency)}</span>
          </div>
          {storeSettings.taxEnabled && (
            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>{storeSettings.taxName || 'Tax'} ({storeSettings.taxRate}%)</span>
              <span>{formatCurrency(tax, language, storeSettings.currency)}</span>
            </div>
          )}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest italic">Total</span>
            <span className="text-3xl font-black text-brand-600 tracking-tighter">{formatCurrency(total, language, storeSettings.currency)}</span>
          </div>
        </div>

        <button 
          onClick={() => onNavigate(AppView.CHECKOUT)}
          className="w-full py-6 bg-brand-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 italic"
        >
          <CreditCard size={20} /> Proceed to Checkout
        </button>
      </main>
    </div>
  );
};
