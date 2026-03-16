
import React, { useState, useMemo } from 'react';
import { Product, Language, Category } from '../types';
import { Plus, Search, ChevronLeft, Trash2, Edit2, LayoutGrid, Tag, Package, X, CheckCircle, Palette } from 'lucide-react';

interface CategoriesProps {
  products: Product[];
  categories: Category[];
  onAddCategory: (c: Omit<Category, 'id'>) => void;
  onUpdateCategory: (c: Category) => void;
  onDeleteCategory: (id: string) => void;
  onUpdateProduct: (p: Product) => void;
  onGoBack: () => void;
  language: Language;
  t: (key: string) => string;
}

export const Categories: React.FC<CategoriesProps> = ({ 
  products, categories, onAddCategory, onUpdateCategory, onDeleteCategory, onUpdateProduct, onGoBack, language, t 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    icon: 'Tag'
  });

  const filteredCategories = useMemo(() => {
    return categories.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCategory) {
      onUpdateCategory({ ...editingCategory, ...formData });
    } else {
      onAddCategory(formData);
    }

    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', color: '#3b82f6', icon: 'Tag' });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color || '#3b82f6',
      icon: category.icon || 'Tag'
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the category "${name}"?`)) {
      onDeleteCategory(id);
    }
  };

  const getProductCount = (categoryName: string) => {
    return products.filter(p => p.category === categoryName).length;
  };

  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1'
  ];

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
           <button 
             onClick={() => {
               setEditingCategory(null);
               setFormData({ name: '', description: '', color: '#3b82f6', icon: 'Tag' });
               setIsModalOpen(true);
             }}
             className="flex items-center gap-3 px-6 py-4 bg-brand-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-700 transition-all shadow-xl shadow-brand-600/20 active:scale-95"
           >
             <Plus size={18} />
             <span>{t('addCategory')}</span>
           </button>
        </div>

        <div className="relative flex-1 group max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder={t('searchCategories')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-14 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.8rem] outline-none shadow-sm font-bold dark:text-white" />
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
              {filteredCategories.map(category => (
                  <div key={category.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                          <div className="p-4 rounded-2xl" style={{ backgroundColor: `${category.color}20`, color: category.color }}>
                              <Tag size={24} />
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                              <button onClick={() => handleEdit(category)} className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-brand-600 transition-all">
                                  <Edit2 size={16}/>
                              </button>
                              <button onClick={() => handleDelete(category.id, category.name)} className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-rose-600 transition-all">
                                  <Trash2 size={16}/>
                              </button>
                          </div>
                      </div>

                      <div className="flex-1">
                          <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none mb-2">{category.name}</h4>
                          <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 line-clamp-2">{category.description || 'No description'}</p>
                          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                              <Package size={14} className="text-brand-500" />
                              <span className="text-xs font-bold uppercase tracking-widest">{getProductCount(category.name)} {t('products')}</span>
                          </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                          <div className="w-full h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div className="h-full bg-brand-500" style={{ width: `${Math.min(100, (getProductCount(category.name) / 20) * 100)}%` }}></div>
                          </div>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 ring-brand-500 font-bold dark:text-white"
                  placeholder="e.g. Electronics"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 ring-brand-500 font-bold dark:text-white h-24 resize-none"
                  placeholder="Category details..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Palette size={12} /> Theme Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full transition-all ${formData.color === color ? 'ring-4 ring-brand-500/30 scale-110' : 'hover:scale-110'}`}
                      style={{ backgroundColor: color }}
                    >
                      {formData.color === color && <CheckCircle size={14} className="text-white mx-auto" />}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-brand-600 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-brand-700 transition-all shadow-xl shadow-brand-600/20 active:scale-95 mt-4"
              >
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
