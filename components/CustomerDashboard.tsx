
import React, { useState } from 'react';
import { 
  Wallet, 
  History, 
  Package, 
  MessageCircle, 
  ChevronRight, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  Truck,
  User as UserIcon,
  Settings,
  Bell
} from 'lucide-react';
import { User, Language, Sale } from '../types';
import { formatCurrency } from '../utils/format';
import { CURRENCY } from '../constants';

interface CustomerDashboardProps {
  currentUser: User;
  language: Language;
  t: (key: string) => string;
  sales: Sale[];
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  language,
  t,
  sales
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wallet' | 'support'>('overview');

  const customerOrders = sales.filter(s => s.customerPhone === currentUser.username || s.processedBy === currentUser.id);

  const stats = [
    { label: 'Total Orders', value: customerOrders.length, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Wallet Balance', value: formatCurrency(currentUser.walletBalance || 0, language, CURRENCY), icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Active Tracks', value: '2', icon: Truck, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Sidebar Navigation */}
      <div className="fixed left-0 top-0 bottom-0 w-20 lg:w-64 bg-[#050505] border-r border-white/5 flex flex-col z-50">
        <div className="p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center font-black text-xl">E</div>
            <span className="hidden lg:block font-black tracking-tighter text-xl italic uppercase">Dashboard</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'overview', icon: UserIcon, label: 'Overview' },
            { id: 'orders', icon: History, label: 'Order History' },
            { id: 'wallet', icon: Wallet, label: 'My Wallet' },
            { id: 'support', icon: MessageCircle, label: 'Support Chat' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                activeTab === item.id 
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                  : 'text-zinc-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={24} />
              <span className="hidden lg:block font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
          <button className="w-full flex items-center gap-4 p-4 text-zinc-500 hover:text-white transition-colors">
            <Settings size={24} />
            <span className="hidden lg:block font-bold text-sm">Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-20 lg:pl-64 min-h-screen">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold capitalize">{activeTab}</h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full border-2 border-[#0a0a0a]"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/5">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold">{currentUser.name}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Customer</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 overflow-hidden">
                {currentUser.avatar ? <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" /> : <UserIcon className="w-full h-full p-2 text-zinc-600" />}
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto space-y-8">
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-8 group hover:border-brand-500/50 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                        <stat.icon size={24} />
                      </div>
                      <button className="text-zinc-500 hover:text-white transition-colors">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                    <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
                    <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
                  </div>
                ))}
              </div>

