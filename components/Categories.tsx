
import React, { useState, useMemo } from 'react';
import { Product, Language } from '../types';
import { Plus, Search, ChevronLeft, Trash2, Edit2, LayoutGrid, Tag, Package, MoreVertical, X, CheckCircle } from 'lucide-react';

interface CategoriesProps {
  products: Product[];
  onUpdateProduct: (p: Product) => void;
  onGoBack: () => void;
  language: Language;
  t: (key: string) => string;
}

export const Categories: React.FC<CategoriesProps> = ({ 
  products, onUpdateProduct, onGoBack, language, t 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [products]);

  const filteredCategories = useMemo(() => {
    return categories.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [categories, searchTerm]);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    // In this simple implementation, categories are derived from products.
    // To "add" a category without a product, we'd need a separate categories collection.
    // For now, we'll just show an alert or implement a placeholder if needed.
    alert("Categories are managed by assigning them to products in the Inventory section.");
    setIsModalOpen(false);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (category: string) => {
    if (window.confirm(`Are you sure you want to delete the category "${category}"? This will not delete products, but they will have no category.`)) {
      products.filter(p => p.category === category).forEach(p => {
        onUpdateProduct({ ...p, category: 'Uncategorized' });
      });
    }
  };

  const getProductCount = (category: string) => {
    return products.filter(p => p.category === category).length;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 p-4 lg:p-8 overflow-hidden transition-colors">
      <div className="flex flex-col gap-6 mb-8 shrink-0">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
               <button onClick={onGoBack} className="p-3 -ml-3 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all active:scale-90">
                   <ChevronLeft size={28} className="rtl:rotate-180" />
               </button>
               <div>
                   <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">{t('categoryList')}</h2>
                   <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] opacity-60 mt-1">Inventory Organization</p>
               </div>
           </div>
        </div>

        <div className="relative flex-1 group max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder={t('searchCategories')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-14 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.8rem] outline-none shadow-sm font-bold dark:text-white" />
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
              {filteredCategories.map(category => (
                  <div key={category} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                          <div className="p-4 bg-brand-50 dark:bg-brand-900/20 text-brand-600 rounded-2xl">
                              <Tag size={24} />
                          </div>
                          <button onClick={() => handleDeleteCategory(category)} className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100">
                              <Trash2 size={16}/>
                          </button>
                      </div>

                      <div className="flex-1">
                          <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none mb-2">{category}</h4>
                          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                              <Package size={14} className="text-brand-500" />
                              <span className="text-xs font-bold uppercase tracking-widest">{getProductCount(category)} {t('products')}</span>
                          </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                          <button 
                            onClick={() => alert(`Viewing products in ${category}`)}
                            className="text-[9px] font-black text-brand-600 uppercase tracking-widest hover:text-brand-500 transition-all"
                          >
                              View Products
                          </button>
                      </div>
                  </div>
              ))}
              {filteredCategories.length === 0 && (
                  <div className="col-span-full py-32 flex flex-col items-center justify-center opacity-20 text-slate-400 space-y-4">
                      <LayoutGrid size={80} strokeWidth={1} />
                      <p className="font-black text-[10px] uppercase tracking-[0.4em]">No Categories Found</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};
