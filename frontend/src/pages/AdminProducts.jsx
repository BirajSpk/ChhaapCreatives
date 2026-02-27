import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit, Trash2, Search, Loader2, Image as ImageIcon, Save, X, Settings } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminProducts = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        basePrice: 0,
        type: 'product',
        categoryId: '',
        images: '[]',
        pricingConfig: '{}',
        isActive: true
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                api.get('/products?type='), /* Get all without type filter for admin */
                api.get('/categories')
            ]);
            /* We'll fetch all by calling the base endpoint without strict type to see all in inventory */
            /* Since backend getAll strictly defaults to product if not provided, I might need a special admin route or just fetch both */
            const allItems = await api.get('/products', { params: { type: '' } });
            if (allItems.data.success) setItems(allItems.data.data.products);
            if (catRes.data.success) setCategories(catRes.data.data);
        } catch (e) {
            toast.error('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (item = null) => {
        if (item) {
            setCurrentItem(item);
            setFormData({
                ...item,
                images: typeof item.images === 'string' ? item.images : JSON.stringify(item.images),
                pricingConfig: typeof item.pricingConfig === 'string' ? item.pricingConfig : JSON.stringify(item.pricingConfig || {}),
                categoryId: item.categoryId || ''
            });
        } else {
            setCurrentItem(null);
            setFormData({
                name: '',
                slug: '',
                description: '',
                basePrice: 0,
                type: 'product',
                categoryId: categories[0]?.id || '',
                images: '[]',
                pricingConfig: '{}',
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                images: JSON.parse(formData.images),
                pricingConfig: JSON.parse(formData.pricingConfig)
            };

            if (currentItem) {
                await api.patch(`/admin/products/${currentItem.id}`, data);
                toast.success('Item updated successfully');
            } else {
                await api.post('/admin/products', data);
                toast.success('New item created');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Save failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Archive this item? It will no longer be visible to customers.')) {
            try {
                await api.delete(`/admin/products/${id}`);
                toast.success('Item archived');
                fetchData();
            } catch (e) {
                toast.error('Delete failed');
            }
        }
    };

    const filtered = items.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'all' || p.type === typeFilter;
        return matchesSearch && matchesType;
    });

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="heading-md dark:text-white m-0 uppercase tracking-widest text-sm font-black">Inventory Control</h1>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{filtered.length} Items Matching Filters</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                        <button onClick={() => setTypeFilter('all')} className={`px-4 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${typeFilter === 'all' ? 'bg-white dark:bg-brand-600 text-brand-600 dark:text-white shadow-soft' : 'text-gray-400 hover:text-gray-600'}`}>All</button>
                        <button onClick={() => setTypeFilter('product')} className={`px-4 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${typeFilter === 'product' ? 'bg-white dark:bg-brand-600 text-brand-600 dark:text-white shadow-soft' : 'text-gray-400 hover:text-gray-600'}`}>Products</button>
                        <button onClick={() => setTypeFilter('service')} className={`px-4 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${typeFilter === 'service' ? 'bg-white dark:bg-brand-600 text-brand-600 dark:text-white shadow-soft' : 'text-gray-400 hover:text-gray-600'}`}>Services</button>
                    </div>
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Filter inventory..."
                            className="input-field pl-12 py-3 text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button onClick={() => handleOpenModal()} className="btn-primary py-3 px-6 rounded-xl flex items-center gap-2 text-sm">
                        <Plus size={18} /> New Item
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filtered.map(p => (
                        <div key={p.id} className={`glass-card group overflow-hidden flex flex-col ${!p.isActive ? 'opacity-50 grayscale' : ''}`}>
                            <div className="h-48 bg-gray-50 dark:bg-white/5 relative">
                                <img src={(typeof p.images === 'string' ? JSON.parse(p.images) : p.images)?.[0]?.url || 'https://via.placeholder.com/300'} className="h-full w-full object-cover" />
                                <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                                    <button onClick={() => handleOpenModal(p)} className="h-9 w-9 rounded-xl bg-white shadow-xl flex items-center justify-center text-gray-600 hover:text-brand-600"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(p.id)} className="h-9 w-9 rounded-xl bg-white shadow-xl flex items-center justify-center text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
                                </div>
                                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-2">
                                    <span className="text-[10px] text-white font-bold uppercase tracking-widest">Rs. {p.basePrice}</span>
                                    {p.type === 'service' && <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-brand-600 font-black uppercase tracking-[0.2em]">{p.category?.name || 'General'}</span>
                                    <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded ${p.type === 'service' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>{p.type}</span>
                                </div>
                                <h4 className="font-bold dark:text-white line-clamp-1 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{p.name}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Premium Responsive Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />

                    <div className="bg-white dark:bg-[#121212] w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-10 border border-white/10 animate-scale-in">
                        {/* Modal Header */}
                        <div className="p-6 lg:p-8 flex justify-between items-center border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-xl font-display font-black dark:text-white uppercase tracking-tighter">
                                    {currentItem ? 'Modify' : 'Catalog'} <span className="text-brand-600">Entry</span>
                                </h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">System Identity: {currentItem?.id || 'New Sequence'}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
                            <form id="inventory-form" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-1">Display Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Ultra Glossy Sticker"
                                        className="input-field py-3"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-1">URL Reference (Slug)</label>
                                    <input
                                        type="text"
                                        placeholder="auto-generated"
                                        className="input-field py-3 text-brand-600 font-mono text-xs"
                                        value={formData.slug}
                                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                    />
                                </div>

                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-1">Detailed Description</label>
                                    <textarea
                                        className="input-field h-32 py-3 resize-none"
                                        placeholder="Describe the product specifications, material, and usage..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-1">Business Classification</label>
                                    <select
                                        className="input-field py-3"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="product">Retail Product (Direct Sale)</option>
                                        <option value="service">Custom Service (Made-to-order)</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-1">Market Segment (Category)</label>
                                    <select
                                        className="input-field py-3"
                                        value={formData.categoryId}
                                        onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                    >
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-1">Standard Valuation (Rs.)</label>
                                    <input
                                        type="number"
                                        required
                                        className="input-field py-3 font-bold"
                                        value={formData.basePrice}
                                        onChange={e => setFormData({ ...formData, basePrice: e.target.value })}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-1">Status</label>
                                    <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isActive: true })}
                                            className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${formData.isActive ? 'bg-white dark:bg-green-600 text-green-600 dark:text-white shadow-sm' : 'text-gray-400'}`}
                                        >
                                            Active
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isActive: false })}
                                            className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${!formData.isActive ? 'bg-white dark:bg-red-600 text-red-600 dark:text-white shadow-sm' : 'text-gray-400'}`}
                                        >
                                            Archived
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-1 flex justify-between">
                                        Assets Matrix (JSON)
                                        <span className="text-[8px] opacity-60">format: [&#123;"url": "...", "altText": "..."&#125;]</span>
                                    </label>
                                    <textarea
                                        className="input-field h-24 py-3 font-mono text-[10px] scrollbar-none"
                                        value={formData.images}
                                        onChange={e => setFormData({ ...formData, images: e.target.value })}
                                        placeholder='[{"url": "...", "altText": "..."}]'
                                    />
                                </div>

                                <div className="flex flex-col gap-2 md:col-span-2 pb-4">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-1 flex justify-between">
                                        Dynamics Configuration (JSON)
                                        <span className="text-[8px] opacity-60">Advanced Logic Override</span>
                                    </label>
                                    <textarea
                                        className="input-field h-24 py-3 font-mono text-[10px] scrollbar-none"
                                        value={formData.pricingConfig}
                                        onChange={e => setFormData({ ...formData, pricingConfig: e.target.value })}
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 lg:p-8 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex flex-wrap-reverse justify-end gap-4 mt-auto">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="w-full sm:w-auto px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Discard
                            </button>
                            <button
                                form="inventory-form"
                                type="submit"
                                className="w-full sm:w-auto btn-primary px-10 py-4 flex items-center justify-center gap-3"
                            >
                                <Save size={18} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Synchronize Data</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
