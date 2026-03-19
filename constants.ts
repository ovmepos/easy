
import { Product, User } from './types';

export const CURRENCY = '$';

export const BRAND_LOGO = 'https://images.unsplash.com/photo-1633409302455-582aba7965e4?auto=format&fit=crop&q=80&w=200';

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'SAR', symbol: 'SR', name: 'Saudi Riyal' },
  { code: 'AED', symbol: 'DH', name: 'UAE Dirham' },
  { code: 'KWD', symbol: 'KD', name: 'Kuwaiti Dinar' },
  { code: 'BHD', symbol: 'BD', name: 'Bahraini Dinar' },
  { code: 'OMR', symbol: 'OR', name: 'Omani Rial' },
  { code: 'QAR', symbol: 'QR', name: 'Qatari Riyal' },
];

export const INITIAL_PRODUCTS: Product[] = [
  // --- APPAREL / CLOTHING ---
  {
    id: 'DEMO-CL-001',
    sku: 'TSH-BLK-M',
    name: 'Urban Essentials Tee - Black',
    costPrice: 8.00,
    sellPrice: 25.00,
    stock: 45,
    category: 'Apparel',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600',
    size: 'M',
    color: 'Black'
  },
  {
    id: 'DEMO-CL-002',
    sku: 'JNS-BLU-32',
    name: 'Classic Slim Fit Denim',
    costPrice: 22.00,
    sellPrice: 65.00,
    stock: 30,
    category: 'Apparel',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=600',
    size: '32/S',
    color: 'Blue'
  },
  // --- ELECTRONICS ---
  {
    id: 'DEMO-EL-001',
    sku: 'SW-PRO-MAX',
    name: 'Titan Pro Smartwatch',
    costPrice: 120.00,
    sellPrice: 299.00,
    stock: 15,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    color: 'Space Gray'
  },
  {
    id: 'DEMO-EL-002',
    sku: 'MSE-WR-RGB',
    name: 'GamerX Wireless Mouse',
    costPrice: 15.00,
    sellPrice: 45.00,
    stock: 50,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600',
    color: 'RGB Black'
  },
  // --- BEVERAGES & CAFE ---
  {
    id: 'DEMO-CF-001',
    sku: 'LAT-HOT-LG',
    name: 'Artisan Cafe Latte',
    costPrice: 1.20,
    sellPrice: 5.50,
    stock: 100,
    category: 'Cafe',
    image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=600',
    size: 'Large'
  },
  {
    id: 'DEMO-CF-002',
    sku: 'CRS-BUT-X',
    name: 'Butter Croissant',
    costPrice: 0.80,
    sellPrice: 3.25,
    stock: 40,
    category: 'Cafe',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600'
  },
  // --- GROCERIES ---
  {
    id: 'DEMO-GR-001',
    sku: 'MLK-FR-1L',
    name: 'Farm Fresh Milk 1L',
    costPrice: 0.90,
    sellPrice: 1.80,
    stock: 60,
    category: 'Groceries',
    image: 'https://images.unsplash.com/photo-1563636619-e910ef2a844b?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'DEMO-GR-002',
    sku: 'BRD-WH-SL',
    name: 'Whole Wheat Sliced Bread',
    costPrice: 1.10,
    sellPrice: 2.50,
    stock: 45,
    category: 'Groceries',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600'
  },
  // --- AUTOMOTIVE (FOR VARIETY) ---
  {
    id: 'DEMO-AU-001',
    sku: 'OIL-SYN-5W',
    name: 'Ultra Synthetic Engine Oil',
    costPrice: 15.00,
    sellPrice: 35.00,
    stock: 25,
    category: 'Automotive',
    image: 'https://images.unsplash.com/photo-1590674116491-91253018260b?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'DEMO-AU-002',
    sku: 'LED-H4-KIT',
    name: 'Crystal Beam LED Headlights',
    costPrice: 45.00,
    sellPrice: 110.00,
    stock: 12,
    category: 'Automotive',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'admin_1',
    name: 'Nabeel Khan',
    username: 'nabeelkhan',
    password: 'root_password',
    role: 'ADMIN',
    email: 'nabeelkhan1007@gmail.com'
  },
  {
    id: 'demo_sys_admin',
    name: 'Test Administrator',
    username: 'testadmin',
    password: '123',
    role: 'ADMIN'
  },
  {
    id: 'demo_vendor',
    name: 'Demo Vendor',
    username: 'vendor',
    password: '123',
    role: 'VENDOR',
    vendorId: 'VND-DEMO',
    vendorSettings: {
        storeName: 'Demo Vendor Shop',
        storeAddress: '123 Demo St',
        shopPasscode: '2026',
        customUrlSlug: 'vnd-demo'
    },
    vendorStaffLimit: 5
  },
  {
    id: 'demo_customer',
    name: 'Demo Customer',
    username: 'customer',
    password: '123',
    role: 'CUSTOMER'
  }
];
