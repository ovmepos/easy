
import React, { useState, useRef } from 'react';
import { User, StoreSettings, Language, VendorRequest, Product, Sale, UserRole, PaymentGatewaySettings, PrinterSettings } from '../types';
import { Save, UserPlus, Trash2, Edit2, X, ShieldCheck, Database, HardDrive, User as UserIcon, ChevronLeft, CheckCircle2, AlertCircle, RefreshCw, Upload, Image as ImageIcon, Store, Key, CreditCard, Printer, Bluetooth, Smartphone, Banknote, Globe, Instagram, Facebook, Twitter, Youtube, Linkedin, Plus, Layout, FileText } from 'lucide-react';

interface SettingsProps {
  users: User[];
  vendorRequests: VendorRequest[];
  products: Product[];
  sales: Sale[];
  onAddUser: (u: User) => void;
  onUpdateUser: (u: User) => void;
  onDeleteUser: (id: string) => void;
  onReviewRequest: (id: string, status: 'APPROVED' | 'REJECTED', reason?: string) => void;
  onLogout: () => void;
  currentUser: User;
  storeSettings: StoreSettings;
  onUpdateStoreSettings: (settings: StoreSettings) => void;
  onGoBack: () => void;
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

export const Settings: React.FC<SettingsProps> = ({
  users, onAddUser, onUpdateUser, onDeleteUser,
  currentUser, storeSettings, onUpdateStoreSettings,
  onGoBack, t, products, sales
}) => {
  const [activeTab, setActiveTab] = useState<'store' | 'users' | 'payments' | 'hardware' | 'database' | 'banners'>('store');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState<Partial<User>>({
    name: '', username: '', password: '', role: 'STAFF', vendorId: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveStoreSettings = () => {
    onUpdateStoreSettings(storeSettings);
    alert('Store settings synchronized successfully.');
  };

  const updatePaymentGateway = (gateway: keyof PaymentGatewaySettings, data: any) => {
    const currentGateways = storeSettings.paymentGateways || {};
    onUpdateStoreSettings({
      ...storeSettings,
      paymentGateways: {
        ...currentGateways,
        [gateway]: { ...(currentGateways[gateway] || {}), ...data }
      }
    });
  };

  const updatePrinterSettings = (data: Partial<PrinterSettings>) => {
    onUpdateStoreSettings({
      ...storeSettings,
      printerSettings: { ...(storeSettings.printerSettings || { type: 'BROWSER', paperSize: '80mm' }), ...data }
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onUpdateStoreSettings({ ...storeSettings, logo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleOpenUserModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setUserFormData(user);
    } else {
      setEditingUser(null);
      setUserFormData({ name: '', username: '', password: '', role: 'STAFF', vendorId: '' });
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUser = () => {
    if (!userFormData.name || !userFormData.username || !userFormData.password) {
      alert("All fields are required for operators.");
      return;
    }

    const role = (userFormData.role as UserRole) || 'STAFF';
    // Auto-generate Vendor ID if creating a new Vendor and not provided
    let finalVendorId = userFormData.vendorId;
    if (role === 'VENDOR' && !finalVendorId && !editingUser) {
        finalVendorId = `VND-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }

    const userData: User = {
      id: editingUser ? editingUser.id : `usr_${Date.now()}`,
      name: userFormData.name!,
      username: userFormData.username!.toLowerCase(),
      password: userFormData.password!,
      role: role,
      email: userFormData.email || '',
      vendorId: finalVendorId,
      // Initialize default vendor settings if it's a vendor
      vendorSettings: role === 'VENDOR' ? (editingUser?.vendorSettings || {
          storeName: userFormData.name!,
          storeAddress: '',
          shopPasscode: '2026',
          customUrlSlug: finalVendorId?.toLowerCase() || ''
      }) : undefined,
      vendorStaffLimit: role === 'VENDOR' ? (editingUser?.vendorStaffLimit || 10) : undefined
    };

    if (editingUser) onUpdateUser(userData);
    else onAddUser(userData);
    
    setIsUserModalOpen(false);
  };

  const connectBluetoothPrinter = async () => {
    try {
      // @ts-ignore
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb'] // Generic printer service
      });
      updatePrinterSettings({ bluetoothAddress: device.id, type: 'BLUETOOTH' });
      alert(`Connected to ${device.name}`);
    } catch (error) {
      console.error('Bluetooth error:', error);
      alert('Bluetooth printer connection failed or cancelled.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 transition-colors overflow-hidden">
      <div className="bg-white dark:bg-slate-900 p-6 shadow-sm border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-6">
          <div className="flex items-center gap-4">
            <button onClick={onGoBack} className="p-3 -ml-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all active:scale-90">
                <ChevronLeft size={28} className="rtl:rotate-180" />
            </button>
            <div>
                <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">{t('settings')}</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mt-1">Global System Configuration</p>
            </div>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl shadow-inner overflow-x-auto custom-scrollbar">
            <button onClick={() => setActiveTab('store')} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'store' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-md' : 'text-slate-400'}`}>{t('storeIdentity')}</button>
            <button onClick={() => setActiveTab('users')} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-md' : 'text-slate-400'}`}>{t('operatorAccess')}</button>
            <button onClick={() => setActiveTab('payments')} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'payments' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-md' : 'text-slate-400'}`}>Gateways</button>
            <button onClick={() => setActiveTab('hardware')} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'hardware' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-md' : 'text-slate-400'}`}>Hardware</button>
            <button onClick={() => setActiveTab('banners')} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'banners' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-md' : 'text-slate-400'}`}>{t('banners')}</button>
            <button onClick={() => setActiveTab('database')} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'database' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-md' : 'text-slate-400'}`}>System Data</button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
          {activeTab === 'store' && (
            <div className="space-y-10 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="aspect-video rounded-[3rem] bg-slate-50 dark:bg-slate-800 border-4 border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden relative shadow-inner group">
                    {storeSettings.logo ? (
                      <img src={storeSettings.logo} className="w-full h-full object-contain p-8" alt="Store Logo" />
                    ) : (
                      <ImageIcon size={64} className="text-slate-200" />
                    )}
                    <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-slate-900/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all font-black text-xs uppercase tracking-widest gap-2">
                       <Upload size={20}/> {t('uploadLogo')}
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('businessName')}</label>
                        <input type="text" value={storeSettings.name} onChange={e => onUpdateStoreSettings({...storeSettings, name: e.target.value})} className="w-full p-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-black text-lg dark:text-white" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('storeAddress')}</label>
                        <textarea value={storeSettings.address} onChange={e => onUpdateStoreSettings({...storeSettings, address: e.target.value})} className="w-full p-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold dark:text-white h-24 resize-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-4">
                        <ShieldCheck size={20} className="text-emerald-500" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security & Tax</h3>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black dark:text-white uppercase">Enable Tax Ledger</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Global item taxation</p>
                        </div>
                        <button onClick={() => onUpdateStoreSettings({...storeSettings, taxEnabled: !storeSettings.taxEnabled})} className={`w-14 h-8 rounded-full transition-all relative ${storeSettings.taxEnabled ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${storeSettings.taxEnabled ? 'right-1' : 'left-1'}`}></div>
                        </button>
                    </div>
                    {storeSettings.taxEnabled && (
                        <div className="grid grid-cols-2 gap-4 animate-fade-in-up">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase">Tax Rate (%)</label>
                                <input type="number" value={storeSettings.taxRate} onChange={e => onUpdateStoreSettings({...storeSettings, taxRate: parseFloat(e.target.value) || 0})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-black" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase">Tax Name</label>
                                <input type="text" value={storeSettings.taxName} onChange={e => onUpdateStoreSettings({...storeSettings, taxName: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-black" />
                            </div>
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black dark:text-white uppercase">{t('aiIdentityScan')}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t('aiIdentityScanDesc')}</p>
                        </div>
                        <button onClick={() => onUpdateStoreSettings({...storeSettings, aiIdentityScanEnabled: !storeSettings.aiIdentityScanEnabled})} className={`w-14 h-8 rounded-full transition-all relative ${storeSettings.aiIdentityScanEnabled ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${storeSettings.aiIdentityScanEnabled ? 'right-1' : 'left-1'}`}></div>
                        </button>
                    </div>
                    <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('currency')}</label>
                        <select 
                            value={storeSettings.currency} 
                            onChange={e => onUpdateStoreSettings({...storeSettings, currency: e.target.value})}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-black uppercase text-[10px] tracking-widest dark:text-white outline-none focus:border-brand-500"
                        >
                            <option value="$">{t('usd')}</option>
                            <option value="SR">{t('sar')}</option>
                            <option value="DH">{t('aed')}</option>
                            <option value="KD">{t('kwd')}</option>
                            <option value="BD">{t('bhd')}</option>
                            <option value="OR">{t('omr')}</option>
                            <option value="QR">{t('qar')}</option>
                        </select>
                    </div>
                    <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Receipt Footer Message</label>
                        <input type="text" value={storeSettings.footerMessage} onChange={e => onUpdateStoreSettings({...storeSettings, footerMessage: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white text-xs" />
                    </div>

                    <div className="pt-6 border-t border-slate-50 dark:border-slate-800 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Layout size={20} className="text-indigo-500" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('homeLayout')}</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {(['default', 'grid', 'compact'] as const).map((layout) => (
                                <button
                                    key={layout}
                                    onClick={() => onUpdateStoreSettings({ ...storeSettings, homeLayout: layout })}
                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                                        (storeSettings.homeLayout || 'default') === layout
                                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20 text-brand-600'
                                            : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        (storeSettings.homeLayout || 'default') === layout ? 'bg-brand-100 dark:bg-brand-900' : 'bg-slate-100 dark:bg-slate-800'
                                    }`}>
                                        <Layout size={16} />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest">{t(`layout${layout.charAt(0).toUpperCase() + layout.slice(1)}`)}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50 dark:border-slate-800 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Smartphone size={20} className="text-brand-500" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">App Download Links</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase">{t('playStoreUrl')}</label>
                                <input type="text" value={storeSettings.playStoreUrl || ''} onChange={e => onUpdateStoreSettings({...storeSettings, playStoreUrl: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-xs dark:text-white" placeholder="https://play.google.com/store/apps/..." />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase">{t('appStoreUrl')}</label>
                                <input type="text" value={storeSettings.appStoreUrl || ''} onChange={e => onUpdateStoreSettings({...storeSettings, appStoreUrl: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-xs dark:text-white" placeholder="https://apps.apple.com/app/..." />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('copyrightText')}</label>
                        <input type="text" value={storeSettings.copyrightText || ''} onChange={e => onUpdateStoreSettings({...storeSettings, copyrightText: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white text-xs" placeholder="© 2024 easyPOS. All rights reserved." />
                    </div>

                    <div className="pt-6 border-t border-slate-50 dark:border-slate-800 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Globe size={20} className="text-brand-500" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('socialMedia')}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <Instagram size={14} className="text-pink-500" />
                                    <label className="text-[9px] font-black text-slate-400 uppercase">{t('instagram')}</label>
                                </div>
                                <input type="text" value={storeSettings.socialLinks?.instagram || ''} onChange={e => onUpdateStoreSettings({...storeSettings, socialLinks: {...(storeSettings.socialLinks || {}), instagram: e.target.value}})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-xs dark:text-white" placeholder="https://instagram.com/..." />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <Facebook size={14} className="text-blue-600" />
                                    <label className="text-[9px] font-black text-slate-400 uppercase">{t('facebook')}</label>
                                </div>
                                <input type="text" value={storeSettings.socialLinks?.facebook || ''} onChange={e => onUpdateStoreSettings({...storeSettings, socialLinks: {...(storeSettings.socialLinks || {}), facebook: e.target.value}})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-xs dark:text-white" placeholder="https://facebook.com/..." />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <Twitter size={14} className="text-sky-500" />
                                    <label className="text-[9px] font-black text-slate-400 uppercase">{t('twitter')}</label>
                                </div>
                                <input type="text" value={storeSettings.socialLinks?.twitter || ''} onChange={e => onUpdateStoreSettings({...storeSettings, socialLinks: {...(storeSettings.socialLinks || {}), twitter: e.target.value}})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-xs dark:text-white" placeholder="https://twitter.com/..." />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <Youtube size={14} className="text-red-600" />
                                    <label className="text-[9px] font-black text-slate-400 uppercase">{t('youtube')}</label>
                                </div>
                                <input type="text" value={storeSettings.socialLinks?.youtube || ''} onChange={e => onUpdateStoreSettings({...storeSettings, socialLinks: {...(storeSettings.socialLinks || {}), youtube: e.target.value}})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-xs dark:text-white" placeholder="https://youtube.com/..." />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <Linkedin size={14} className="text-blue-700" />
                                    <label className="text-[9px] font-black text-slate-400 uppercase">{t('linkedin')}</label>
                                </div>
                                <input type="text" value={storeSettings.socialLinks?.linkedin || ''} onChange={e => onUpdateStoreSettings({...storeSettings, socialLinks: {...(storeSettings.socialLinks || {}), linkedin: e.target.value}})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-xs dark:text-white" placeholder="https://linkedin.com/..." />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <Globe size={14} className="text-slate-500" />
                                    <label className="text-[9px] font-black text-slate-400 uppercase">{t('tiktok')}</label>
                                </div>
                                <input type="text" value={storeSettings.socialLinks?.tiktok || ''} onChange={e => onUpdateStoreSettings({...storeSettings, socialLinks: {...(storeSettings.socialLinks || {}), tiktok: e.target.value}})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-xs dark:text-white" placeholder="https://tiktok.com/@..." />
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-slate-50 dark:border-slate-800 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <Globe size={20} className="text-emerald-500" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('customQuickLinks')}</h3>
                            </div>
                            <button 
                                onClick={() => onUpdateStoreSettings({
                                    ...storeSettings, 
                                    customLinks: [...(storeSettings.customLinks || []), { label: '', url: '' }]
                                })}
                                className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-lg hover:scale-110 transition-transform"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {(storeSettings.customLinks || []).map((link, index) => (
                                <div key={index} className="flex gap-3 items-start animate-fade-in-up">
                                    <div className="flex-1 space-y-1">
                                        <input 
                                            type="text" 
                                            value={link.label} 
                                            onChange={e => {
                                                const newLinks = [...(storeSettings.customLinks || [])];
                                                newLinks[index].label = e.target.value;
                                                onUpdateStoreSettings({ ...storeSettings, customLinks: newLinks });
                                            }}
                                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-[10px] uppercase tracking-widest dark:text-white outline-none focus:border-brand-500/50" 
                                            placeholder={t('linkLabel')} 
                                        />
                                    </div>
                                    <div className="flex-[2] space-y-1">
                                        <input 
                                            type="text" 
                                            value={link.url} 
                                            onChange={e => {
                                                const newLinks = [...(storeSettings.customLinks || [])];
                                                newLinks[index].url = e.target.value;
                                                onUpdateStoreSettings({ ...storeSettings, customLinks: newLinks });
                                            }}
                                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-[10px] dark:text-white outline-none focus:border-brand-500/50" 
                                            placeholder={t('linkUrl')} 
                                        />
                                    </div>
                                    <button 
                                        onClick={() => {
                                            const newLinks = (storeSettings.customLinks || []).filter((_, i) => i !== index);
                                            onUpdateStoreSettings({ ...storeSettings, customLinks: newLinks });
                                        }}
                                        className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {(storeSettings.customLinks || []).length === 0 && (
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest text-center py-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl italic">No custom links added yet.</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50 dark:border-slate-800 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <FileText size={20} className="text-brand-500" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('legalPages')}</h3>
                            </div>
                            <button 
                                onClick={() => onUpdateStoreSettings({
                                    ...storeSettings, 
                                    legalPages: [...(storeSettings.legalPages || []), { id: Date.now().toString(), title: '', content: '', slug: '', category: 'LEGAL' }]
                                })}
                                className="p-2 bg-brand-50 dark:bg-brand-950/20 text-brand-600 rounded-lg hover:scale-110 transition-transform"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {(storeSettings.legalPages || []).map((page, index) => (
                                <div key={page.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-3 border border-transparent hover:border-brand-500/20 transition-all">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[8px] font-black text-slate-400 uppercase">{t('pageTitle')}</label>
                                            <input 
                                                type="text" 
                                                value={page.title} 
                                                onChange={e => {
                                                    const newPages = [...(storeSettings.legalPages || [])];
                                                    newPages[index].title = e.target.value;
                                                    onUpdateStoreSettings({ ...storeSettings, legalPages: newPages });
                                                }}
                                                className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl font-bold text-xs dark:text-white outline-none" 
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[8px] font-black text-slate-400 uppercase">{t('pageSlug')}</label>
                                            <input 
                                                type="text" 
                                                value={page.slug} 
                                                onChange={e => {
                                                    const newPages = [...(storeSettings.legalPages || [])];
                                                    newPages[index].slug = e.target.value;
                                                    onUpdateStoreSettings({ ...storeSettings, legalPages: newPages });
                                                }}
                                                className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl font-bold text-xs dark:text-white outline-none" 
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[8px] font-black text-slate-400 uppercase">{t('pageCategory')}</label>
                                            <select 
                                                value={page.category} 
                                                onChange={e => {
                                                    const newPages = [...(storeSettings.legalPages || [])];
                                                    newPages[index].category = e.target.value as any;
                                                    onUpdateStoreSettings({ ...storeSettings, legalPages: newPages });
                                                }}
                                                className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl font-bold text-xs dark:text-white outline-none"
                                            >
                                                <option value="LEGAL">{t('legal')}</option>
                                                <option value="COMPANY">{t('company')}</option>
                                                <option value="SUPPORT">{t('support')}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-black text-slate-400 uppercase">{t('pageContent')}</label>
                                        <textarea 
                                            value={page.content} 
                                            onChange={e => {
                                                const newPages = [...(storeSettings.legalPages || [])];
                                                newPages[index].content = e.target.value;
                                                onUpdateStoreSettings({ ...storeSettings, legalPages: newPages });
                                            }}
                                            rows={4}
                                            className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl font-bold text-xs dark:text-white outline-none resize-none" 
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button 
                                            onClick={() => {
                                                const newPages = (storeSettings.legalPages || []).filter((_, i) => i !== index);
                                                onUpdateStoreSettings({ ...storeSettings, legalPages: newPages });
                                            }}
                                            className="flex items-center gap-2 text-[10px] font-black uppercase text-red-500 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={14} /> {t('delete')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {(storeSettings.legalPages || []).length === 0 && (
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest text-center py-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl italic">No legal/company pages added yet.</p>
                            )}
                        </div>
                    </div>
                  </div>
                  
                  <button onClick={handleSaveStoreSettings} className="w-full py-5 bg-slate-900 dark:bg-brand-600 text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 flex items-center justify-center gap-3 italic transition-all">
                      <Save size={20}/> {t('syncTerminal')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-10 animate-fade-in">
              <div className="bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden mb-8">
                <div className="absolute top-0 right-0 p-12 opacity-10"><CreditCard size={120} /></div>
                <div className="relative z-10">
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Payment Gateways</h3>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Configure global checkout protocols</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Thawani */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <Globe size={24} className="text-brand-500" />
                      <h4 className="font-black dark:text-white uppercase italic">Thawani Pay</h4>
                    </div>
                    <button 
                      onClick={() => updatePaymentGateway('thawani', { enabled: !storeSettings.paymentGateways?.thawani?.enabled })}
                      className={`w-12 h-6 rounded-full transition-all relative ${storeSettings.paymentGateways?.thawani?.enabled ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${storeSettings.paymentGateways?.thawani?.enabled ? 'right-0.5' : 'left-0.5'}`}></div>
                    </button>
                  </div>
                  {storeSettings.paymentGateways?.thawani?.enabled && (
                    <div className="space-y-4 animate-fade-in-up">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase">API Key</label>
                        <input type="password" value={storeSettings.paymentGateways.thawani.apiKey} onChange={e => updatePaymentGateway('thawani', { apiKey: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase">Publishable Key</label>
                        <input type="text" value={storeSettings.paymentGateways.thawani.publishableKey} onChange={e => updatePaymentGateway('thawani', { publishableKey: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono text-xs" />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={storeSettings.paymentGateways.thawani.isTestMode} onChange={e => updatePaymentGateway('thawani', { isTestMode: e.target.checked })} className="w-4 h-4 rounded" />
                        <label className="text-[10px] font-black text-slate-400 uppercase">Sandbox Mode</label>
                      </div>
                    </div>
                  )}
                </div>

                {/* PayPal */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <CreditCard size={24} className="text-blue-500" />
                      <h4 className="font-black dark:text-white uppercase italic">PayPal</h4>
                    </div>
                    <button 
                      onClick={() => updatePaymentGateway('paypal', { enabled: !storeSettings.paymentGateways?.paypal?.enabled })}
                      className={`w-12 h-6 rounded-full transition-all relative ${storeSettings.paymentGateways?.paypal?.enabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${storeSettings.paymentGateways?.paypal?.enabled ? 'right-0.5' : 'left-0.5'}`}></div>
                    </button>
                  </div>
                  {storeSettings.paymentGateways?.paypal?.enabled && (
                    <div className="space-y-4 animate-fade-in-up">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase">Client ID</label>
                        <input type="text" value={storeSettings.paymentGateways.paypal.clientId} onChange={e => updatePaymentGateway('paypal', { clientId: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono text-xs" />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={storeSettings.paymentGateways.paypal.isTestMode} onChange={e => updatePaymentGateway('paypal', { isTestMode: e.target.checked })} className="w-4 h-4 rounded" />
                        <label className="text-[10px] font-black text-slate-400 uppercase">Sandbox Mode</label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Manual UPI */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <Smartphone size={24} className="text-emerald-500" />
                      <h4 className="font-black dark:text-white uppercase italic">Manual UPI</h4>
                    </div>
                    <button 
                      onClick={() => updatePaymentGateway('upi', { enabled: !storeSettings.paymentGateways?.upi?.enabled })}
                      className={`w-12 h-6 rounded-full transition-all relative ${storeSettings.paymentGateways?.upi?.enabled ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${storeSettings.paymentGateways?.upi?.enabled ? 'right-0.5' : 'left-0.5'}`}></div>
                    </button>
                  </div>
                  {storeSettings.paymentGateways?.upi?.enabled && (
                    <div className="space-y-4 animate-fade-in-up">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase">UPI ID (VPA)</label>
                        <input type="text" value={storeSettings.paymentGateways.upi.upiId} onChange={e => updatePaymentGateway('upi', { upiId: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-xs" placeholder="example@upi" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase">Payee Name</label>
                        <input type="text" value={storeSettings.paymentGateways.upi.payeeName} onChange={e => updatePaymentGateway('upi', { payeeName: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-xs" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Bank Transfer */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <Banknote size={24} className="text-amber-500" />
                      <h4 className="font-black dark:text-white uppercase italic">Bank Transfer</h4>
                    </div>
                    <button 
                      onClick={() => updatePaymentGateway('bankTransfer', { enabled: !storeSettings.paymentGateways?.bankTransfer?.enabled })}
                      className={`w-12 h-6 rounded-full transition-all relative ${storeSettings.paymentGateways?.bankTransfer?.enabled ? 'bg-amber-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${storeSettings.paymentGateways?.bankTransfer?.enabled ? 'right-0.5' : 'left-0.5'}`}></div>
                    </button>
                  </div>
                  {storeSettings.paymentGateways?.bankTransfer?.enabled && (
                    <div className="space-y-4 animate-fade-in-up">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase">Bank Name</label>
                        <input type="text" value={storeSettings.paymentGateways.bankTransfer.bankName} onChange={e => updatePaymentGateway('bankTransfer', { bankName: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase">Account Number</label>
                        <input type="text" value={storeSettings.paymentGateways.bankTransfer.accountNumber} onChange={e => updatePaymentGateway('bankTransfer', { accountNumber: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase">Account Holder</label>
                        <input type="text" value={storeSettings.paymentGateways.bankTransfer.accountHolder} onChange={e => updatePaymentGateway('bankTransfer', { accountHolder: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-xs" />
                      </div>
                    </div>
                  )}
                </div>

                {/* NFC Payment Setup */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <Smartphone size={24} className="text-indigo-500" />
                      <h4 className="font-black dark:text-white uppercase italic">NFC Contactless</h4>
                    </div>
                    <button 
                      onClick={() => updatePaymentGateway('nfc', { enabled: !storeSettings.paymentGateways?.nfc?.enabled })}
                      className={`w-12 h-6 rounded-full transition-all relative ${storeSettings.paymentGateways?.nfc?.enabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${storeSettings.paymentGateways?.nfc?.enabled ? 'right-0.5' : 'left-0.5'}`}></div>
                    </button>
                  </div>
                  {storeSettings.paymentGateways?.nfc?.enabled && (
                    <div className="space-y-4 animate-fade-in-up">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase">Terminal API Key</label>
                        <input type="password" value={storeSettings.paymentGateways.nfc.apiKey || ''} onChange={e => updatePaymentGateway('nfc', { apiKey: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase">Terminal ID</label>
                        <input type="text" value={storeSettings.paymentGateways.nfc.terminalId || ''} onChange={e => updatePaymentGateway('nfc', { terminalId: e.target.value })} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono text-xs" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <button onClick={handleSaveStoreSettings} className="w-full py-5 bg-slate-900 dark:bg-brand-600 text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 flex items-center justify-center gap-3 italic transition-all">
                <Save size={20}/> Save Gateway Protocols
              </button>
            </div>
          )}

          {activeTab === 'hardware' && (
            <div className="space-y-10 animate-fade-in">
              <div className="bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden mb-8">
                <div className="absolute top-0 right-0 p-12 opacity-10"><Printer size={120} /></div>
                <div className="relative z-10">
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Hardware Node</h3>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Peripherals & Device Integration</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Printer Settings */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-4">
                    <Printer size={24} className="text-brand-600" />
                    <h4 className="font-black dark:text-white uppercase italic">Thermal Printer</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Connection Type</label>
                      <select 
                        value={storeSettings.printerSettings?.type || 'BROWSER'} 
                        onChange={e => updatePrinterSettings({ type: e.target.value as any })}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-black uppercase text-[10px] tracking-widest dark:text-white outline-none"
                      >
                        <option value="BROWSER">System Print Dialog (Browser)</option>
                        <option value="BLUETOOTH">Bluetooth Thermal Printer</option>
                        <option value="NETWORK">Network / IP Printer</option>
                      </select>
                    </div>

                    {storeSettings.printerSettings?.type === 'BLUETOOTH' && (
                      <div className="space-y-4 animate-fade-in-up">
                        <button 
                          onClick={connectBluetoothPrinter}
                          className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-700"
                        >
                          <Bluetooth size={16} /> {storeSettings.printerSettings.bluetoothAddress ? 'Change Printer' : 'Search Bluetooth Printer'}
                        </button>
                        {storeSettings.printerSettings.bluetoothAddress && (
                          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl flex items-center gap-3">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            <p className="text-[10px] font-black text-emerald-600 uppercase">Linked: {storeSettings.printerSettings.bluetoothAddress}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {storeSettings.printerSettings?.type === 'NETWORK' && (
                      <div className="space-y-2 animate-fade-in-up">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Printer IP Address</label>
                        <input 
                          type="text" 
                          value={storeSettings.printerSettings.networkIp || ''} 
                          onChange={e => updatePrinterSettings({ networkIp: e.target.value })}
                          placeholder="192.168.1.100"
                          className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-mono text-sm dark:text-white"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Paper Width</label>
                      <div className="flex gap-2">
                        {['58mm', '80mm'].map(size => (
                          <button 
                            key={size}
                            onClick={() => updatePrinterSettings({ paperSize: size as any })}
                            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${storeSettings.printerSettings?.paperSize === size ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* NFC Hardware Status */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-4">
                    <Smartphone size={24} className="text-emerald-500" />
                    <h4 className="font-black dark:text-white uppercase italic">NFC Hardware</h4>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs font-medium text-slate-500 leading-relaxed">NFC status for rapid item scanning and contactless payment protocols on supported mobile devices.</p>
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                      <div>
                        <p className="text-[10px] font-black dark:text-white uppercase">Contactless Pay (NFC)</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Gateway Status</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${storeSettings.paymentGateways?.nfc?.enabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        {storeSettings.paymentGateways?.nfc?.enabled ? 'ACTIVE' : 'INACTIVE'}
                      </div>
                    </div>
                    <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Device Support: {('NDEFReader' in window) ? 'NFC SUPPORTED' : 'NFC NOT SUPPORTED'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={handleSaveStoreSettings} className="w-full py-5 bg-slate-900 dark:bg-brand-600 text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 flex items-center justify-center gap-3 italic transition-all">
                <Save size={20}/> Synchronize Hardware
              </button>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex justify-between items-center bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10"><UserIcon size={120} /></div>
                <div className="relative z-10">
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Personnel Node</h3>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Active Operators: {users.length}</p>
                </div>
                <button onClick={() => handleOpenUserModal()} className="relative z-10 px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 transition-all flex items-center gap-3 italic">
                    <UserPlus size={18} /> {t('addNewOperator')}
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                  <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-black uppercase text-[9px] tracking-widest">
                          <tr>
                            <th className="p-8">Identity</th>
                            <th className="p-8 text-center">Node Role</th>
                            <th className="p-8 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                          {users.map(u => (
                              <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                                  <td className="p-8">
                                      <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-slate-400 uppercase italic">{u.name.charAt(0)}</div>
                                          <div>
                                              <div className="font-black text-slate-900 dark:text-white uppercase italic">{u.name}</div>
                                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">@{u.username} {u.vendorId && <span className="text-brand-500 ml-2">[{u.vendorId}]</span>}</div>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="p-8 text-center">
                                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${u.role === 'ADMIN' ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20' : u.role === 'VENDOR' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20'}`}>
                                          {u.role}
                                      </span>
                                  </td>
                                  <td className="p-8 text-right">
                                      <div className="flex justify-end gap-2">
                                          <button onClick={() => handleOpenUserModal(u)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-brand-600 transition-all"><Edit2 size={18}/></button>
                                          {currentUser.id !== u.id && <button onClick={() => onDeleteUser(u.id)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-rose-600 transition-all"><Trash2 size={18}/></button>}
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
             <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Database size={24} className="text-brand-600" />
                            <h4 className="text-lg font-black dark:text-white uppercase italic">Inventory Cache</h4>
                        </div>
                        <p className="text-sm font-medium text-slate-500 leading-relaxed">Local catalog data management and synchronization state.</p>
                        <div className="pt-4 flex justify-between items-end">
                            <div>
                                <p className="text-4xl font-black dark:text-white tracking-tighter">{products.length}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Records</p>
                            </div>
                            <button className="px-6 py-3 bg-slate-900 dark:bg-brand-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><RefreshCw size={14}/> Force Sync</button>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <HardDrive size={24} className="text-emerald-500" />
                            <h4 className="text-lg font-black dark:text-white uppercase italic">Sales Ledger</h4>
                        </div>
                        <p className="text-sm font-medium text-slate-500 leading-relaxed">Historical transactional data and audit trails for the current node.</p>
                        <div className="pt-4 flex justify-between items-end">
                            <div>
                                <p className="text-4xl font-black dark:text-white tracking-tighter">{sales.length}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logged Invoices</p>
                            </div>
                            <button className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">Export CSV</button>
                        </div>
                    </div>
                </div>
                
                <div className="bg-rose-50 dark:bg-rose-950/20 border-2 border-dashed border-rose-200 dark:border-rose-900/40 p-10 rounded-[3.5rem] flex flex-col items-center text-center space-y-6">
                    <AlertCircle size={48} className="text-rose-500" />
                    <div>
                        <h4 className="text-xl font-black text-rose-600 uppercase italic">Factory Reset Node</h4>
                        <p className="text-sm font-medium text-rose-500/80 max-w-md mx-auto mt-2 leading-relaxed">Wiping the local node data will disconnect this terminal from the cloud sync. This action is irreversible.</p>
                    </div>
                    <button className="px-10 py-5 bg-rose-600 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-xl active:scale-95 transition-all">Destroy Local Ledger</button>
                </div>
             </div>
          )}

          {activeTab === 'banners' && (
            <div className="space-y-10 animate-fade-in">
                <div className="bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden mb-8">
                    <div className="absolute top-0 right-0 p-12 opacity-10"><ImageIcon size={120} /></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-6">
                        <div>
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Banners Node</h3>
                            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Active Banners: {(storeSettings.banners || []).length}</p>
                        </div>
                        <button 
                            onClick={() => onUpdateStoreSettings({
                                ...storeSettings, 
                                banners: [...(storeSettings.banners || []), { id: `bn_${Date.now()}`, title: '', discount: '', action: '', color: 'from-brand-500 to-indigo-600', image: '' }]
                            })}
                            className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 transition-all flex items-center gap-3 italic"
                        >
                            <Plus size={18} /> Add Banner
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {(storeSettings.banners || []).map((banner, index) => (
                        <div key={banner.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 relative group">
                            <button 
                                onClick={() => {
                                    const newBanners = (storeSettings.banners || []).filter((_, i) => i !== index);
                                    onUpdateStoreSettings({ ...storeSettings, banners: newBanners });
                                }}
                                className="absolute top-6 right-6 p-3 text-slate-300 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase">{t('bannerTitle')}</label>
                                        <input type="text" value={banner.title} onChange={e => {
                                            const newBanners = [...(storeSettings.banners || [])];
                                            newBanners[index].title = e.target.value;
                                            onUpdateStoreSettings({ ...storeSettings, banners: newBanners });
                                        }} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-xs dark:text-white outline-none focus:border-brand-500/50" placeholder="e.g. Summer Sale" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase">{t('bannerDiscount')}</label>
                                        <input type="text" value={banner.discount} onChange={e => {
                                            const newBanners = [...(storeSettings.banners || [])];
                                            newBanners[index].discount = e.target.value;
                                            onUpdateStoreSettings({ ...storeSettings, banners: newBanners });
                                        }} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-xs dark:text-white outline-none focus:border-brand-500/50" placeholder="e.g. 50% OFF" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase">{t('bannerAction')}</label>
                                        <input type="text" value={banner.action} onChange={e => {
                                            const newBanners = [...(storeSettings.banners || [])];
                                            newBanners[index].action = e.target.value;
                                            onUpdateStoreSettings({ ...storeSettings, banners: newBanners });
                                        }} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-xs dark:text-white outline-none focus:border-brand-500/50" placeholder="e.g. SHOP NOW" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase">{t('bannerColor')}</label>
                                        <input type="text" value={banner.color} onChange={e => {
                                            const newBanners = [...(storeSettings.banners || [])];
                                            newBanners[index].color = e.target.value;
                                            onUpdateStoreSettings({ ...storeSettings, banners: newBanners });
                                        }} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono text-xs dark:text-white outline-none focus:border-brand-500/50" placeholder="from-brand-500 to-indigo-600" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase">{t('bannerImage')}</label>
                                        <input type="text" value={banner.image} onChange={e => {
                                            const newBanners = [...(storeSettings.banners || [])];
                                            newBanners[index].image = e.target.value;
                                            onUpdateStoreSettings({ ...storeSettings, banners: newBanners });
                                        }} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-xs dark:text-white outline-none focus:border-brand-500/50" placeholder="https://..." />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Preview */}
                            <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                                <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block">Live Preview</label>
                                <div className={`w-full h-32 rounded-3xl bg-gradient-to-br ${banner.color} p-6 flex flex-col justify-center relative overflow-hidden`}>
                                    <div className="relative z-10 space-y-1">
                                        <div className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-white">
                                            {banner.title || 'Title'}
                                        </div>
                                        <h2 className="text-xl font-black text-white">{banner.discount || 'Discount'}</h2>
                                        <button className="w-fit px-4 py-1.5 bg-white text-black rounded-lg text-[8px] font-black uppercase tracking-widest">
                                            {banner.action || 'Action'}
                                        </button>
                                    </div>
                                    {banner.image && <img src={banner.image} alt="" className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-30 mix-blend-overlay" />}
                                </div>
                            </div>
                        </div>
                    ))}
                    {(storeSettings.banners || []).length === 0 && (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                            <ImageIcon size={48} className="mx-auto text-slate-200 mb-4" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No banners configured for this node.</p>
                        </div>
                    )}
                </div>
                
                <button onClick={handleSaveStoreSettings} className="w-full py-5 bg-slate-900 dark:bg-brand-600 text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 flex items-center justify-center gap-3 italic transition-all">
                    <Save size={20}/> Deploy Banners
                </button>
            </div>
          )}
        </div>
      </div>

      {isUserModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[120] flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-fade-in-up border border-slate-100 dark:border-slate-800 flex flex-col">
                  <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                      <div>
                          <h3 className="text-3xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">{editingUser ? 'Update Operator' : t('newOperator')}</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Authorization Protocol</p>
                      </div>
                      <button onClick={() => setIsUserModalOpen(false)} className="p-3 bg-white dark:bg-slate-800 text-slate-400 rounded-2xl hover:text-red-500 transition-all"><X size={24}/></button>
                  </div>
                  
                  <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('fullLegalName')}</label>
                          <input type="text" value={userFormData.name} onChange={e => setUserFormData({...userFormData, name: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:border-brand-500" />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('username')}</label>
                            <input type="text" value={userFormData.username} onChange={e => setUserFormData({...userFormData, username: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:border-brand-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('accessPassword')}</label>
                            <input type="password" value={userFormData.password} onChange={e => setUserFormData({...userFormData, password: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:border-brand-500" />
                        </div>
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('securityRole')}</label>
                          <select value={userFormData.role} onChange={e => setUserFormData({...userFormData, role: e.target.value as UserRole})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-black uppercase text-[10px] tracking-widest dark:text-white outline-none focus:border-brand-500">
                              <option value="STAFF">Staff Operator</option>
                              <option value="MANAGER">Node Manager</option>
                              <option value="ADMIN">System Admin</option>
                              <option value="VENDOR">Vendor Node Owner</option>
                              <option value="CASHIER">Cashier Terminal</option>
                          </select>
                      </div>

                      {userFormData.role === 'VENDOR' && (
                          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-3xl space-y-4 animate-fade-in">
                              <div className="flex items-center gap-3">
                                  <Store className="text-blue-600" size={20} />
                                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Vendor Node Details</h4>
                              </div>
                              <div className="space-y-1">
                                  <label className="text-[9px] font-black text-blue-400 uppercase tracking-widest ml-1">Static Node ID (Leave blank to auto-gen)</label>
                                  <input type="text" value={userFormData.vendorId} onChange={e => setUserFormData({...userFormData, vendorId: e.target.value.toUpperCase()})} className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl font-mono text-sm dark:text-white border border-blue-100 outline-none" placeholder="VND-XXXXXX" />
                              </div>
                              <div className="flex items-center justify-between pt-2">
                                  <div>
                                      <p className="text-[10px] font-black text-blue-600 uppercase">{t('aiIdentityScan')}</p>
                                      <p className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">Biometric Node Security</p>
                                  </div>
                                  <button 
                                    onClick={() => setUserFormData({
                                        ...userFormData, 
                                        vendorSettings: {
                                            ...(userFormData.vendorSettings || { storeName: userFormData.name || '', storeAddress: '', shopPasscode: '2026', customUrlSlug: '' }),
                                            aiIdentityScanEnabled: !userFormData.vendorSettings?.aiIdentityScanEnabled
                                        }
                                    })} 
                                    className={`w-12 h-6 rounded-full transition-all relative ${userFormData.vendorSettings?.aiIdentityScanEnabled ? 'bg-blue-600' : 'bg-blue-200 dark:bg-slate-700'}`}
                                  >
                                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${userFormData.vendorSettings?.aiIdentityScanEnabled ? 'right-0.5' : 'left-0.5'}`}></div>
                                  </button>
                              </div>
                          </div>
                      )}
                  </div>

                  <div className="p-10 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                      <button onClick={() => setIsUserModalOpen(false)} className="flex-1 py-5 text-slate-500 font-black uppercase tracking-widest text-[10px]">{t('cancel')}</button>
                      <button onClick={handleSaveUser} className="flex-[2] py-5 bg-brand-600 text-white font-black uppercase tracking-widest text-[10px] rounded-[2rem] shadow-xl hover:bg-brand-500 transition-all italic flex items-center justify-center gap-2">
                          <CheckCircle2 size={18} /> {t('authorizeOperator')}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
