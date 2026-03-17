
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { POS } from './components/POS';
import { Inventory } from './components/Inventory';
import { Reports } from './components/Reports';
import { Login } from './components/Login';
import { Home } from './components/Home';
import { StockCheck } from './components/StockCheck';
import { Settings } from './components/Settings';
import { BaileysSetup } from './components/BaileysSetup';
import { Orders } from './components/Orders';
import { PrintBarcode } from './components/PrintBarcode';
import { ClawdBot } from './components/ClawdBot';
import { CustomerPortal } from './components/CustomerPortal';
import { Bookings } from './components/Bookings';
import { VendorPanel } from './components/VendorPanel';
import { Categories } from './components/Categories';
import { AppView, Product, Sale, User, StoreSettings, Language, CartItem, Booking, Category } from './types';
import { translations } from './translations';
import { Loader2, Menu, Globe, ChevronLeft, LogOut } from 'lucide-react';
import { db, auth } from './firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [currentView, setCurrentView] = useState<AppView>(AppView.POS);
  const [navigationHistory, setNavigationHistory] = useState<AppView[]>([]);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => localStorage.getItem('easyPOS_theme') === 'dark');
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('easyPOS_language') as Language) || 'en');
  const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth >= 1024);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (loggedInUser.role === 'ADMIN') setCurrentView(AppView.POS);
    else if (loggedInUser.role === 'VENDOR') setCurrentView(AppView.VENDOR_PANEL);
    else setCurrentView(AppView.HOME);
  };

  // Firebase Sync
  useEffect(() => {
    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
      setProducts(prods);
    });

    const unsubscribeSales = onSnapshot(query(collection(db, 'sales'), orderBy('timestamp', 'desc')), (snapshot) => {
      const s = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Sale));
      setSales(s);
    });

    const unsubscribeProfiles = onSnapshot(collection(db, 'profiles'), (snapshot) => {
      const u = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
      setUsers(u);
    });

    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'store'), (doc) => {
      if (doc.exists()) {
        setStoreSettings(doc.data() as StoreSettings);
      }
    });

    const unsubscribeBookings = onSnapshot(query(collection(db, 'bookings'), orderBy('date', 'desc')), (snapshot) => {
      const b = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Booking));
      setBookings(b);
    });

    const unsubscribeCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const cats = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Category));
      setCategories(cats);
    });

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const email = firebaseUser.email?.toLowerCase() || '';
        const isAdmin = email === 'ovmepos@gmail.com' || email === 'nabeelkhan1007@gmail.com' || email === 'zahratalsawsen1@gmail.com';
        
        // Check if profile exists, if not create one
        const userProfile: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          username: email.split('@')[0],
          role: isAdmin ? 'ADMIN' : 'CUSTOMER',
          email: email,
          avatar: firebaseUser.photoURL || undefined
        };
        
        setUser(userProfile);
        // Optionally save/update profile in Firestore
        await setDoc(doc(db, 'profiles', firebaseUser.uid), userProfile, { merge: true });
        
        if (isAdmin) setCurrentView(AppView.POS);
        else setCurrentView(AppView.HOME);
      } else {
        setUser(null);
        setCurrentView(AppView.LOGIN);
      }
      setIsAuthChecking(false);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeSales();
      unsubscribeProfiles();
      unsubscribeSettings();
      unsubscribeBookings();
      unsubscribeCategories();
      unsubscribeAuth();
    };
  }, []);

  const handleAddProduct = async (product: Product) => {
    try {
      await addDoc(collection(db, 'products'), product);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    try {
      const { id, ...data } = product;
      await updateDoc(doc(db, 'products', id), data as any);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleAddCategory = async (category: Omit<Category, 'id'>) => {
    try {
      await addDoc(collection(db, 'categories'), category);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleUpdateCategory = async (category: Category) => {
    try {
      const { id, ...data } = category;
      await updateDoc(doc(db, 'categories', id), data as any);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleCheckout = async (items: CartItem[], total: number, paymentMethod: 'CASH' | 'CARD', subTotal: number, discount: number, tax: number, discountType: 'fixed' | 'percent', customerName?: string, customerPhone?: string) => {
    const sale: Sale = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      items,
      total,
      paymentMethod,
      subTotal,
      discount,
      tax,
      discountType,
      customerName,
      customerPhone,
      processedBy: user?.id
    };

    try {
      await addDoc(collection(db, 'sales'), sale);
      // Update stock
      for (const item of items) {
        const productRef = doc(db, 'products', item.id);
        const newStock = item.stock - item.quantity;
        await updateDoc(productRef, { stock: newStock });
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };


  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    name: 'easyPOS',
    address: 'Main Street, City',
    phone: '+1 234 567 890',
    email: 'contact@easypos.com',
    currency: 'USD',
    taxRate: 0,
    logo: 'https://picsum.photos/seed/pos/200/200',
    receiptFooter: 'Thank you for your business!',
    barcodePrefix: 'EP',
    lowStockThreshold: 10
  });

  const handleUpdateStoreSettings = async (settings: StoreSettings) => {
    setStoreSettings(settings);
    try {
      await setDoc(doc(db, 'settings', 'store'), settings);
    } catch (error) {
      console.error("Error updating store settings:", error);
    }
  };

  const navigateTo = useCallback((view: AppView) => {
    setNavigationHistory(prev => [...prev, currentView]);
    setCurrentView(view);
  }, [currentView]);

  const handleGoBack = useCallback(() => {
    if (navigationHistory.length > 0) {
      const prevView = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setCurrentView(prevView);
    }
  }, [navigationHistory]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setCurrentView(AppView.LOGIN);
      setNavigationHistory([]);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleLanguage = () => {
    let newLang: Language;
    if (language === 'en') newLang = 'ar';
    else if (language === 'ar') newLang = 'hi';
    else newLang = 'en';
    
    setLanguage(newLang);
    localStorage.setItem('easyPOS_language', newLang);
  };

  const handleAddUser = async (u: User) => {
    try {
      await setDoc(doc(db, 'profiles', u.id), u);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleUpdateUser = async (u: User) => {
    try {
      await updateDoc(doc(db, 'profiles', u.id), u as any);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'profiles', id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleAddBooking = async (booking: Booking) => {
    try {
      await addDoc(collection(db, 'bookings'), booking);
    } catch (error) {
      console.error("Error adding booking:", error);
    }
  };

  const handleUpdateBooking = async (booking: Booking) => {
    try {
      const { id, ...data } = booking;
      await updateDoc(doc(db, 'bookings', id!), data as any);
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'bookings', id));
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const t = (key: string) => translations[language][key] || key;

  if (isAuthChecking) {
      return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="animate-spin text-brand-500" size={64} strokeWidth={3} /></div>;
  }

  if (!user && currentView !== AppView.CUSTOMER_PORTAL) {
    return (
      <Login 
        onLogin={handleLogin} 
        users={users} t={t} isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} 
        language={language} toggleLanguage={toggleLanguage} activeVendorId={null}
      />
    );
  }

  const getViewTitle = (view: AppView) => {
    switch(view) {
      case AppView.POS: return t('posTerminal');
      case AppView.INVENTORY: return t('inventory');
      case AppView.REPORTS: return t('reportsAi');
      case AppView.VENDOR_PANEL: return t('vendorPanel');
      case AppView.SETTINGS: return t('settings');
      case AppView.ORDERS: return t('ordersReturns');
      case AppView.BOOKINGS: return t('bookings');
      case AppView.STOCK_CHECK: return t('stockCheck');
      case AppView.PRINT_BARCODE: return t('printBarcode');
      case AppView.CATEGORIES: return t('categoryList');
      default: return 'System';
    }
  };

  return (
    <div className="flex h-[100svh] overflow-hidden bg-[#111827] font-sans flex-col lg:flex-row transition-colors">
      {!user?.role.includes('CUSTOMER') && (
        <div className={`fixed inset-y-0 z-[100] w-72 transform transition-all duration-500 lg:static lg:w-72 lg:translate-x-0 ${isSidebarVisible ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'}`}>
            <Sidebar currentView={currentView} onChangeView={navigateTo} onLogout={handleLogout} currentUser={user!} isOnline={true} isSyncing={isSyncing} isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} language={language} toggleLanguage={toggleLanguage} t={t} onClose={() => setIsSidebarVisible(false)} />
        </div>
      )}
      <main className={`flex-1 overflow-hidden relative flex flex-col bg-[#f8fafc] dark:bg-slate-950 transition-all duration-500 ${!user?.role.includes('CUSTOMER') && isSidebarVisible ? 'ltr:lg:rounded-l-[44px] rtl:lg:rounded-r-[44px] shadow-2xl' : ''}`}>
        {!user?.role.includes('CUSTOMER') && currentView !== AppView.LOGIN && (
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50 no-print">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsSidebarVisible(!isSidebarVisible)} className="p-2 lg:hidden text-slate-500"><Menu size={24}/></button>
                    <button onClick={handleGoBack} className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:text-brand-600 transition-all flex items-center gap-2 group">
                        <ChevronLeft size={20} className="rtl:rotate-180" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{t('back')}</span>
                    </button>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] dark:text-white italic ml-2">{getViewTitle(currentView)}</h2>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={toggleLanguage} className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl hover:bg-brand-500 hover:text-white transition-all"><Globe size={18}/></button>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all group border border-red-100 dark:border-red-900/20">
                        <LogOut size={16}/><span className="hidden md:inline">{t('logout')}</span>
                    </button>
                </div>
            </header>
        )}
        <div className="flex-1 overflow-hidden relative">
            {currentView === AppView.HOME && <Home language={language} t={t} currentUser={user} onLogout={handleLogout} onLoginRequest={() => setCurrentView(AppView.LOGIN)} storeSettings={storeSettings} onNavigate={navigateTo} />}
            {currentView === AppView.CUSTOMER_PORTAL && <CustomerPortal products={products} language={language} t={t} currentUser={user} onLoginRequest={() => navigateTo(AppView.LOGIN)} onLogout={handleLogout} onUpdateAvatar={() => {}} storeSettings={storeSettings} />}
            {currentView === AppView.VENDOR_PANEL && <VendorPanel products={products} sales={sales} users={users} currentUser={user!} onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} onDeleteProduct={handleDeleteProduct} onBulkUpdateProduct={() => {}} onAddUser={handleAddUser} onUpdateUser={handleUpdateUser} onDeleteUser={handleDeleteUser} language={language} t={t} onGoBack={handleGoBack} />}
            {currentView === AppView.POS && <POS products={products} sales={sales} onCheckout={handleCheckout} storeSettings={storeSettings} onViewOrderHistory={() => navigateTo(AppView.ORDERS)} onUpdateStoreSettings={handleUpdateStoreSettings} t={t} language={language} currentUser={user!} onGoBack={handleGoBack} />}
            {currentView === AppView.INVENTORY && <Inventory 
              products={products} 
              categories={categories.map(c => c.name)}
              onAddProduct={handleAddProduct} 
              onUpdateProduct={handleUpdateProduct} 
              onDeleteProduct={handleDeleteProduct} 
              onBulkUpdateProduct={() => {}} 
              onGoBack={handleGoBack} 
              t={t} 
              currentUser={user!} 
              language={language} 
            />}
            {currentView === AppView.REPORTS && <Reports sales={sales} products={products} users={users} onGoBack={handleGoBack} language={language} />}
            {currentView === AppView.ORDERS && <Orders sales={sales} onProcessReturn={() => {}} storeSettings={storeSettings} onGoBack={handleGoBack} language={language} />}
            {currentView === AppView.SETTINGS && <Settings users={users} vendorRequests={[]} products={products} sales={sales} onAddUser={handleAddUser} onUpdateUser={handleUpdateUser} onDeleteUser={handleDeleteUser} onReviewRequest={() => {}} onLogout={handleLogout} currentUser={user!} storeSettings={storeSettings} onUpdateStoreSettings={() => {}} onGoBack={handleGoBack} language={language} toggleLanguage={toggleLanguage} t={t} />}
            {currentView === AppView.BOOKINGS && <Bookings bookings={bookings} onAddBooking={handleAddBooking} onUpdateBooking={handleUpdateBooking} onDeleteBooking={handleDeleteBooking} onGoBack={handleGoBack} language={language} t={t} />}
            {currentView === AppView.STOCK_CHECK && <StockCheck products={products} onUpdateStock={(id, newStock) => {
              const product = products.find(p => p.id === id);
              if (product) handleUpdateProduct({ ...product, stock: newStock });
            }} onGoBack={handleGoBack} language={language} t={t} />}
            {currentView === AppView.PRINT_BARCODE && <PrintBarcode products={products} storeSettings={storeSettings} onGoBack={handleGoBack} language={language} t={t} />}
            {currentView === AppView.BAILEYS_SETUP && <BaileysSetup onUpdateStoreSettings={handleUpdateStoreSettings} settings={storeSettings} onGoBack={handleGoBack} t={t} />}
            {currentView === AppView.CATEGORIES && <Categories 
              products={products} 
              categories={categories}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
              onUpdateProduct={handleUpdateProduct} 
              onGoBack={handleGoBack} 
              language={language} 
              t={t} 
            />}
        </div>
        {!user?.role.includes('CUSTOMER') && <ClawdBot products={products} sales={sales} storeSettings={storeSettings} currentUser={user!} language={language} t={t} />}
      </main>
    </div>
  );
};

export default App;
