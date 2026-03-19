
import React, { useState, useMemo, useEffect } from 'react';
import { Sale, Product, Language, CartItem, User, StoreSettings } from '../types';
import { CURRENCY } from '../constants';
import { TrendingUp, Sparkles, PieChart, FileText, ChevronLeft, Activity, Target, History, ClipboardList, Loader2, FileSpreadsheet, Calendar as CalendarIcon, ArrowRight, Download, Package, ShoppingBag, BarChart3, Users, Zap, CalendarDays, Wallet, ReceiptText, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { generateBusinessInsight } from '../services/geminiService';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { formatNumber, formatCurrency } from '../utils/format';

interface ReportsProps {
  sales: Sale[];
  products: Product[];
  onGoBack?: () => void;
  language: Language;
  users?: User[];
  storeSettings?: StoreSettings;
}

type DateRange = 'today' | 'yesterday' | 'last7' | 'month' | 'custom' | 'all';
type ReportTab = 'FINANCIAL' | 'PRODUCTS' | 'OPERATORS';

export const Reports: React.FC<ReportsProps> = ({ sales, products, onGoBack, language, users = [], storeSettings }) => {
  const [activeTab, setActiveTab] = useState<ReportTab>('FINANCIAL');
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>('today');
  
  const [customStart, setCustomStart] = useState<string>(new Date().toISOString().split('T')[0]);
  const [customEnd, setCustomEnd] = useState<string>(new Date().toISOString().split('T')[0]);

  const stats = useMemo(() => {
    const now = new Date();
    const todayTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    const filtered = sales.filter(s => {
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).getTime();
      const last7 = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)).getTime();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

      if (dateRange === 'today') return s.timestamp >= todayTimestamp;
      if (dateRange === 'yesterday') return s.timestamp >= yesterday && s.timestamp < todayTimestamp;
      if (dateRange === 'last7') return s.timestamp >= last7;
      if (dateRange === 'month') return s.timestamp >= monthStart;
      if (dateRange === 'custom') {
        const start = new Date(customStart).setHours(0,0,0,0);
        const end = new Date(customEnd).setHours(23,59,59,999);
        return s.timestamp >= start && s.timestamp <= end;
      }
      return true;
    });

    let revenue = 0, cogs = 0, tax = 0, discount = 0, cashTotal = 0, cardTotal = 0;
    const productPerformance: Record<string, { name: string, qty: number, revenue: number, profit: number }> = {};
    const categoryPerformance: Record<string, { revenue: number, profit: number }> = {};
    const operatorPerformance: Record<string, { name: string, sales: number, count: number }> = {};

    filtered.forEach(sale => {
      revenue += sale.total;
      tax += (sale.tax || 0);
      discount += (sale.discount || 0);
      
      if (sale.paymentMethod === 'CASH') cashTotal += sale.total;
      else cardTotal += sale.total;

      const opId = sale.processedBy || 'unknown';
      if (!operatorPerformance[opId]) {
        const user = users.find(u => u.id === opId);
        operatorPerformance[opId] = { name: user?.name || 'System', sales: 0, count: 0 };
      }
      operatorPerformance[opId].sales += sale.total;
      operatorPerformance[opId].count += 1;

      sale.items.forEach(item => {
        const prod = products.find(p => p.id === item.id);
        const itemCost = (prod?.costPrice || 0) * item.quantity;
        const itemRevenue = item.sellPrice * item.quantity;
        const itemProfit = itemRevenue - itemCost;
        
        cogs += itemCost;

        if (!productPerformance[item.id]) {
          productPerformance[item.id] = { name: item.name, qty: 0, revenue: 0, profit: 0 };
        }
        productPerformance[item.id].qty += item.quantity;
        productPerformance[item.id].revenue += itemRevenue;
        productPerformance[item.id].profit += itemProfit;

        const category = prod?.category || 'General';
        if (!categoryPerformance[category]) {
          categoryPerformance[category] = { revenue: 0, profit: 0 };
        }
        categoryPerformance[category].revenue += itemRevenue;
        categoryPerformance[category].profit += itemProfit;
      });
    });

    const topProducts = Object.values(productPerformance).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
    const categoryBreakdown = Object.entries(categoryPerformance).map(([name, data]) => ({ name, ...data }));
    const operators = Object.values(operatorPerformance).sort((a, b) => b.sales - a.sales);

    // Specific "Today" metrics for quick check
    const todaySales = (sales || []).filter(s => s.timestamp >= todayTimestamp);
    const todayRevenue = todaySales.reduce((a, s) => a + (s.total || 0), 0);
    const todayProfit = todaySales.reduce((a, s) => {
        const cost = (s.items || []).reduce((acc, i) => acc + ((products.find(p => p.id === i.id)?.costPrice || 0) * i.quantity), 0);
        return a + ((s.total || 0) - cost);
    }, 0);

    return { 
      revenue, cogs, profit: revenue - cogs, transactions: filtered.length, tax, discount,
      cashTotal, cardTotal, topProducts, categoryBreakdown, operators, filteredSales: filtered,
      todayRevenue, todayCount: todaySales.length, todayProfit
    };
  }, [sales, products, dateRange, customStart, customEnd, users]);

  const handleExportZReport = () => {
    const doc = new jsPDF();
    doc.text(`Z-REPORT: ${dateRange.toUpperCase()}`, 14, 25);
    autoTable(doc, {
      startY: 40,
      head: [['Metric', 'Value']],
      body: [
        ['Date Range', dateRange.toUpperCase()],
        ['Gross Revenue', formatCurrency(stats.revenue, language, storeSettings?.currency || 'USD')],
        ['Cost of Goods', formatCurrency(stats.cogs, language, storeSettings?.currency || 'USD')],
        ['Net Profit', formatCurrency(stats.profit, language, storeSettings?.currency || 'USD')],
        ['Transaction Count', stats.transactions.toString()],
        ['Tax Total', formatCurrency(stats.tax, language, storeSettings?.currency || 'USD')],
        ['Discounts Issued', formatCurrency(stats.discount, language, storeSettings?.currency || 'USD')],
        ['Cash Payments', formatCurrency(stats.cashTotal, language, storeSettings?.currency || 'USD')],
        ['Card Payments', formatCurrency(stats.cardTotal, language, storeSettings?.currency || 'USD')]
      ]
    });
    doc.save(`easyPOS_ZReport_${dateRange}_${Date.now()}.pdf`);
  };

  const handleGenerateInsight = async () => {
    setLoadingAi(true);
    try {
      const res = await generateBusinessInsight(sales, products);
      setInsight(res);
    } catch (e) {
      setInsight("Unable to connect to AI engine.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 p-4 lg:p-8 overflow-hidden transition-colors">
      <div className="flex flex-col gap-6 mb-8 shrink-0">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
            <div className="flex items-center gap-4">
                <button onClick={onGoBack} className="p-3 -ml-3 rounded-2xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 shadow-sm border border-slate-100 transition-all active:scale-90 hover:text-brand-600">
                  <ChevronLeft size={28} className="rtl:rotate-180" />
                </button>
                <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Reports & Analytics</h2>
            </div>
            <div className="flex bg-white dark:bg-slate-900 rounded-[1.8rem] p-1.5 shadow-xl border border-slate-200">
                <button onClick={() => setActiveTab('FINANCIAL')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'FINANCIAL' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400'}`}>Financial</button>
                <button onClick={() => setActiveTab('PRODUCTS')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'PRODUCTS' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400'}`}>Products</button>
            </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 overflow-x-auto no-scrollbar py-2">
            {(['today', 'yesterday', 'last7', 'month', 'all'] as DateRange[]).map(r => (
                <button key={r} onClick={() => setDateRange(r)} className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border-2 transition-all whitespace-nowrap ${dateRange === r ? 'bg-slate-900 dark:bg-brand-500 text-white border-transparent shadow-md' : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800 hover:text-slate-900'}`}>{r}</button>
            ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 custom-scrollbar pb-10">
        {activeTab === 'FINANCIAL' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><CalendarDays size={80} className="text-brand-500" /></div>
                    <div className="relative z-10">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Today's Total Sale</span>
                        <div className="text-3xl font-black text-slate-900 dark:text-white">{formatCurrency(stats.todayRevenue, language, storeSettings?.currency || 'USD')}</div>
                        <p className="text-[9px] font-bold text-slate-400 mt-2">{stats.todayCount} Transactions Processed</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><TrendingUp size={80} className="text-emerald-500" /></div>
                    <div className="relative z-10">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Today's Est. Profit</span>
                        <div className="text-3xl font-black text-emerald-600">{formatCurrency(stats.todayProfit, language, storeSettings?.currency || 'USD')}</div>
                        <div className="flex items-center gap-1 text-emerald-500 mt-2">
                           <ArrowUpRight size={14}/>
                           <span className="text-[9px] font-black uppercase">Margin Target Met</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><ReceiptText size={80} className="text-amber-500" /></div>
                    <div className="relative z-10">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Selected Range Revenue</span>
                        <div className="text-3xl font-black text-slate-900 dark:text-white">{formatCurrency(stats.revenue, language, storeSettings?.currency || 'USD')}</div>
                        <p className="text-[9px] font-bold text-slate-400 mt-2">Total Volume for {dateRange.toUpperCase()}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50 flex justify-between items-center">
                        <h4 className="text-2xl font-black italic uppercase tracking-tighter dark:text-white">Recent Sales Ledger</h4>
                        <button onClick={handleExportZReport} className="px-6 py-3 bg-slate-900 dark:bg-brand-600 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2"><FileText size={16}/> Export Z-Report</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-black uppercase text-[9px] tracking-widest">
                            <tr><th className="p-8">Timestamp</th><th className="p-8">Order ID</th><th className="p-8 text-right">Revenue</th><th className="p-8 text-right">Profit</th></tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                              {(stats.filteredSales || []).map(s => {
                                const cost = (s.items || []).reduce((acc, i) => acc + ((products.find(p => p.id === i.id)?.costPrice || 0) * i.quantity), 0);
                                return (
                                    <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                                        <td className="p-8 text-xs font-bold dark:text-white">{new Date(s.timestamp).toLocaleString()}</td>
                                        <td className="p-8 font-mono text-xs text-slate-400">#ORD-{s.id.slice(-6)}</td>
                                        <td className="p-8 text-right font-black text-slate-900 dark:text-white">{formatCurrency(s.total || 0, language, storeSettings?.currency || 'USD')}</td>
                                        <td className="p-8 text-right font-black text-emerald-500">+{formatCurrency((s.total || 0) - cost, language, storeSettings?.currency || 'USD')}</td>
                                    </tr>
                                );
                              })}
                              {stats.filteredSales.length === 0 && (
                                  <tr><td colSpan={4} className="p-20 text-center text-slate-300 font-black uppercase tracking-widest text-[10px] italic">No transaction data for this period</td></tr>
                              )}
                          </tbody>
                      </table>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900 text-white p-8 rounded-[3.5rem] shadow-2xl relative overflow-hidden border-2 border-brand-500/20">
                        <div className="absolute top-0 right-0 p-8 opacity-20"><Sparkles size={100} className="text-brand-400" /></div>
                        <div className="relative z-10">
                            <h4 className="text-xl font-black italic uppercase tracking-tighter mb-4">Gemini Business AI</h4>
                            <p className="text-xs font-medium text-slate-400 leading-relaxed mb-8">Generate an executive analysis of your sales performance and inventory health.</p>
                            {insight ? (
                              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-[10px] font-medium leading-relaxed italic mb-8 animate-fade-in">{insight}</div>
                            ) : null}
                            <button disabled={loadingAi} onClick={handleGenerateInsight} className="w-full py-4 bg-brand-600 hover:bg-brand-500 rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50">
                                {loadingAi ? <Loader2 size={16} className="animate-spin" /> : <><Sparkles size={16}/> Refresh Insight</>}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800 pb-4">Revenue Mix</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Cash Payments</span>
                                <span className="text-sm font-black dark:text-white">{formatCurrency(stats.cashTotal, language, storeSettings?.currency || 'USD')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Card Payments</span>
                                <span className="text-sm font-black dark:text-white">{formatCurrency(stats.cardTotal, language, storeSettings?.currency || 'USD')}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-800 text-rose-500">
                                <span className="text-xs font-bold">Total Discounts issued</span>
                                <span className="text-sm font-black">-{formatCurrency(stats.discount, language, storeSettings?.currency || 'USD')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'PRODUCTS' && (
            <div className="animate-fade-in space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 dark:border-slate-800">
                        <h4 className="text-2xl font-black italic uppercase tracking-tighter dark:text-white">Product Performance Matrix</h4>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-black uppercase text-[9px] tracking-widest">
                                <tr><th className="p-8">Product Identity</th><th className="p-8 text-center">Volume Sold</th><th className="p-8 text-right">Total Revenue</th><th className="p-8 text-right">Total Profit</th></tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {stats.topProducts.map(p => (
                                    <tr key={p.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                                        <td className="p-8 font-black uppercase italic text-sm dark:text-white">{p.name}</td>
                                        <td className="p-8 text-center font-bold text-slate-400">{p.qty}</td>
                                        <td className="p-8 text-right font-black text-slate-900 dark:text-white">{formatCurrency(p.revenue, language, storeSettings?.currency || 'USD')}</td>
                                        <td className="p-8 text-right font-black text-emerald-500">+{formatCurrency(p.profit, language, storeSettings?.currency || 'USD')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {stats.categoryBreakdown.map(cat => (
                        <div key={cat.name} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-brand-500 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h4 className="text-xl font-black italic uppercase tracking-tighter dark:text-white">{cat.name}</h4>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Category Insights</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all"><PieChart size={24}/></div>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Category Revenue</p>
                                    <p className="text-3xl font-black dark:text-white tracking-tighter">{formatCurrency(cat.revenue, language, storeSettings?.currency || 'USD')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Profit Contribution</p>
                                    <p className="text-2xl font-black text-emerald-500 tracking-tighter">+{formatCurrency(cat.profit, language, storeSettings?.currency || 'USD')}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
