
import React, { useState, useEffect } from 'react';
import { Search, MapPin, ShoppingCart, MessageCircle, Wallet, Compass, Home as HomeIcon, ChevronLeft, ChevronRight, Globe, User as UserIcon, LogOut, ShieldCheck, Truck, Headphones, Zap } from 'lucide-react';
import { Language, User, StoreSettings, Product } from '../types';
import { formatCurrency } from '../utils/format';

interface HomeProps {
  language: Language;
  t: (key: string) => string;
  currentUser: User | null;
  onLogout: () => void;
  onLoginRequest: () => void;
  storeSettings: StoreSettings;
  onNavigate: (view: any) => void;
  products: Product[];
}

export const Home: React.FC<HomeProps> = ({
  language,
  t,
  currentUser,
  onLogout,
  onLoginRequest,
  storeSettings,
  onNavigate,
  products
}) => {
  const [activeBanner, setActiveBanner] = useState(0);
  const [location, setLocation] = useState<string>(t('detectingLocation'));
  const [showPolicy, setShowPolicy] = useState<string | null>(null);

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
      title: storeSettings.name || "Welcome to EasyPOS",
      discount: "New Arrivals",
      action: "SHOP NOW",
      color: "from-brand-600 to-indigo-600",
      image: "https://picsum.photos/seed/shop/800/400"
    },
    {
      id: 2,
      title: "Exclusive Offers",
      discount: "Up to 50% OFF",
      action: "EXPLORE",
      color: "from-emerald-600 to-teal-500",
      image: "https://picsum.photos/seed/offer/800/400"
    }
  ];

  const categories = Array.from(new Set(products.map(p => p.category))).map(cat => ({
    name: cat,
    count: `${products.filter(p => p.category === cat).length} Products`,
    icon: '📦',
    color: 'bg-brand-500/10'
  }));

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-brand-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 px-4 lg:px-8 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('HOME')}>
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-black rounded-sm rotate-45"></div>
              </div>
              <span className="text-xl font-bold tracking-tighter">easyPOS</span>
            </div>

            <div className="hidden xl:flex items-center gap-2 text-xs text-zinc-400">
              <MapPin size={14} className="text-brand-500" />
              <div className="flex flex-col">
                <span className="text-[10px] opacity-50">Delivery in minutes</span>
                <span className="font-bold text-white truncate max-w-[200px]">{location}</span>
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <button onClick={() => onNavigate('HOME')} className="text-white flex items-center gap-2"><HomeIcon size={18} /> {t('home')}</button>
            <button onClick={() => onNavigate('CUSTOMER_PORTAL')} className="hover:text-white flex items-center gap-2"><Compass size={18} /> {t('explore')}</button>
            <button onClick={() => onNavigate('CUSTOMER_DASHBOARD')} className="hover:text-white flex items-center gap-2"><Wallet size={18} /> {t('wallet')}</button>
            <button onClick={() => onNavigate('CUSTOMER_DASHBOARD')} className="hover:text-white flex items-center gap-2"><MessageCircle size={18} /> {t('chat')}</button>
            <button className="hover:text-white flex items-center gap-2 relative">
              <ShoppingCart size={18} /> {t('cart')}
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-brand-500 text-white text-[10px] rounded-full flex items-center justify-center">0</span>
            </button>
          </nav>

          <div className="flex-1 max-w-md relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Quick search" 
              className="w-full bg-zinc-900/50 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-white/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-white/5 uppercase">
              {language} <Globe size={14} />
            </button>
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center font-bold text-sm border-2 border-white/10 overflow-hidden">
                  {currentUser.avatar ? <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" /> : currentUser.name[0]}
                </div>
                <button onClick={onLogout} className="p-2 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 rounded-lg transition-all">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button onClick={onLoginRequest} className="px-6 py-2.5 bg-white text-black rounded-full text-xs font-bold hover:bg-zinc-200 transition-all">
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-8 space-y-16">
        {/* Carousel */}
        <div className="relative group">
          <div className="flex gap-4 overflow-hidden rounded-3xl">
            {banners.map((banner, idx) => (
              <div 
                key={banner.id}
                className={`min-w-full lg:min-w-[calc(50%-8px)] h-64 lg:h-80 rounded-3xl bg-gradient-to-br ${banner.color} p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-500`}
                style={{ transform: `translateX(-${activeBanner * 100}%)` }}
              >
                <div className="relative z-10 space-y-2">
                  <h2 className="text-2xl lg:text-4xl font-bold">{banner.title}</h2>
                  <p className="text-4xl lg:text-6xl font-black">{banner.discount}</p>
                  <p className="text-xs opacity-80">off</p>
                </div>
                <button className="relative z-10 w-fit px-8 py-3 bg-white text-black rounded-full text-xs font-black shadow-xl hover:scale-105 transition-all">
                  {banner.action}
                </button>
                <img src={banner.image} alt="" className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-40 mix-blend-overlay" />
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => setActiveBanner(prev => Math.max(0, prev - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => setActiveBanner(prev => Math.min(banners.length - 1, prev + 1))}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={24} />
          </button>

          <div className="flex justify-center gap-2 mt-4">
            {banners.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveBanner(idx)}
                className={`h-1.5 rounded-full transition-all ${activeBanner === idx ? 'w-8 bg-brand-500' : 'w-2 bg-zinc-700'}`}
              />
            ))}
          </div>
        </div>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Truck className="text-brand-500" />, title: "Fast Delivery", desc: "Get your orders in record time" },
            { icon: <ShieldCheck className="text-brand-500" />, title: "Secure Payments", desc: "100% protected transactions" },
            { icon: <Zap className="text-brand-500" />, title: "Best Quality", desc: "Handpicked premium products" },
            { icon: <Headphones className="text-brand-500" />, title: "24/7 Support", desc: "Always here to help you" }
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-4 p-6 bg-zinc-900/30 rounded-2xl border border-white/5">
              <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-bold text-sm">{feature.title}</h4>
                <p className="text-[10px] text-zinc-500">{feature.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Shop by Category</h3>
            <button className="text-brand-500 text-xs font-bold hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, idx) => (
              <div key={idx} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 hover:border-white/20 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold text-zinc-500">{cat.count}</span>
                  <div className={`w-10 h-10 ${cat.color} rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-all`}>
                    {cat.icon}
                  </div>
                </div>
                <p className="font-bold text-sm">{cat.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Featured Products</h3>
            <button onClick={() => onNavigate('CUSTOMER_PORTAL')} className="text-brand-500 text-xs font-bold hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, idx) => (
              <div key={idx} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-4 hover:bg-zinc-900 transition-all group cursor-pointer">
                <div className="aspect-square rounded-2xl bg-zinc-800 mb-4 overflow-hidden relative">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700">📦</div>
                  )}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-brand-500 text-[8px] font-black rounded-lg uppercase tracking-widest">New</div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{product.category}</p>
                  <h4 className="font-bold text-sm truncate">{product.name}</h4>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-black text-brand-500">{formatCurrency(product.sellPrice, language, storeSettings?.currency || 'USD')}</span>
                    <button className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all">
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="bg-zinc-900/50 border border-white/5 rounded-[40px] p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-block px-4 py-1.5 bg-brand-500/10 border border-brand-500/20 rounded-full text-brand-500 text-[10px] font-black uppercase tracking-widest">
              {t('ourMission')}
            </div>
            <h2 className="text-3xl lg:text-5xl font-black leading-tight">
              Revolutionizing Retail with <span className="text-brand-500">Intelligence</span>
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
              EasyPOS is not just a point of sale; it's a complete ecosystem designed to empower small and medium businesses. From AI-driven inventory insights to seamless customer engagement, we provide the tools you need to scale in the modern digital economy.
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-brand-500 text-white rounded-full text-xs font-black hover:bg-brand-600 transition-all">
                {t('getStarted')}
              </button>
              <button className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-full text-xs font-black hover:bg-white/10 transition-all">
                {t('aboutUs')}
              </button>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4 w-full">
            <div className="aspect-square bg-brand-500 rounded-3xl overflow-hidden">
               <img src="https://picsum.photos/seed/tech1/400/400" alt="" className="w-full h-full object-cover mix-blend-overlay opacity-50" />
            </div>
            <div className="aspect-square bg-zinc-800 rounded-3xl overflow-hidden mt-8">
               <img src="https://picsum.photos/seed/tech2/400/400" alt="" className="w-full h-full object-cover opacity-50" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-white/5 pt-16 pb-8 px-4 lg:px-8">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-black rounded-sm rotate-45"></div>
              </div>
              <span className="text-xl font-bold tracking-tighter">easyPOS</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              {t('copyright')} {t('poweredBy')}
            </p>
            <div className="flex gap-4 text-zinc-500">
              <button className="hover:text-white transition-colors">LinkedIn</button>
              <button className="hover:text-white transition-colors">Instagram</button>
              <button className="hover:text-white transition-colors">Facebook</button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm">{t('legal')}</h4>
            <ul className="text-xs text-zinc-500 space-y-3">
              <li onClick={() => setShowPolicy(t('privacyPolicy'))} className="hover:text-white cursor-pointer">{t('privacyPolicy')}</li>
              <li onClick={() => setShowPolicy(t('termsConditions'))} className="hover:text-white cursor-pointer">{t('termsConditions')}</li>
              <li onClick={() => setShowPolicy(t('refundPolicy'))} className="hover:text-white cursor-pointer">{t('refundPolicy')}</li>
              <li className="hover:text-white cursor-pointer">Shipping Policy</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm">{t('company')}</h4>
            <ul className="text-xs text-zinc-500 space-y-3">
              <li onClick={() => setShowPolicy(t('aboutUs'))} className="hover:text-white cursor-pointer">{t('aboutUs')}</li>
              <li onClick={() => setShowPolicy(t('contactUs'))} className="hover:text-white cursor-pointer">{t('contactUs')}</li>
              <li className="hover:text-white cursor-pointer">{t('services')}</li>
              <li className="hover:text-white cursor-pointer">{t('support')}</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-sm">Download Our App</h4>
            <div className="flex flex-col gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10 w-fit cursor-pointer" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-10 w-fit cursor-pointer" />
            </div>
          </div>
        </div>
        
        <div className="max-w-screen-2xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 bg-zinc-900/50 border border-white/10 rounded-full px-4 py-2">
            <span className="text-[10px] font-bold text-zinc-400">Suggest a Subscription!</span>
            <input type="text" placeholder="Submit Your Favourite" className="bg-transparent text-[10px] outline-none w-40" />
            <button className="bg-brand-500 p-1.5 rounded-full"><ChevronRight size={14} /></button>
          </div>
          <div className="text-[10px] text-zinc-500">
            Current Location: <span className="text-brand-500 font-bold">{location}</span>
          </div>
        </div>
      </footer>

      {/* Policy Modal */}
      {showPolicy && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 rounded-[32px] w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xl font-bold">{showPolicy}</h3>
              <button onClick={() => setShowPolicy(null)} className="p-2 hover:bg-white/5 rounded-full transition-all">
                <LogOut size={20} className="rotate-180" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto text-sm text-zinc-400 leading-relaxed space-y-4">
              <p>
                This is a placeholder for the <strong>{showPolicy}</strong>. In a production environment, this section would contain the full legal text governing the use of EasyPOS services.
              </p>
              <p>
                Our commitment to transparency and security is paramount. We ensure that all user data is handled with the highest standards of privacy and that our terms are clear and fair for all business partners and customers.
              </p>
              <p>
                For any specific inquiries regarding our policies, please contact our legal department at legal@easypos.node or reach out via our support channels.
              </p>
              <div className="pt-8 border-t border-white/5">
                <button onClick={() => setShowPolicy(null)} className="w-full py-4 bg-brand-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-brand-600 transition-all">
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
