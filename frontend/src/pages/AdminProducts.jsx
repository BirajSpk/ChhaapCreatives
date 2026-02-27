import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit, Trash2, Search, Loader2, Save, X, Settings, List, Check } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminProducts = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

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
        minOrderQuantity: 1,
        isActive: true,
        variants: []
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                api.get('/products'),
                api.get('/categories')
            ]);
            if (prodRes.data.success) setItems(prodRes.data.data.products);
            if (catRes.data.success) setCategories(catRes.data.data);
        } catch (e) {
            toast.error('Failed to load products');
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
                categoryId: item.categoryId || '',
                minOrderQuantity: item.minOrderQuantity || 1,
                variants: item.variants || []
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
                minOrderQuantity: 1,
                isActive: true,
                variants: []
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                images: JSON.parse(formData.images)
            };

            if (currentItem) {
                await api.patch(`/admin/products/${currentItem.id}`, data);
                toast.success('Product updated');
            } else {
                await api.post('/admin/products', data);
                toast.success('New product created');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Save failed');
        }
    };

    const handleAddVariant = () => {
        setFormData({
            ...formData,
            variants: [...formData.variants, { size: '', priceModifier: 0, isActive: true }]
        });
    };

    const handleRemoveVariant = (index) => {
        const newVariants = [...formData.variants];
        newVariants.splice(index, 1);
        setFormData({ ...formData, variants: newVariants });
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index][field] = value;
        setFormData({ ...formData, variants: newVariants });
    };

    const filtered = items.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) && p.type === 'product'
    );

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="heading-md dark:text-white m-0 uppercase tracking-widest text-sm font-black">Product Inventory</h1>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{filtered.length} Active SKUs</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Find product..."
                            className="input-field pl-12 py-3 text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button onClick={() => handleOpenModal()} className="btn-primary py-3 px-6 rounded-xl flex items-center gap-2 text-sm bg-purple-600 hover:bg-purple-700">
                        <Plus size={18} /> New Product
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filtered.map(p => (
                        <div key={p.id} className="glass-card group flex flex-col hover:shadow-glass-lg transition-all border-white/20">
                            <div className="h-48 relative overflow-hidden rounded-t-2xl">
                                <img
                                    src={(typeof p.images === 'string' ? JSON.parse(p.images) : p.images)?.[0]?.url || 'https://via.placeholder.com/300'}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform">
                                    <button onClick={() => handleOpenModal(p)} className="h-8 w-8 rounded-lg bg-white shadow-xl flex items-center justify-center text-gray-600 hover:text-purple-600"><Edit size={14} /></button>
                                </div>
                                <div className="absolute bottom-4 left-4 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                                    MOQ: {p.minOrderQuantity}
                                </div>
                            </div>
                            <div className="p-4 flex flex-col gap-1">
                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{p.category?.name}</span>
                                <h4 className="font-bold dark:text-white uppercase text-sm line-clamp-1">{p.name}</h4>
                                <span className="font-bold text-brand-600 text-xs mt-1">Rs. {p.basePrice}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-white/10 animate-scale-in">
                        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-purple-600/5">
                            <h2 className="text-lg font-bold dark:text-white uppercase tracking-tighter">Product <span className="text-purple-600">Configuration</span></h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 flex flex-col gap-6 max-h-[75vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold uppercase text-gray-400">Name</label>
                                    <input type="text" required className="input-field py-2.5" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold uppercase text-gray-400">Slug</label>
                                    <input type="text" className="input-field py-2.5 font-mono text-xs" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold uppercase text-gray-400">Description</label>
                                <textarea className="input-field py-2.5 h-20 resize-none text-xs" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold uppercase text-gray-400">Base Price (Rs.)</label>
                                    <input type="number" required className="input-field py-2.5" value={formData.basePrice} onChange={e => setFormData({ ...formData, basePrice: e.target.value })} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold uppercase text-gray-400">Min. Quantity (MOQ)</label>
                                    <input type="number" required className="input-field py-2.5" value={formData.minOrderQuantity} onChange={e => setFormData({ ...formData, minOrderQuantity: e.target.value })} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold uppercase text-gray-400">Category</label>
                                    <select className="input-field py-2.5" value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Variants Section */}
                            <div className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-purple-600">Available Sizes / Variants</h4>
                                    <button type="button" onClick={handleAddVariant} className="text-[10px] font-bold flex items-center gap-1 text-gray-500 hover:text-purple-600"><Plus size={12} /> Add Variant</button>
                                </div>

                                {formData.variants?.map((v, idx) => (
                                    <div key={idx} className="flex gap-3 items-end">
                                        <div className="flex-1">
                                            <input
                                                placeholder="Size (e.g. A4)"
                                                className="input-field py-2 text-xs"
                                                value={v.size}
                                                onChange={e => handleVariantChange(idx, 'size', e.target.value)}
                                            />
                                        </div>
                                        <div className="w-24">
                                            <input
                                                type="number"
                                                placeholder="+ Rs."
                                                className="input-field py-2 text-xs"
                                                value={v.priceModifier}
                                                onChange={e => handleVariantChange(idx, 'priceModifier', e.target.value)}
                                            />
                                        </div>
                                        <button type="button" onClick={() => handleRemoveVariant(idx)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                    </div>
                                ))}

                                {formData.variants.length === 0 && (
                                    <p className="text-[10px] text-gray-400 italic text-center py-2 underline cursor-pointer" onClick={handleAddVariant}>No variants defined. Click to add.</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold uppercase text-gray-400">Images JSON</label>
                                <textarea className="input-field py-2 font-mono text-[10px] h-16" value={formData.images} onChange={e => setFormData({ ...formData, images: e.target.value })} />
                            </div>

                            <div className="flex gap-4 mt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-[10px] font-bold uppercase text-gray-400">Discard</button>
                                <button type="submit" className="flex-[2] btn-primary py-3 rounded-xl bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2">
                                    <Save size={18} /> Commit Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
