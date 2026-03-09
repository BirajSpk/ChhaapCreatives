import React, { useState, useEffect } from 'react';
import { MousePointer2, Plus, Edit, Trash2, Search, Loader2, Save, X, Settings, Sliders, Layout } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminServices = () => {
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
        type: 'service',
        categoryId: '',
        images: '[]',
        isActive: true
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [servRes, catRes] = await Promise.all([
                api.get('/services'), /* Strict services for this page */
                api.get('/categories')
            ]);
            if (servRes.data.success) setItems(servRes.data.data.services);
            if (catRes.data.success) setCategories(catRes.data.data);
        } catch (e) {
            toast.error('Failed to load services');
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
                categoryId: item.categoryId || ''
            });
        } else {
            setCurrentItem(null);
            setFormData({
                name: '',
                slug: '',
                description: '',
                basePrice: 0,
                type: 'service',
                categoryId: categories[0]?.id || '',
                images: '[]',
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
                images: JSON.parse(formData.images)
            };

            if (currentItem) {
                await api.patch(`/admin/products/${currentItem.id}`, data);
                toast.success('Service updated successfully');
            } else {
                await api.post('/admin/products', data);
                toast.success('New service created');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Save failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this service? This will remove the custom flow for customers.')) {
            try {
                await api.delete(`/admin/products/${id}`);
                toast.success('Service removed');
                fetchData();
            } catch (e) {
                toast.error('Delete failed');
            }
        }
    };

    const filtered = items.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="heading-md dark:text-white m-0 uppercase tracking-widest text-sm font-black">Custom Services</h1>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{filtered.length} Active Services</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search services..."
                            className="input-field pl-12 py-3 text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button onClick={() => handleOpenModal()} className="btn-primary py-3 px-6 rounded-xl flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700">
                        <Plus size={18} /> Add Custom Service
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map(s => (
                        <div key={s.id} className="glass-card group flex flex-col p-6 hover:shadow-glass-lg transition-all border-white/20">
                            <div className="flex justify-between items-start mb-6">
                                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                                    <MousePointer2 size={24} />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleOpenModal(s)} className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-blue-600 transition-all"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(s.id)} className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 mb-4">
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{s.category?.name}</span>
                                <h3 className="font-bold dark:text-white uppercase">{s.name}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{s.description}</p>
                            </div>

                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 uppercase">Base Price</span>
                                    <span className="font-bold dark:text-white">Rs. {s.basePrice}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`h-2 w-2 rounded-full ${s.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{s.isActive ? 'Active' : 'Disabled'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Service Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[-1]" 
                        onClick={() => setIsModalOpen(false)} 
                    />
                    
                    {/* Modal Container */}
                    <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden relative border border-white/10 animate-scale-in flex flex-col">
                        <div className="p-8 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-blue-500/5">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-xl font-bold dark:text-white uppercase tracking-tighter">
                                    Service <span className="text-blue-600">Definition</span>
                                </h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Type: Custom Configurable</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-400">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 flex flex-col gap-6 max-h-[70vh] overflow-y-auto">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Service Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field py-3"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Slug (Identifier)</label>
                                <input
                                    type="text"
                                    className="input-field py-3 text-blue-600 font-mono text-xs"
                                    placeholder="e.g. custom-stickers"
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</label>
                                <textarea
                                    className="input-field py-3 h-24 resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</label>
                                    <select
                                        className="input-field py-3"
                                        value={formData.categoryId}
                                        onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                    >
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Base Price (Rs.)</label>
                                    <input
                                        type="number"
                                        required
                                        className="input-field py-3"
                                        value={formData.basePrice}
                                        onChange={e => setFormData({ ...formData, basePrice: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</label>
                                <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-2xl">
                                    <button type="button" onClick={() => setFormData({ ...formData, isActive: true })} className={`flex-1 py-3 text-[10px] font-bold uppercase rounded-xl transition-all ${formData.isActive ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm' : 'text-gray-400'}`}>Enabled</button>
                                    <button type="button" onClick={() => setFormData({ ...formData, isActive: false })} className={`flex-1 py-3 text-[10px] font-bold uppercase rounded-xl transition-all ${!formData.isActive ? 'bg-white dark:bg-red-600 text-red-600 dark:text-white shadow-sm' : 'text-gray-400'}`}>Disabled</button>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Cancel</button>
                                <button type="submit" className="flex-[2] btn-primary py-4 rounded-2xl flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700">
                                    <Save size={18} /> Apply Configuration
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminServices;
