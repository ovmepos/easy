
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ShoppingCart, MessageCircle, Wallet, Compass, Home as HomeIcon, ChevronLeft, ChevronRight, Globe, User as UserIcon, LogOut, ShieldCheck, Truck, Headphones, Zap, Camera, Scan, X, Loader2, Database, Shield } from 'lucide-react';
import { Language, User, StoreSettings, Product, AppView } from '../types';
import { formatCurrency } from '../utils/format';
import { GoogleGenAI } from "@google/genai";
import { Html5QrcodeScanner } from 'html5-qrcode';

interface HomeProps {
  language: Language;
  t: (key: string) => string;
  currentUser: User | null;
  onLogout: () => void;
  onLoginRequest: () => void;
  storeSettings: StoreSettings;
  onNavigate: (view: AppView) => void;
  products: Product[];
  onSeedDemoProducts?: () => void;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  onUpdateStoreSettings: (settings: StoreSettings) => void;
}

export const Home: React.FC<HomeProps> = ({
  language,
  t,
  currentUser,
  onLogout,
  onLoginRequest,
  storeSettings,
  onNavigate,
  products,
  onSeedDemoProducts,
  toggleLanguage,
  toggleTheme,
  isDarkMode,
  onUpdateStoreSettings
}) => {
  const [activeBanner, setActiveBanner] = useState(0);
  const [location, setLocation] = useState<string>(t('detectingLocation'));
  const [showPolicy, setShowPolicy] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isImageAnalyzing, setIsImageAnalyzing] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

  useEffect(() => {
    if (isScanning) {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );
      scannerRef.current.render((decodedText) => {
        setSearchQuery(decodedText);
        setIsScanning(false);
        scannerRef.current?.clear();
      }, (error) => {
        // console.warn(error);
      });
    }
    return () => {
      scannerRef.current?.clear();
    };
  }, [isScanning]);

  const handleImageSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImageAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            {
              parts: [
                { text: "Analyze this image and return 2-3 keywords that describe the product in it for a search query. Return ONLY the keywords separated by spaces." },
                { inlineData: { mimeType: file.type, data: base64Data } }
              ]
            }
          ]
        });

        const keywords = response.text || '';
        setSearchQuery(keywords);
        setIsImageAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Image search error:", error);
      setIsImageAnalyzing(false);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Using a free reverse geocoding API (BigDataCloud)
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`);
            const data = await response.json();
            const locationStr = `${data.city || data.locality}, ${data.principalSubdivision}, ${data.countryName}`;
            setLocation(locationStr);
          } catch (error) {
            console.error("Error fetching location details:", error);
            setLocation(`${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`);
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          setLocation(t('locationAccessDenied'));
        }
      );
    } else {
      setLocation(t('unknownLocation'));
    }
  }, [t]);

  const banners = [
    {
      id: 1,
      title: "Canva Pro",
      discount: "Flat 80% OFF",
      action: "SUBSCRIBE NOW",
      color: "from-[#00c4cc] to-[#7d2ae8]",
      image: "https://picsum.photos/seed/canva/800/400"
    },
    {
      id: 2,
      title: "Zomato Gold",
      discount: "Buy 1 Get 1 Free",
      action: "BUY NOW",
      color: "from-[#cb202d] to-[#ff4d4d]",
      image: "https://picsum.photos/seed/zomato/800/400"
    }
  ];

  const favouriteBrands = [
    { name: 'YouTube', icon: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png', discount: '70% OFF' },
    { name: 'Netflix', icon: 'https://cdn-icons-png.flaticon.com/512/5977/5977590.png', discount: '50% OFF' },
    { name: 'Spotify', icon: 'https://cdn-icons-png.flaticon.com/512/174/174872.png', discount: '60% OFF' },
    { name: 'Amazon', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968202.png', discount: '40% OFF' },
    { name: 'Disney+', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968764.png', discount: '30% OFF' },
    { name: 'Apple', icon: 'https://cdn-icons-png.flaticon.com/512/0/747.png', discount: '20% OFF' },
  ];

  const giftCardCategories = [
    { name: t('food'), icon: '🍔', color: 'bg-orange-500/20' },
    { name: t('entertainment'), icon: '🎬', color: 'bg-purple-500/20' },
    { name: t('fashion'), icon: '👗', color: 'bg-pink-500/20' },
    { name: t('homeNeeds'), icon: '🏠', color: 'bg-blue-500/20' },
    { name: t('healthcare'), icon: '🏥', color: 'bg-green-500/20' },
    { name: t('news'), icon: '📰', color: 'bg-yellow-500/20' },
  ];

  const featuredProducts = products.slice(0, 8);

  const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'SAR', symbol: 'SR' },
    { code: 'AED', symbol: 'DH' },
    { code: 'KWD', symbol: 'KD' },
    { code: 'BHD', symbol: 'BD' },
    { code: 'OMR', symbol: 'RO' },
    { code: 'QAR', symbol: 'QR' }
  ];

  const toggleCurrency = () => {
    const currentIndex = currencies.findIndex(c => c.code === storeSettings.currency);
    const nextIndex = (currentIndex + 1) % currencies.length;
    onUpdateStoreSettings({ ...storeSettings, currency: currencies[nextIndex].code });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-slate-50 text-slate-900'} font-sans selection:bg-brand-500 selection:text-white transition-colors`}>
      {/* Ticker */}
      <div className="bg-brand-500 py-1.5 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee text-[10px] font-bold uppercase tracking-widest px-4 text-white">
          🔥 Limited Time Offer: Get 80% OFF on Canva Pro! • New Gift Cards Added: Amazon, Netflix, Spotify • Free Delivery on all orders above $50 • 24/7 Support Available 🔥
        </div>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 ${isDarkMode ? 'bg-[#0a0a0a]/90' : 'bg-white/90'} backdrop-blur-md border-b ${isDarkMode ? 'border-white/5' : 'border-slate-200'} px-4 lg:px-8 py-3`}>
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate(AppView.HOME)}>
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
              </div>
              <span className="text-xl font-bold tracking-tighter">easyPOS</span>
            </div>

            <nav className={`hidden xl:flex items-center gap-6 text-xs font-bold ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              <button onClick={() => onNavigate(AppView.HOME)} className={`${isDarkMode ? 'text-white' : 'text-slate-900'} uppercase tracking-widest`}>{t('home')}</button>
              <button onClick={() => onNavigate(AppView.CUSTOMER_PORTAL)} className="hover:text-brand-500 uppercase tracking-widest transition-colors">{t('explore')}</button>
              <button onClick={() => onNavigate(AppView.CUSTOMER_DASHBOARD)} className="hover:text-brand-500 uppercase tracking-widest transition-colors">{t('wallet')}</button>
              <button onClick={() => onNavigate(AppView.CUSTOMER_DASHBOARD)} className="hover:text-brand-500 uppercase tracking-widest transition-colors">{t('chat')}</button>
              <button onClick={() => onNavigate(AppView.CUSTOMER_PORTAL)} className="hover:text-brand-500 uppercase tracking-widest relative transition-colors">
                {t('cart')}
                <span className="absolute -top-2 -right-2 w-3.5 h-3.5 bg-brand-500 text-white text-[8px] rounded-full flex items-center justify-center shadow-lg">0</span>
              </button>
            </nav>
          </div>

          <div className="flex-1 max-w-xl relative group">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-500 group-focus-within:text-white' : 'text-slate-400 group-focus-within:text-slate-900'} transition-colors`} size={16} />
            <input 
              type="text" 
              placeholder={t('quickSearch')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${isDarkMode ? 'bg-zinc-900/80 border-white/10 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'} border rounded-xl py-2 pl-11 pr-24 text-sm focus:outline-none focus:border-brand-500/50 transition-all`}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button 
                onClick={() => setIsScanning(true)}
                className={`p-1.5 ${isDarkMode ? 'hover:bg-white/10 text-zinc-500 hover:text-white' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-900'} rounded-lg transition-all`}
                title={t('barcodeScan')}
              >
                <Scan size={16} />
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className={`p-1.5 ${isDarkMode ? 'hover:bg-white/10 text-zinc-500 hover:text-white' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-900'} rounded-lg transition-all`}
                title={t('imageSearch')}
              >
                {isImageAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageSearch} 
                className="hidden" 
                accept="image/*"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`hidden md:flex items-center gap-2 text-[10px] ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              <MapPin size={12} className="text-brand-500" />
              <div className="flex flex-col">
                <span className="opacity-50">{t('deliveryInMinutes')}</span>
                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} truncate max-w-[120px]`}>{location}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={toggleLanguage}
                className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg ${isDarkMode ? 'bg-zinc-900 border-white/5 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'} border uppercase hover:border-brand-500/50 transition-all`}
              >
                {language} <Globe size={12} />
              </button>

              <button 
                onClick={toggleCurrency}
                className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg ${isDarkMode ? 'bg-zinc-900 border-white/5 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'} border uppercase hover:border-brand-500/50 transition-all`}
              >
                {storeSettings.currency} <Wallet size={12} />
              </button>

              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-zinc-900 border-white/5 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'} border hover:border-brand-500/50 transition-all`}
              >
                {isDarkMode ? <Zap size={14} className="text-yellow-400" /> : <Zap size={14} className="text-slate-400" />}
              </button>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center font-bold text-sm border ${isDarkMode ? 'border-white/10' : 'border-slate-200'} overflow-hidden shadow-lg`}>
                  {currentUser.avatar ? <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" /> : currentUser.name[0]}
                </div>
                <button onClick={onLogout} className={`p-2 ${isDarkMode ? 'hover:bg-red-500/10 text-zinc-500' : 'hover:bg-red-50 text-slate-400'} hover:text-red-500 rounded-lg transition-all`}>
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button onClick={onLoginRequest} className="px-5 py-2 bg-brand-500 text-white rounded-xl text-[10px] font-bold hover:bg-brand-600 transition-all uppercase tracking-widest shadow-lg shadow-brand-500/20">
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-6 space-y-12">
        {/* Carousel */}
        <div className="relative group">
          <div className="flex gap-4 overflow-hidden rounded-[2rem]">
            {banners.map((banner, idx) => (
              <div 
                key={banner.id}
                className={`min-w-full h-64 lg:h-96 rounded-[2rem] bg-gradient-to-br ${banner.color} p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden transition-all duration-700 ease-in-out`}
                style={{ transform: `translateX(-${activeBanner * 100}%)` }}
              >
                <div className="relative z-10 space-y-4 max-w-md">
                  <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">
                    {banner.title}
                  </div>
                  <h2 className="text-4xl lg:text-6xl font-black leading-tight">{banner.discount}</h2>
                  <button className="w-fit px-8 py-3 bg-white text-black rounded-xl text-xs font-black shadow-xl hover:scale-105 transition-all uppercase tracking-widest">
                    {banner.action}
                  </button>
                </div>
                <img src={banner.image} alt="" className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-30 mix-blend-overlay" />
                
                {/* Decorative elements */}
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-black/10 rounded-full blur-2xl"></div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => setActiveBanner(prev => Math.max(0, prev - 1))}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setActiveBanner(prev => Math.min(banners.length - 1, prev + 1))}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveBanner(idx)}
                className={`h-1.5 rounded-full transition-all ${activeBanner === idx ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
              />
            ))}
          </div>
        </div>

        {/* Favourite Brands */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold uppercase tracking-widest">{t('favouriteBrands')}</h3>
            <button className="text-brand-500 text-[10px] font-bold uppercase tracking-widest hover:underline">{t('viewAll')}</button>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {favouriteBrands.map((brand, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 min-w-[100px] group cursor-pointer">
                <div className="w-20 h-20 bg-zinc-900 border border-white/5 rounded-full p-4 group-hover:border-brand-500/50 transition-all relative">
                  <img src={brand.icon} alt={brand.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                  <div className="absolute -top-1 -right-1 bg-brand-500 text-[8px] font-black px-1.5 py-0.5 rounded-full">
                    {brand.discount}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-zinc-400 group-hover:text-white">{brand.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Gift Cards */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold uppercase tracking-widest">{t('giftCards')}</h3>
            <button className="text-brand-500 text-[10px] font-bold uppercase tracking-widest hover:underline">{t('viewAll')}</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {giftCardCategories.map((cat, idx) => (
              <div key={idx} className={`${cat.color} border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-all cursor-pointer group text-center`}>
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <p className="font-bold text-xs uppercase tracking-widest">{cat.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold uppercase tracking-widest">Trending Subscriptions</h3>
            <button onClick={() => onNavigate(AppView.CUSTOMER_PORTAL)} className="text-brand-500 text-[10px] font-bold uppercase tracking-widest hover:underline">{t('viewAll')}</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, idx) => (
              <div key={idx} className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-5 hover:bg-zinc-900 transition-all group cursor-pointer relative overflow-hidden">
                <div className="aspect-video rounded-xl bg-zinc-800 mb-4 overflow-hidden relative">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700">📦</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Zap size={12} className="text-yellow-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Premium</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">{product.category}</p>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => <div key={s} className="w-1 h-1 bg-brand-500 rounded-full"></div>)}
                    </div>
                  </div>
                  <h4 className="font-bold text-sm truncate">{product.name}</h4>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-zinc-500 line-through">{formatCurrency(product.sellPrice * 1.5, language, storeSettings?.currency || 'USD')}</span>
                      <span className="text-lg font-black text-brand-500">{formatCurrency(product.sellPrice, language, storeSettings?.currency || 'USD')}</span>
                    </div>
                    <button className="px-4 py-2 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-all">
                      {t('subscribeNow')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* easyPOS Premium Banner */}
        <section className="bg-gradient-to-r from-brand-600 to-indigo-600 rounded-[2.5rem] p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10 space-y-4 text-center lg:text-left">
            <h2 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter italic">{t('easyposPremium')}</h2>
            <p className="text-sm opacity-90 font-medium max-w-md">{t('lookingForUpgrade')}</p>
            <button className="px-10 py-4 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
              {t('buyNow')}
            </button>
          </div>
          <div className="relative z-10 flex -space-x-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-16 h-16 rounded-full border-4 border-brand-600 bg-zinc-800 overflow-hidden">
                <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-16 h-16 rounded-full border-4 border-brand-600 bg-white text-black flex items-center justify-center font-black text-xs">
              +10k
            </div>
          </div>
          {/* Background shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
        </section>

        {/* Trust Factors Section */}
        <section className="space-y-12 py-12">
          {/* Security Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <ShieldCheck className="text-emerald-500" />, title: 'SSL Secured', desc: '256-bit Encryption' },
              { icon: <Shield className="text-blue-500" />, title: 'PCI-DSS Compliant', desc: 'Secure Payments' },
              { icon: <Database className="text-purple-500" />, title: 'Encrypted Data', desc: 'Privacy First' },
              { icon: <Zap className="text-yellow-500" />, title: '99.9% Uptime', desc: 'Enterprise Grade' }
            ].map((badge, i) => (
              <div key={i} className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center gap-3">
                <div className="p-3 bg-white/5 rounded-xl">{badge.icon}</div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest">{badge.title}</h4>
                  <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trusted By */}
          <div className="text-center space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Trusted by 500+ Global Enterprises</h3>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all">
              {['Microsoft', 'Google', 'Amazon', 'Netflix', 'Spotify', 'Adobe'].map(brand => (
                <span key={brand} className="text-xl font-black tracking-tighter uppercase italic">{brand}</span>
              ))}
            </div>
          </div>

          {/* Case Studies / Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "How 'The Coffee Matrix' Scaled to 50 Locations",
                stat: "30% Increase in Efficiency",
                quote: "easyPOS transformed our checkout experience. The AI identity scan reduced fraud by 95%.",
                author: "Sarah Chen, CEO"
              },
              {
                title: "Global Subscriptions Simplified for 'TechFlow'",
                stat: "2M+ Transactions Processed",
                quote: "The best enterprise POS we've ever used. Seamless, fast, and incredibly secure.",
                author: "Marcus Thorne, CTO"
              }
            ].map((study, i) => (
              <div key={i} className="bg-zinc-900 border border-white/5 p-8 rounded-[2.5rem] space-y-6 group hover:border-brand-500/30 transition-all">
                <div className="space-y-2">
                  <span className="text-brand-500 text-[10px] font-black uppercase tracking-widest">{study.stat}</span>
                  <h4 className="text-xl font-black tracking-tight">{study.title}</h4>
                </div>
                <p className="text-sm text-zinc-400 italic leading-relaxed">"{study.quote}"</p>
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-zinc-800"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{study.author}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-white/5 pt-16 pb-8 px-4 lg:px-8 mt-20">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
              </div>
              <span className="text-xl font-bold tracking-tighter">easyPOS</span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed uppercase tracking-widest">
              {t('copyright')} {t('poweredBy')}
            </p>
            <div className="flex gap-4">
              {['Instagram', 'Twitter', 'LinkedIn'].map(social => (
                <button key={social} className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
                  <Globe size={14} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-black text-xs uppercase tracking-widest text-brand-500">{t('legal')}</h4>
            <ul className="text-[10px] font-bold text-zinc-500 space-y-4 uppercase tracking-widest">
              <li onClick={() => setShowPolicy(t('privacyPolicy'))} className="hover:text-white cursor-pointer transition-colors">{t('privacyPolicy')}</li>
              <li onClick={() => setShowPolicy(t('termsConditions'))} className="hover:text-white cursor-pointer transition-colors">{t('termsConditions')}</li>
              <li onClick={() => setShowPolicy(t('refundPolicy'))} className="hover:text-white cursor-pointer transition-colors">{t('refundPolicy')}</li>
              <li className="hover:text-white cursor-pointer transition-colors">{t('shippingPolicy')}</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-black text-xs uppercase tracking-widest text-brand-500">{t('company')}</h4>
            <ul className="text-[10px] font-bold text-zinc-500 space-y-4 uppercase tracking-widest">
              <li onClick={() => setShowPolicy(t('aboutUs'))} className="hover:text-white cursor-pointer transition-colors">{t('aboutUs')}</li>
              <li onClick={() => setShowPolicy(t('contactUs'))} className="hover:text-white cursor-pointer transition-colors">{t('contactUs')}</li>
              <li className="hover:text-white cursor-pointer transition-colors">{t('services')}</li>
              <li className="hover:text-white cursor-pointer transition-colors">{t('support')}</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-black text-xs uppercase tracking-widest text-brand-500">{t('downloadApp')}</h4>
            <div className="flex flex-col gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-9 w-fit cursor-pointer hover:opacity-80 transition-opacity" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-9 w-fit cursor-pointer hover:opacity-80 transition-opacity" />
            </div>
          </div>
        </div>
        
        <div className="max-w-screen-2xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 w-full md:w-auto">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t('suggestSubscription')}</span>
            <input type="text" placeholder={t('submitFavourite')} className="bg-transparent text-[10px] outline-none flex-1 md:w-48 font-bold" />
            <button className="bg-brand-500 p-1.5 rounded-lg text-white hover:bg-brand-600 transition-all"><ChevronRight size={14} /></button>
          </div>
          
          <div className="flex items-center gap-6">
            {currentUser?.role === 'ADMIN' && (
              <button onClick={onSeedDemoProducts} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors">
                <Database size={14} /> Seed Products
              </button>
            )}
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              {t('location')}: <span className="text-brand-500">{location}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Barcode Scanner Modal */}
      {isScanning && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="bg-zinc-900 border border-white/10 rounded-[2.5rem] w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                <Scan className="text-brand-500" /> {t('barcodeScan')}
              </h3>
              <button onClick={() => setIsScanning(false)} className="p-2 hover:bg-white/5 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="p-8">
              <div id="reader" className="w-full rounded-2xl overflow-hidden border border-white/10 bg-black"></div>
              <p className="text-center text-[10px] font-bold text-zinc-500 mt-6 uppercase tracking-widest">Point your camera at a barcode</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#0a0a0a]/95 backdrop-blur-2xl border-t border-white/5 px-6 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button onClick={() => onNavigate(AppView.HOME)} className="flex flex-col items-center gap-1 text-brand-500">
            <HomeIcon size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">{t('home')}</span>
          </button>
          <button onClick={() => onNavigate(AppView.CUSTOMER_PORTAL)} className="flex flex-col items-center gap-1 text-zinc-500">
            <Compass size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">{t('explore')}</span>
          </button>
          <button onClick={() => onNavigate(AppView.CUSTOMER_DASHBOARD)} className="flex flex-col items-center gap-1 text-zinc-500">
            <Wallet size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">{t('wallet')}</span>
          </button>
          <button onClick={() => onNavigate(AppView.CUSTOMER_PORTAL)} className="flex flex-col items-center gap-1 text-zinc-500">
            <ShoppingCart size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">{t('cart')}</span>
          </button>
        </div>
      </div>

      {/* Policy Modal */}
      {showPolicy && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-zinc-900 border border-white/10 rounded-[2.5rem] w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-black uppercase tracking-widest">{showPolicy}</h3>
              <button onClick={() => setShowPolicy(null)} className="p-2 hover:bg-white/5 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 overflow-y-auto text-xs font-medium text-zinc-400 leading-relaxed space-y-4">
              <p>
                This is a placeholder for the <strong>{showPolicy}</strong>. In a production environment, this section would contain the full legal text governing the use of easyPOS services.
              </p>
              <p>
                Our commitment to transparency and security is paramount. We ensure that all user data is handled with the highest standards of privacy and that our terms are clear and fair for all business partners and customers.
              </p>
              <div className="pt-8">
                <button onClick={() => setShowPolicy(null)} className="w-full py-4 bg-brand-500 text-white rounded-xl font-black uppercase tracking-widest hover:bg-brand-600 transition-all">
                  I Understand
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
