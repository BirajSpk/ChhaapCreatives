import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Loader2, Hash, List, Globe, Shield } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { PortalModal } from '../components/Modal/PortalModal';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [currentCategory, setCurrentCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        icon: '',
        sortOrder: 0,
        isActive: true
    });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await api.get('/categories');
            if (res.data.success) setCategories(res.data.data);
        } catch (e) {
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenModal = (cat = null) => {
        if (cat) {
            setCurrentCategory(cat);
            setFormData(cat);
        } else {
            setCurrentCategory(null);
            setFormData({
                name: '',
                slug: '',
                description: '',
                icon: '',
                sortOrder: categories.length,
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (currentCategory) {
                await api.patch(`/admin/categories/${currentCategory.id}`, formData);
                toast.success('Taxonomy updated: Category modified');
            } else {
                await api.post('/admin/categories', formData);
                toast.success('Taxonomy updated: New category deployed');
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Transaction failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('CRITICAL: Purging this category may orphan associated products. Continue?')) {
            try {
                await api.delete(`/admin/categories/${id}`);
                toast.success('Category purged from registry');
                fetchCategories();
            } catch (e) {
                toast.error('Operation Aborted: Deletion failed');
            }
        }
    };

    const filtered = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="heading-md dark:text-white m-0 uppercase tracking-widest text-sm font-black text-brand-600">Category Taxonomy</h1>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Global Navigation Logic</span>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="input-field pl-12 py-3 text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="btn-primary py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 text-sm shadow-xl shadow-brand-600/20"
                    >
                        <Plus size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">New classification</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" /></div>
            ) : (
                <div className="glass-card overflow-hidden border-white/40">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[700px]">
                            <thead className="bg-gray-50 dark:bg-white/5 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] border-b border-gray-100 dark:border-white/5">
                                <tr>
                                    <th className="px-8 py-5">Sequence</th>
                                    <th className="px-8 py-5">Identity</th>
                                    <th className="px-8 py-5">Intellect</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                                {categories.map(cat => (
                                    <tr key={cat.id} className="text-sm hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-6">
                                            <span className="h-9 w-9 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center font-display font-black text-gray-400 group-hover:bg-brand-600 group-hover:text-white transition-all shadow-soft">
                                                {cat.sortOrder}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold dark:text-white uppercase tracking-tight text-base">{cat.name}</span>
                                                <span className="text-[10px] text-brand-600 font-mono font-bold">slug: /{cat.slug}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs text-gray-500 max-w-xs line-clamp-2 leading-relaxed italic">
                                                "{cat.description || 'No descriptive metadata assigned.'}"
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {cat.isActive ? 'Active' : 'Offline'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button onClick={() => handleOpenModal(cat)} className="h-10 w-10 rounded-xl bg-white dark:bg-white/10 shadow-soft border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-400 hover:text-brand-600 transition-all group-hover:shadow-md"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete(cat.id)} className="h-10 w-10 rounded-xl bg-white dark:bg-white/10 shadow-soft border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all group-hover:shadow-md"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Premium Categories Modal - using Portal */}
            <PortalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentCategory ? 'Modify' : 'Initialize'}
                subtitle="Classification Management"
                size="max-w-lg"
            >
                <form id="category-form" onSubmit={handleSave} className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-1">Namespace</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field py-3 text-lg font-bold"
                                        placeholder="e.g. Stickers & Decals"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-1">URL Identifier (Slug)</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                        <input
                                            type="text"
                                            className="input-field pl-11 py-3 text-brand-600 font-mono text-sm"
                                            placeholder="auto-generated"
                                            value={formData.slug}
                                            onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-1">Functional Description</label>
                                    <textarea
                                        className="input-field h-32 py-3 resize-none text-sm"
                                        placeholder="Explain the purpose of this category..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-1">Stream Priority</label>
                                        <div className="relative">
                                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                            <input
                                                type="number"
                                                className="input-field pl-11 py-3 font-bold"
                                                value={formData.sortOrder}
                                                onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-1">Registry Status</label>
                                        <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl h-full">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, isActive: true })}
                                                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${formData.isActive ? 'bg-white dark:bg-green-600 text-green-600 dark:text-white shadow-sm' : 'text-gray-400'}`}
                                            >
                                                Active
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, isActive: false })}
                                                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${!formData.isActive ? 'bg-white dark:bg-red-600 text-red-600 dark:text-white shadow-sm' : 'text-gray-400'}`}
                                            >
                                                Hidden
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>

                        {/* Form Actions */}
                        <div className="p-8 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex flex-wrap-reverse gap-4 justify-end">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="w-full sm:w-auto px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-gray-700 transition-colors"
                            >
                                Discard
                            </button>
                            <button
                                form="category-form"
                                type="submit"
                                className="w-full sm:w-auto btn-primary px-10 py-4 flex items-center justify-center gap-3 shadow-lg shadow-brand-600/20"
                            >
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Commit Sequence</span>
                            </button>
                        </div>
            </PortalModal>
        </div>
    );
};

export default AdminCategories;