              {/* Recent Activity & Tracking */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold">Recent Orders</h3>
                    <button className="text-brand-500 text-xs font-bold hover:underline">View All</button>
                  </div>
                  <div className="space-y-6">
                    {customerOrders.slice(0, 5).map((order, idx) => (
                      <div key={idx} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 group-hover:bg-brand-500 group-hover:text-white transition-all">
                            <Package size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-sm">Order #{order.id.slice(-6).toUpperCase()}</p>
                            <p className="text-xs text-zinc-500">{new Date(order.timestamp).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-sm">{formatCurrency(order.total, language, CURRENCY)}</p>
                          <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Completed</p>
                        </div>
                      </div>
                    ))}
                    {customerOrders.length === 0 && (
                      <div className="py-12 text-center text-zinc-600">
                        <Package size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-sm">No orders yet</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
                  <h3 className="text-lg font-bold mb-8">Order Tracking</h3>
                  <div className="space-y-8">
                    <div className="relative pl-8 border-l-2 border-brand-500/20">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 bg-brand-500 rounded-full shadow-lg shadow-brand-500/50"></div>
                      <div className="space-y-1">
                        <p className="font-bold text-sm">Out for Delivery</p>
                        <p className="text-xs text-zinc-500">Your package is on its way to you.</p>
                        <p className="text-[10px] text-brand-500 font-bold">Today, 10:30 AM</p>
                      </div>
                    </div>
                    <div className="relative pl-8 border-l-2 border-brand-500/20">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 bg-zinc-800 rounded-full"></div>
                      <div className="space-y-1">
                        <p className="font-bold text-sm text-zinc-400">Arrived at Facility</p>
                        <p className="text-xs text-zinc-600">Lucknow Hub, Uttar Pradesh</p>
                        <p className="text-[10px] text-zinc-600 font-bold">Yesterday, 08:45 PM</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-12 p-6 bg-brand-500/10 border border-brand-500/20 rounded-3xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
                        <Truck size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold">Estimated Delivery</p>
                        <p className="text-sm font-black">Tomorrow, by 8 PM</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-white text-black text-[10px] font-black rounded-full uppercase tracking-widest">Track</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'wallet' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-[3rem] p-12 relative overflow-hidden shadow-2xl shadow-brand-500/20">
                <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-brand-100/60 text-sm font-bold uppercase tracking-widest mb-2">Available Balance</p>
                      <h3 className="text-5xl font-black tracking-tighter">{formatCurrency(currentUser.walletBalance || 0, language, CURRENCY)}</h3>
                    </div>
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                      <CreditCard size={32} />
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button className="flex-1 bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all">
                      <ArrowUpRight size={18} /> Add Money
                    </button>
                    <button className="flex-1 bg-black/20 backdrop-blur-md text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-black/30 transition-all border border-white/10">
                      <ArrowDownLeft size={18} /> Withdraw
                    </button>
                  </div>
                </div>
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-[100px]"></div>
              </div>

              <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
                <h3 className="text-lg font-bold mb-8">Recent Transactions</h3>
                <div className="space-y-6">
                  {[
                    { type: 'debit', label: 'Order #POS-1234', amount: '₹499', date: 'Mar 15, 2026', icon: Package },
                    { type: 'credit', label: 'Wallet Top-up', amount: '₹1,000', date: 'Mar 12, 2026', icon: ArrowUpRight },
                    { type: 'debit', label: 'Order #POS-1211', amount: '₹120', date: 'Mar 10, 2026', icon: Package },
                  ].map((tx, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-400'}`}>
                          <tx.icon size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{tx.label}</p>
                          <p className="text-xs text-zinc-500">{tx.date}</p>
                        </div>
                      </div>
                      <p className={`font-black ${tx.type === 'credit' ? 'text-emerald-500' : 'text-white'}`}>
                        {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="h-[calc(100vh-12rem)] bg-zinc-900/50 border border-white/5 rounded-[2.5rem] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/80 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">Support Assistant</h3>
                    <p className="text-xs text-emerald-500 flex items-center gap-1">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Online
                    </p>
                  </div>
                </div>
                <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                  <Settings size={20} />
                </button>
              </div>

              <div className="flex-1 p-8 overflow-y-auto space-y-6 no-scrollbar">
                <div className="flex gap-4 max-w-lg">
                  <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center shrink-0">
                    <MessageCircle size={16} />
                  </div>
                  <div className="bg-zinc-800 p-4 rounded-2xl rounded-tl-none text-sm leading-relaxed">
                    Hello {currentUser.name}! How can I assist you today with your orders or wallet?
                  </div>
                </div>
                
                <div className="flex gap-4 max-w-lg ml-auto flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
                    <UserIcon size={16} />
                  </div>
                  <div className="bg-brand-500 p-4 rounded-2xl rounded-tr-none text-sm leading-relaxed">
                    I want to track my recent order.
                  </div>
                </div>

                <div className="flex gap-4 max-w-lg">
                  <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center shrink-0">
                    <MessageCircle size={16} />
                  </div>
                  <div className="bg-zinc-800 p-4 rounded-2xl rounded-tl-none text-sm leading-relaxed">
                    Sure! Your order #POS-1234 is currently out for delivery and is expected to arrive by 8 PM tomorrow.
                  </div>
                </div>
              </div>

              <div className="p-6 bg-zinc-900/80 backdrop-blur-md border-t border-white/5">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Type your message..." 
                    className="w-full bg-zinc-800 border border-white/5 rounded-2xl py-4 pl-6 pr-16 text-sm focus:border-brand-500 outline-none transition-all"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-all">
                    <ArrowUpRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
