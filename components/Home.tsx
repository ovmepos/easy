
import React, { useState } from 'react';
import { Search, MapPin, ShoppingCart, MessageCircle, Wallet, Compass, Home as HomeIcon, ChevronLeft, ChevronRight, Globe, User as UserIcon, LogOut } from 'lucide-react';
import { Language, User, StoreSettings } from '../types';

interface HomeProps {
  language: Language;
  t: (key: string) => string;
  currentUser: User | null;
  onLogout: () => void;
  onLoginRequest: () => void;
  storeSettings: StoreSettings;
  onNavigate: (view: any) => void;
}

export const Home: React.FC<HomeProps> = ({
  language,
  t,
  currentUser,
  onLogout,
  onLoginRequest,
  storeSettings,
  onNavigate
}) => {
  const [activeBanner, setActiveBanner] = useState(0);

  const banners = [
    {
      id: 1,
      title: "Canva Plans at",
      discount: "92.52%",
      action: "SUBSCRIBE NOW",
      color: "from-purple-600 to-blue-500",
      image: "https://picsum.photos/seed/canva/800/400"
    },
    {
      id: 2,
      title: "zomato Gift Card",
      discount: "3% Discount",
      action: "BUY NOW",
      color: "from-red-500 to-orange-400",
      image: "https://picsum.photos/seed/zomato/800/400"
    },
    {
      id: 3,
      title: "SUBSPACE PREMIUM",
      discount: "Looking for upgrade?",
      action: "BUY NOW",
      color: "from-zinc-800 to-zinc-900",
      image: "https://picsum.photos/seed/premium/800/400"
    }
  ];

  const brands = [
    { name: 'Flipkart', discount: '2% OFF', icon: 'https://logo.clearbit.com/flipkart.com' },
    { name: 'Uber', discount: '3% OFF', icon: 'https://logo.clearbit.com/uber.com' },
    { name: 'Amazon', discount: '4% OFF', icon: 'https://logo.clearbit.com/amazon.com' },
    { name: 'Swiggy', discount: '3% OFF', icon: 'https://logo.clearbit.com/swiggy.com' },
    { name: 'SonyLIV', discount: '48% OFF', icon: 'https://logo.clearbit.com/sonyliv.com' },
    { name: 'Zomato', discount: '6% OFF', icon: 'https://logo.clearbit.com/zomato.com' },
    { name: 'Zee5', discount: '50% OFF', icon: 'https://logo.clearbit.com/zee5.com' },
    { name: 'Decathlon', discount: '4% OFF', icon: 'https://logo.clearbit.com/decathlon.com' },
    { name: 'Myntra', discount: '4.5% OFF', icon: 'https://logo.clearbit.com/myntra.com' },
    { name: 'Pizza Hut', discount: '10.5% OFF', icon: 'https://logo.clearbit.com/pizzahut.com' },
    { name: 'Dominos', discount: '6.3% OFF', icon: 'https://logo.clearbit.com/dominos.com' },
    { name: 'Netflix', discount: '5.5% OFF', icon: 'https://logo.clearbit.com/netflix.com' },
  ];

  const categories = [
    { name: 'Food', count: '7+ Brands', color: 'bg-orange-100', icon: '🍔' },
    { name: 'Entertainment', count: '10+ Brands', color: 'bg-purple-100', icon: '🎬' },
    { name: 'Fashion', count: '6+ Brands', color: 'bg-pink-100', icon: '👗' },
    { name: 'Home Needs', count: '2+ Brands', color: 'bg-green-100', icon: '🏠' },
    { name: 'Healthcare', count: '2+ Brands', color: 'bg-blue-100', icon: '🏥' },
    { name: 'News', count: '2+ Brands', color: 'bg-yellow-100', icon: '📰' },
  ];

  const subscriptions = [
    { name: 'Youtube Premium', price: '99', duration: '1 months', available: '2+ Groups', icon: 'https://logo.clearbit.com/youtube.com' },
    { name: 'TrueCaller Family', price: '497', duration: '1 years', available: '1+ Groups', icon: 'https://logo.clearbit.com/truecaller.com' },
    { name: 'Netflix Standard', price: '250', duration: '1 months', available: '11+ Groups', icon: 'https://logo.clearbit.com/netflix.com' },
    { name: 'Netflix Premium', price: '163', duration: '1 months', available: '157+ Groups', icon: 'https://logo.clearbit.com/netflix.com' },
    { name: 'JioHotstar Premium', price: '233', duration: '3 months', available: '4+ Groups', icon: 'https://logo.clearbit.com/hotstar.com' },
    { name: 'Prime Video', price: '230', duration: '3 months', available: '31+ Groups', icon: 'https://logo.clearbit.com/primevideo.com' },
  ];

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
                <span className="font-bold text-white">Lucknow, Uttar Pradesh, India</span>
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <button onClick={() => onNavigate('HOME')} className="text-white flex items-center gap-2"><HomeIcon size={18} /> Home</button>
            <button onClick={() => onNavigate('CUSTOMER_PORTAL')} className="hover:text-white flex items-center gap-2"><Compass size={18} /> Explore</button>
            <button className="hover:text-white flex items-center gap-2"><Wallet size={18} /> Wallet</button>
            <button className="hover:text-white flex items-center gap-2"><MessageCircle size={18} /> Chat</button>
            <button className="hover:text-white flex items-center gap-2 relative">
              <ShoppingCart size={18} /> Cart
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
            <button className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-white/5">
              EN <Globe size={14} />
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

      <main className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-8 space-y-12">
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

        {/* Favourite Brands */}
        <section>
          <h3 className="text-xl font-bold mb-6">Favourite Brands</h3>
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
            {brands.map((brand, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 min-w-[80px] group cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/5 p-3 group-hover:border-brand-500 transition-all">
                  <img src={brand.icon} alt={brand.name} className="w-full h-full object-contain rounded-full" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">{brand.name}</p>
                  <p className="text-[10px] font-black text-brand-500">{brand.discount}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gift Cards */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Gift Cards</h3>
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

        {/* Shared Subscriptions */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Shared Subscriptions</h3>
            <button className="text-brand-500 text-xs font-bold hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subscriptions.map((sub, idx) => (
              <div key={idx} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 hover:bg-zinc-900 transition-all group cursor-pointer">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-black p-2">
                    <img src={sub.icon} alt={sub.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{sub.name}</h4>
                    <p className="text-[10px] text-zinc-500">Sharing with others</p>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-2xl font-black">₹{sub.price}</span>
                  <span className="text-[10px] text-zinc-500">/device</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[10px] font-bold">
                  <div className="space-y-1">
                    <p className="text-zinc-500 uppercase">Duration</p>
                    <p className="bg-zinc-800 px-2 py-1 rounded-md w-fit">{sub.duration}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-zinc-500 uppercase">Available</p>
                    <p className="bg-zinc-800 px-2 py-1 rounded-md w-fit">{sub.available}</p>
                  </div>
                </div>
              </div>
            ))}
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
              © 2026 easyPOS. All rights reserved. Professional Point of Sale and Subscription Management System.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm">Legal</h4>
            <ul className="text-xs text-zinc-500 space-y-3">
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer">Terms of Service</li>
              <li className="hover:text-white cursor-pointer">Refund Policy</li>
              <li className="hover:text-white cursor-pointer">Shipping Policy</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm">Company</h4>
            <ul className="text-xs text-zinc-500 space-y-3">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Contact Us</li>
              <li className="hover:text-white cursor-pointer">Blogs</li>
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
          <div className="flex gap-6 text-zinc-500">
            <button className="hover:text-white transition-colors">LinkedIn</button>
            <button className="hover:text-white transition-colors">Instagram</button>
            <button className="hover:text-white transition-colors">Facebook</button>
            <button className="hover:text-white transition-colors">X</button>
          </div>
          <div className="flex items-center gap-4 bg-zinc-900/50 border border-white/10 rounded-full px-4 py-2">
            <span className="text-[10px] font-bold text-zinc-400">Suggest a Subscription!</span>
            <input type="text" placeholder="Submit Your Favourite" className="bg-transparent text-[10px] outline-none w-40" />
            <button className="bg-brand-500 p-1.5 rounded-full"><ChevronRight size={14} /></button>
          </div>
        </div>
      </footer>
    </div>
  );
};
