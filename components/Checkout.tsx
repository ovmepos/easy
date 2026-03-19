
import React, { useState } from 'react';
import { ChevronLeft, CreditCard, ShieldCheck, Truck, MapPin, Phone, User, ShoppingBag } from 'lucide-react';
import { CartItem, Language, StoreSettings, AppView } from '../types';
import { formatCurrency } from '../utils/format';

interface CheckoutProps {
  cart: CartItem[];
  onCheckout: (items: CartItem[], total: number, paymentMethod: 'CASH' | 'CARD', subTotal: number, discount: number, tax: number, discountType: 'fixed' | 'percent', customerName?: string, customerPhone?: string) => Promise<void>;
  onNavigate: (view: AppView) => void;
  language: Language;
  storeSettings: StoreSettings;
  t: (key: string) => string;
}

export const Checkout: React.FC<CheckoutProps> = ({
  cart,
  onCheckout,
  onNavigate,
  language,
  storeSettings,
  t
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD'>('CARD');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = (cart || []).reduce((acc, item) => acc + (item.sellPrice * item.quantity), 0);
  const tax = storeSettings.taxEnabled ? subtotal * (storeSettings.taxRate / 100) : 0;
  const total = subtotal + tax;

  const handlePlaceOrder = async () => {
    if (!customerName || !customerPhone) {
      alert('Please fill in your name and phone number');
      return;
    }

    setIsProcessing(true);
    try {
      await onCheckout(
        cart,
        total,
        paymentMethod,
        subtotal,
        0, // discount
        tax,
        'fixed',
        customerName,
        customerPhone
      );
      // Success will be handled by App.tsx (navigation or success state)
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={() => onNavigate(AppView.CART)} className="p-2 -ml-2 text-slate-400 hover:text-brand-600 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-black italic uppercase tracking-tighter dark:text-white">Secure <span className="text-brand-600">Checkout</span></h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      <main className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-6">
        {/* Order Summary */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag size={18} className="text-brand-600" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white italic">Order Summary</h3>
          </div>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">{item.quantity}x {item.name}</span>
                <span className="text-slate-900 dark:text-white font-black">{formatCurrency(item.sellPrice * item.quantity, language, storeSettings.currency)}</span>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest italic">Total Amount</span>
            <span className="text-2xl font-black text-brand-600 tracking-tighter">{formatCurrency(total, language, storeSettings.currency)}</span>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <User size={18} className="text-brand-600" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white italic">Customer Details</h3>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Full Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand-600 transition-all dark:text-white"
              />
            </div>
            
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="tel" 
                placeholder="Phone Number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand-600 transition-all dark:text-white"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-4 top-4 text-slate-300" size={18} />
              <textarea 
                placeholder="Delivery Address"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                rows={3}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand-600 transition-all dark:text-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard size={18} className="text-brand-600" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white italic">Payment Method</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setPaymentMethod('CARD')}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'CARD' ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-900/20' : 'border-slate-100 dark:border-slate-800'}`}
            >
              <CreditCard size={24} className={paymentMethod === 'CARD' ? 'text-brand-600' : 'text-slate-400'} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'CARD' ? 'text-brand-600' : 'text-slate-400'}`}>Card</span>
            </button>
            <button 
              onClick={() => setPaymentMethod('CASH')}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'CASH' ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-900/20' : 'border-slate-100 dark:border-slate-800'}`}
            >
              <Truck size={24} className={paymentMethod === 'CASH' ? 'text-brand-600' : 'text-slate-400'} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'CASH' ? 'text-brand-600' : 'text-slate-400'}`}>Cash on Delivery</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
          <ShieldCheck className="text-emerald-600" size={20} />
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Secure encrypted checkout</p>
        </div>

        <button 
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className="w-full py-6 bg-brand-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 italic disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Place Order'}
        </button>
      </main>
    </div>
  );
};
