
import React, { useState, useMemo } from 'react';
import { Product, Sale, User, Language, StoreSettings, Category, GiftCard, Brand, PremiumPlan } from '../types';
import { formatCurrency } from '../utils/format';
import { 
  Package, TrendingUp, DollarSign, Search, Plus, List, ChevronLeft, 
  ShoppingBag, Layers, Users, ShieldCheck, Trash2, Edit2, X, Save, 
  Key, Mail, Store, Cloud, Calendar, RefreshCw, Loader2, Zap, 
  UserCheck, ShieldAlert, MapPin, Type, Copy, Tag, CreditCard, 
  Award, Image as ImageIcon, Sparkles, Star, CheckCircle2
} from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  sales: Sale[];
  users: User[];
  categories: Category[];
  giftCards: GiftCard[];
  brands: Brand[];
  premiumPlans: PremiumPlan[];
  currentUser: User;
  onAddCategory: (c: Omit<Category, 'id'>) => void;
  onUpdateCategory: (c: Category) => void;
  onDeleteCategory: (id: string) => void;
  onAddGiftCard: (gc: Omit<GiftCard, 'id'>) => void;
  onUpdateGiftCard: (gc: GiftCard) => void;
  onDeleteGiftCard: (id: string) => void;
  onAddBrand: (b: Omit<Brand, 'id'>) => void;
  onUpdateBrand: (b: Brand) => void;
  onDeleteBrand: (id: string) => void;
  onAddPremiumPlan: (p: Omit<PremiumPlan, 'id'>) => void;
  onUpdatePremiumPlan: (p: PremiumPlan) => void;
  onDeletePremiumPlan: (id: string) => void;
  onAddUser: (u: Omit<User, 'id'>) => void;
  onUpdateUser: (u: User) => void;
  onDeleteUser: (id: string) => void;
  language: Language;
  t: (key: string) => string;
  storeSettings: StoreSettings;
  onGoBack?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products, sales, users, categories, giftCards, brands, premiumPlans, currentUser,
  onAddCategory, onUpdateCategory, onDeleteCategory,
  onAddGiftCard, onUpdateGiftCard, onDeleteGiftCard,
  onAddBrand, onUpdateBrand, onDeleteBrand,
  onAddPremiumPlan, onUpdatePremiumPlan, onDeletePremiumPlan,
  onAddUser, onUpdateUser, onDeleteUser,
  language, t, storeSettings, onGoBack
}) => {
  const [activeSubView, setActiveSubView] = useState<'DASHBOARD' | 'CATALOG' | 'PLANS' | 'USERS' | 'MEDIA' | 'SETTINGS'>('DASHBOARD');
  const [activeCatalogTab, setActiveCatalogTab] = useState<'CATEGORIES' | 'GIFT_CARDS' | 'BRANDS'>('CATEGORIES');
  const [mediaItems, setMediaItems] = useState<{id: string, url: string, name: string}[]>(() => {
    const saved = localStorage.getItem('easypos_admin_media');
    return saved ? JSON.parse(saved) : [];
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSystemLive, setIsSystemLive] = useState(true);

  React.useEffect(() => {
    localStorage.setItem('easypos_admin_media', JSON.stringify(mediaItems));
  }, [mediaItems]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'CATEGORY' | 'GIFT_CARD' | 'BRAND' | 'PLAN' | 'USER'>('CATEGORY');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [categoryFormData, setCategoryFormData] = useState<Partial<Category>>({
    name: '', description: '', icon: '', color: ''
  });

  const [giftCardFormData, setGiftCardFormData] = useState<Partial<GiftCard>>({
    name: '', icon: '', discount: ''
  });

  const [brandFormData, setBrandFormData] = useState<Partial<Brand>>({
    name: '', logo: ''
  });

  const [planFormData, setPlanFormData] = useState<Partial<PremiumPlan>>({
    name: '', price: 0, duration: 'Monthly', features: [], isPopular: false, avatarUrl: ''
  });

  const [userFormData, setUserFormData] = useState<Partial<User>>({
    name: '', username: '', password: '', role: 'STAFF', email: '', vendorId: ''
  });

  const stats = useMemo(() => {
    const totalRevenue = (sales || []).reduce((acc, s) => acc + (s.total || 0), 0);
    const totalOrders = (sales || []).length;
    const totalCustomers = (users || []).filter(u => u.role === 'CUSTOMER').length;
    return { totalRevenue, totalOrders, totalCustomers };
  }, [sales, users]);

  const handleSaveCategory = () => {
    if (!categoryFormData.name) return;
    const data = { ...categoryFormData } as Category;
    if (editingId) {
      onUpdateCategory({ ...data, id: editingId });
    } else {
      onAddCategory(data);
    }
    setIsModalOpen(false);
    setCategoryFormData({ name: '', description: '', icon: '', color: '' });
  };

  const handleSaveGiftCard = () => {
    if (!giftCardFormData.name) return;
    const data = { ...giftCardFormData } as GiftCard;
    if (editingId) {
      onUpdateGiftCard({ ...data, id: editingId });
    } else {
      onAddGiftCard(data);
    }
    setIsModalOpen(false);
    setGiftCardFormData({ name: '', icon: '', discount: '' });
  };

  const handleSaveBrand = () => {
    if (!brandFormData.name) return;
    const data = { ...brandFormData } as Brand;
    if (editingId) {
      onUpdateBrand({ ...data, id: editingId });
    } else {
      onAddBrand(data);
    }
    setIsModalOpen(false);
    setBrandFormData({ name: '', logo: '' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        url: base64String,
        name: file.name
      };
      setMediaItems(prev => [newItem, ...prev]);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here
  };

  const handleSavePlan = () => {
    if (!planFormData.name) return;
    const data = { ...planFormData } as PremiumPlan;
    if (editingId) {
      onUpdatePremiumPlan({ ...data, id: editingId });
    } else {
      onAddPremiumPlan(data);
    }
    setIsModalOpen(false);
    setPlanFormData({ name: '', price: 0, duration: 'Monthly', features: [], isPopular: false, avatarUrl: '' });
  };

  const handleSaveUser = () => {
    if (!userFormData.name || !userFormData.username) return;
    const data = { ...userFormData } as User;
    if (editingId) {
      onUpdateUser({ ...data, id: editingId });
    } else {
      onAddUser(data);
    }
    setIsModalOpen(false);
    setUserFormData({ name: '', username: '', password: '', role: 'STAFF', email: '', vendorId: '' });
  };

  const addFeature = () => {
    setPlanFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...(planFormData.features || [])];
    newFeatures[index] = value;
    setPlanFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const removeFeature = (index: number) => {
    setPlanFormData(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="flex flex-col h-[100svh] bg-slate-50 dark:bg-slate-950 p-4 lg:p-8 overflow-y-auto custom-scrollbar transition-colors">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 md:mb-8 gap-6">
        <div className="flex items-center gap-4">
          <button onClick={onGoBack} className="p-2.5 -ml-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-90 hover:text-brand-600"><ChevronLeft size={24} className="rtl:rotate-180" /></button>
          <div className="min-w-0">
            <h2 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none truncate">Master Admin Panel</h2>
            <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest mt-1">System Control Center</p>
          </div>
        </div>
        <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto no-scrollbar shrink-0">
            <button onClick={() => setActiveSubView('DASHBOARD')} className={`px-4 py-2.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubView === 'DASHBOARD' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm' : 'text-slate-500'}`}>Overview</button>
            <button onClick={() => setActiveSubView('CATALOG')} className={`px-4 py-2.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubView === 'CATALOG' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm' : 'text-slate-500'}`}>Catalog</button>
            <button onClick={() => setActiveSubView('PLANS')} className={`px-4 py-2.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubView === 'PLANS' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm' : 'text-slate-500'}`}>Premium Plans</button>
            <button onClick={() => setActiveSubView('USERS')} className={`px-4 py-2.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubView === 'USERS' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm' : 'text-slate-500'}`}>Users</button>
            <button onClick={() => setActiveSubView('MEDIA')} className={`px-4 py-2.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubView === 'MEDIA' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm' : 'text-slate-500'}`}>Media</button>
            <button onClick={() => setActiveSubView('SETTINGS')} className={`px-4 py-2.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubView === 'SETTINGS' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm' : 'text-slate-500'}`}>Settings</button>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-xl">
            <div className={`w-2 h-2 rounded-full ${isSystemLive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${isSystemLive ? 'text-emerald-600' : 'text-red-600'}`}>{isSystemLive ? 'System Live' : 'System Offline'}</span>
            <div className="w-px h-4 bg-emerald-200 dark:bg-emerald-800/50 mx-1"></div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{users.length} Active</span>
        </div>
      </div>

      {activeSubView === 'DASHBOARD' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><DollarSign size={64} className="text-emerald-500" /></div>
                <div className="relative z-10">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Revenue</span>
                    <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">{formatCurrency(stats.totalRevenue, language, storeSettings?.currency || 'USD')}</div>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><ShoppingBag size={64} className="text-amber-500" /></div>
                <div className="relative z-10">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Orders</span>
                    <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">{stats.totalOrders}</div>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><Users size={64} className="text-brand-500" /></div>
                <div className="relative z-10">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Customers</span>
                    <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">{stats.totalCustomers}</div>
                </div>
            </div>
        </div>
      ) : activeSubView === 'CATALOG' ? (
        <div className="animate-fade-in space-y-6 md:space-y-8 pb-20">
            <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl w-fit">
                <button onClick={() => setActiveCatalogTab('CATEGORIES')} className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeCatalogTab === 'CATEGORIES' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm' : 'text-slate-500'}`}>Categories</button>
                <button onClick={() => setActiveCatalogTab('GIFT_CARDS')} className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeCatalogTab === 'GIFT_CARDS' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm' : 'text-slate-500'}`}>Gift Cards</button>
                <button onClick={() => setActiveCatalogTab('BRANDS')} className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeCatalogTab === 'BRANDS' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm' : 'text-slate-500'}`}>Brands</button>
            </div>

            {activeCatalogTab === 'CATEGORIES' && (
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border-2 border-brand-500/20">
                        <div className="text-center md:text-left">
                            <h3 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter mb-1">All Categories</h3>
                            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[8px] md:text-[10px]">{categories.length} Total Categories</p>
                        </div>
                        <button onClick={() => { setEditingId(null); setModalType('CATEGORY'); setCategoryFormData({ name: '', description: '', icon: '', color: '' }); setIsModalOpen(true); }} className="w-full md:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 italic">
                            <Plus size={16} strokeWidth={3} /> New Category
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categories.map((c) => (
                        <div key={c.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-xl transition-all">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${c.color || 'bg-slate-100'}`}>{c.icon || '📁'}</div>
                            <div className="flex gap-2">
                              <button onClick={() => { setEditingId(c.id); setModalType('CATEGORY'); setCategoryFormData(c); setIsModalOpen(true); }} className="p-2 text-slate-300 hover:text-brand-500 transition-colors"><Edit2 size={16}/></button>
                              <button onClick={() => onDeleteCategory(c.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                            </div>
                          </div>
                          <h4 className="text-lg font-black uppercase italic tracking-tighter dark:text-white mb-1">{c.name}</h4>
                          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{c.description || 'Global Category'}</p>
                        </div>
                      ))}
                    </div>
                </div>
            )}

            {activeCatalogTab === 'GIFT_CARDS' && (
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border-2 border-brand-500/20">
                        <div className="text-center md:text-left">
                            <h3 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter mb-1">Gift Cards</h3>
                            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[8px] md:text-[10px]">{giftCards.length} Active Cards</p>
                        </div>
                        <button onClick={() => { setEditingId(null); setModalType('GIFT_CARD'); setGiftCardFormData({ name: '', icon: '', discount: '' }); setIsModalOpen(true); }} className="w-full md:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 italic">
                            <Plus size={16} strokeWidth={3} /> New Gift Card
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {giftCards.map((gc) => (
                            <div key={gc.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 p-2 flex items-center justify-center overflow-hidden">
                                        <img src={gc.icon} alt={gc.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditingId(gc.id); setModalType('GIFT_CARD'); setGiftCardFormData(gc); setIsModalOpen(true); }} className="p-2 text-slate-300 hover:text-brand-500 transition-colors"><Edit2 size={16}/></button>
                                        <button onClick={() => onDeleteGiftCard(gc.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                    </div>
                                </div>
                                <h4 className="text-lg font-black uppercase italic tracking-tighter dark:text-white mb-1">{gc.name}</h4>
                                <div className="text-brand-600 font-black text-xs uppercase tracking-widest italic">{gc.discount}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeCatalogTab === 'BRANDS' && (
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border-2 border-brand-500/20">
                        <div className="text-center md:text-left">
                            <h3 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter mb-1">Favourite Brands</h3>
                            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[8px] md:text-[10px]">{brands.length} Partner Brands</p>
                        </div>
                        <button onClick={() => { setEditingId(null); setModalType('BRAND'); setBrandFormData({ name: '', logo: '' }); setIsModalOpen(true); }} className="w-full md:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 italic">
                            <Plus size={16} strokeWidth={3} /> New Brand
                        </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {brands.map((b) => (
                            <div key={b.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-xl transition-all flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 p-3 flex items-center justify-center overflow-hidden mb-4">
                                    <img src={b.logo} alt={b.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                                </div>
                                <h4 className="text-[10px] font-black uppercase italic tracking-widest dark:text-white mb-4">{b.name}</h4>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => { setEditingId(b.id); setModalType('BRAND'); setBrandFormData(b); setIsModalOpen(true); }} className="p-1.5 text-slate-300 hover:text-brand-500 transition-colors"><Edit2 size={14}/></button>
                                    <button onClick={() => onDeleteBrand(b.id)} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      ) : activeSubView === 'PLANS' ? (
        <div className="animate-fade-in space-y-8 pb-20">
            <div className="bg-gradient-to-br from-slate-900 to-brand-950 text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 border-2 border-brand-500/30">
                <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><Sparkles size={160} className="text-brand-400" /></div>
                <div className="relative z-10 text-center md:text-left">
                    <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-2 flex items-center gap-3 justify-center md:justify-start">
                      easyPOS <span className="text-brand-400">PREMIUM</span>
                    </h3>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Manage Subscription Packages & AI Avatars</p>
                </div>
                <button onClick={() => { setEditingId(null); setModalType('PLAN'); setPlanFormData({ name: '', price: 0, duration: 'Monthly', features: [], isPopular: false, avatarUrl: '' }); setIsModalOpen(true); }} className="relative z-10 w-full md:w-auto px-10 py-5 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 italic">
                    <Plus size={18} strokeWidth={3} /> Create New Plan
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {premiumPlans.map((plan) => (
                <div key={plan.id} className={`bg-white dark:bg-slate-900 rounded-[3rem] border-2 p-8 shadow-xl transition-all hover:scale-[1.02] relative flex flex-col ${plan.isPopular ? 'border-brand-500' : 'border-slate-100 dark:border-slate-800'}`}>
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-600 text-white px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">Most Popular</div>
                  )}
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 p-2 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700">
                      {plan.avatarUrl ? (
                        <img src={plan.avatarUrl} alt="AI Avatar" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <Sparkles size={32} className="text-brand-500" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingId(plan.id); setModalType('PLAN'); setPlanFormData(plan); setIsModalOpen(true); }} className="p-2 text-slate-300 hover:text-brand-500 transition-colors"><Edit2 size={18}/></button>
                      <button onClick={() => onDeletePremiumPlan(plan.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                    </div>
                  </div>

                  <h4 className="text-2xl font-black uppercase italic tracking-tighter dark:text-white mb-2">{plan.name}</h4>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-black text-brand-600 tracking-tighter">{formatCurrency(plan.price, language, storeSettings.currency)}</span>
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">/ {plan.duration}</span>
                  </div>

                  <div className="space-y-4 flex-1 mb-8">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-brand-500 shrink-0" />
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Star size={14} className="text-amber-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Premium AI Features Enabled</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      ) : activeSubView === 'MEDIA' ? (
        <div className="animate-fade-in space-y-8 pb-20">
            <div className="bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 border-2 border-brand-500/30">
                <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><ImageIcon size={160} className="text-brand-400" /></div>
                <div className="relative z-10 text-center md:text-left">
                    <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-2 flex items-center gap-3 justify-center md:justify-start">
                      Media <span className="text-brand-400">Gallery</span>
                    </h3>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Upload & Generate Image URLs for Products</p>
                </div>
                <label className="relative z-10 w-full md:w-auto px-10 py-5 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 italic cursor-pointer">
                    <Plus size={18} strokeWidth={3} /> {isUploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {mediaItems.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-xl transition-all overflow-hidden flex flex-col">
                        <div className="aspect-square relative overflow-hidden bg-slate-50 dark:bg-slate-800">
                            <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button onClick={() => copyToClipboard(item.url)} className="p-3 bg-white text-slate-900 rounded-xl hover:bg-brand-500 hover:text-white transition-all shadow-xl"><Copy size={18} /></button>
                                <button onClick={() => setMediaItems(prev => prev.filter(i => i.id !== item.id))} className="p-3 bg-white text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-xl"><Trash2 size={18} /></button>
                            </div>
                        </div>
                        <div className="p-4 flex flex-col gap-1">
                            <div className="text-[9px] font-black text-slate-900 dark:text-white uppercase truncate">{item.name}</div>
                            <div className="text-[7px] font-bold text-slate-400 uppercase tracking-widest truncate">ID: {item.id}</div>
                        </div>
                    </div>
                ))}
                {mediaItems.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <ImageIcon size={40} />
                        </div>
                        <h4 className="text-lg font-black uppercase italic tracking-tighter text-slate-400">No Media Found</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload your first image to get started</p>
                    </div>
                )}
            </div>
        </div>
      ) : activeSubView === 'USERS' ? (
        <div className="animate-fade-in space-y-6 pb-20">
            <div className="bg-slate-900 text-white p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border-2 border-brand-500/20">
                <div className="text-center md:text-left">
                    <h3 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter mb-1">User Management</h3>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[8px] md:text-[10px]">{users.length} Total Users</p>
                </div>
                <button onClick={() => { setEditingId(null); setModalType('USER'); setUserFormData({ name: '', username: '', password: '', role: 'STAFF', email: '', vendorId: '' }); setIsModalOpen(true); }} className="w-full md:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 italic">
                    <Plus size={16} strokeWidth={3} /> New User
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-black uppercase text-[9px] tracking-widest">
                            <tr><th className="p-8">User Identity</th><th className="p-8">Role</th><th className="p-8">Email</th><th className="p-8 text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-slate-400 uppercase italic text-sm">{u.name.charAt(0)}</div>
                                            <div className="font-black text-slate-900 dark:text-white uppercase italic text-sm">{u.name}</div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                        u.role === 'ADMIN' ? 'bg-red-50 text-red-600 border-red-100' : 
                                        u.role === 'VENDOR' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                        'bg-slate-50 text-slate-600 border-slate-100'
                                      }`}>
                                        {u.role}
                                      </span>
                                    </td>
                                    <td className="p-8 text-slate-500 text-[11px] font-bold uppercase tracking-widest">{u.email || 'N/A'}</td>
                                    <td className="p-8 text-right">
                                      <div className="flex justify-end gap-2">
                                        <button onClick={() => { setEditingId(u.id); setModalType('USER'); setUserFormData(u); setIsModalOpen(true); }} className="p-3 text-slate-300 hover:text-brand-500 transition-colors"><Edit2 size={18}/></button>
                                        <button onClick={() => onDeleteUser(u.id)} className="p-3 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                                      </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      ) : activeSubView === 'SETTINGS' ? (
        <div className="animate-fade-in space-y-8 pb-20">
            <div className="bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 border-2 border-brand-500/30">
                <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><ShieldCheck size={160} className="text-brand-400" /></div>
                <div className="relative z-10 text-center md:text-left">
                    <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-2 flex items-center gap-3 justify-center md:justify-start">
                      Admin <span className="text-brand-400">Settings</span>
                    </h3>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Configure Global System Parameters</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-600 shadow-sm"><RefreshCw size={24}/></div>
                            <div>
                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">System Live Status</h4>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Toggle global system availability</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsSystemLive(!isSystemLive)} 
                            className={`w-14 h-8 rounded-full transition-all relative shrink-0 ${isSystemLive ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${isSystemLive ? 'right-1' : 'left-1'}`}></div>
                        </button>
                    </div>
                    <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex items-center gap-3 text-slate-400">
                            <ShieldCheck size={14} className="text-brand-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Master Control Overridden</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      ) : null}

      {isModalOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[120] flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-fade-in-up border border-white/10 flex flex-col max-h-[90vh]">
                  <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900 text-white">
                      <div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">
                            {editingId ? 'Update' : 'Create'} {modalType.replace('_', ' ')}
                        </h3>
                        <p className="text-[9px] font-black text-brand-400 uppercase tracking-widest mt-1">Master Control Hub</p>
                      </div>
                      <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white/5 rounded-lg hover:text-red-500"><X size={24}/></button>
                  </div>
                  <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                      {modalType === 'CATEGORY' && (
                        <>
                            <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Category Name</label><input type="text" value={categoryFormData.name} onChange={e => setCategoryFormData({...categoryFormData, name: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:border-brand-500 text-sm" /></div>
                            <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label><input type="text" value={categoryFormData.description} onChange={e => setCategoryFormData({...categoryFormData, description: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:border-brand-500 text-sm" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Icon (Emoji)</label><input type="text" value={categoryFormData.icon} onChange={e => setCategoryFormData({...categoryFormData, icon: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:border-brand-500 text-sm" placeholder="🍔" /></div>
                                <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Color (Tailwind Class)</label><input type="text" value={categoryFormData.color} onChange={e => setCategoryFormData({...categoryFormData, color: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:border-brand-500 text-sm" placeholder="bg-blue-500/20" /></div>
                            </div>
                        </>
                      )}

                      {modalType === 'GIFT_CARD' && (
                        <>
                            <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Name</label><input type="text" value={giftCardFormData.name} onChange={e => setGiftCardFormData({...giftCardFormData, name: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:border-brand-500 text-sm" /></div>
                            <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Icon URL</label><input type="text" value={giftCardFormData.icon} onChange={e => setGiftCardFormData({...giftCardFormData, icon: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:border-brand-500 text-sm" /></div>
                            <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Discount Text</label><input type="text" value={giftCardFormData.discount} onChange={e => setGiftCardFormData({...giftCardFormData, discount: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:border-brand-500 text-sm" placeholder="50% OFF" /></div>
                        </>
                      )}

                      {modalType === 'BRAND' && (
                        <>
                            <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand Name</label><input type="text" value={brandFormData.name} onChange={e => setBrandFormData({...brandFormData, name: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:border-brand-500 text-sm" /></div>
                            <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Logo URL</label><input type="text" value={brandFormData.logo} onChange={e => setBrandFormData({...brandFormData, logo: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:border-brand-500 text-sm" /></div>
                        </>
                      )}

                      {modalType === 'PLAN' && (
                        <>
                            <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Plan Name</label><input type="text" value={planFormData.name} onChange={e => setPlanFormData({...planFormData, name: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:border-brand-500 text-sm" placeholder="easyPOS PREMIUM" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Price</label><input type="number" value={planFormData.price} onChange={e => setPlanFormData({...planFormData, price: Number(e.target.value)})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:border-brand-500 text-sm" /></div>
                                <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration</label><select value={planFormData.duration} onChange={e => setPlanFormData({...planFormData, duration: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:border-brand-500 text-sm"><option value="Monthly">Monthly</option><option value="Yearly">Yearly</option><option value="Lifetime">Lifetime</option></select></div>
                            </div>
                            <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">AI Avatar URL</label><input type="text" value={planFormData.avatarUrl} onChange={e => setPlanFormData({...planFormData, avatarUrl: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:border-brand-500 text-sm" placeholder="https://..." /></div>
                            
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Features</label>
                                <button onClick={addFeature} className="text-[9px] font-black text-brand-600 uppercase tracking-widest flex items-center gap-1"><Plus size={12}/> Add Feature</button>
                              </div>
                              <div className="space-y-2">
                                {planFormData.features?.map((feature, index) => (
                                  <div key={index} className="flex gap-2">
                                    <input type="text" value={feature} onChange={e => updateFeature(index, e.target.value)} className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold dark:text-white outline-none" placeholder="Feature description..." />
                                    <button onClick={() => removeFeature(index)} className="p-3 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                              <input type="checkbox" checked={planFormData.isPopular} onChange={e => setPlanFormData({...planFormData, isPopular: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                              <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Mark as Most Popular</label>
                            </div>
                        </>
                      )}
                      {modalType === 'USER' && (
                        <>
                            <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label><input type="text" value={userFormData.name} onChange={e => setUserFormData({...userFormData, name: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:border-brand-500 text-sm" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label><input type="text" value={userFormData.username} onChange={e => setUserFormData({...userFormData, username: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:border-brand-500 text-sm" /></div>
                                <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label><input type="password" value={userFormData.password} onChange={e => setUserFormData({...userFormData, password: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:border-brand-500 text-sm" /></div>
                            </div>
                            <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label><input type="email" value={userFormData.email} onChange={e => setUserFormData({...userFormData, email: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:border-brand-500 text-sm" /></div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Role</label>
                                <select value={userFormData.role} onChange={e => setUserFormData({...userFormData, role: e.target.value as any})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:border-brand-500 text-sm">
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="MANAGER">MANAGER</option>
                                    <option value="STAFF">STAFF</option>
                                    <option value="CASHIER">CASHIER</option>
                                    <option value="VENDOR">VENDOR</option>
                                    <option value="CUSTOMER">CUSTOMER</option>
                                </select>
                            </div>
                            {userFormData.role === 'VENDOR' && (
                                <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Vendor Node ID</label><input type="text" value={userFormData.vendorId} onChange={e => setUserFormData({...userFormData, vendorId: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:border-brand-500 text-sm" placeholder="NODE-XXXX" /></div>
                            )}
                        </>
                      )}
                  </div>
                  <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border-t border-white/5">
                    <button 
                        onClick={modalType === 'CATEGORY' ? handleSaveCategory : modalType === 'GIFT_CARD' ? handleSaveGiftCard : modalType === 'BRAND' ? handleSaveBrand : modalType === 'PLAN' ? handleSavePlan : handleSaveUser} 
                        className="w-full py-5 bg-brand-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl active:scale-95 italic hover:bg-brand-500 transition-all flex items-center justify-center gap-2"
                    >
                        <Zap size={18}/> {editingId ? 'Sync Changes' : 'Initialize Record'}
                    </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
