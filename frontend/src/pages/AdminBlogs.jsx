import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2, Search, Loader2, Eye, Calendar, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PortalModal } from '../components/Modal/PortalModal';

const AdminBlogs = () => {
    const { user } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        featuredImage: '',
        metaTitle: '',
        metaDescription: '',
        isPublished: false,
    });

    /* Fetch blogs on mount */
    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/blogs');
            if (response.data.success) {
                setBlogs(response.data.data.blogs || []);
            }
        } catch (error) {
            toast.error('Failed to fetch blogs');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (blog = null) => {
        setEditingBlog(blog);
        if (blog) {
            setFormData({
                title: blog.title,
                content: blog.content,
                featuredImage: blog.featuredImage || '',
                metaTitle: blog.metaTitle,
                metaDescription: blog.metaDescription,
                isPublished: blog.isPublished,
            });
        } else {
            setFormData({
                title: '',
                content: '',
                featuredImage: '',
                metaTitle: '',
                metaDescription: '',
                isPublished: false,
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            if (!formData.title.trim() || !formData.content.trim()) {
                toast.error('Title and content are required');
                setIsSaving(false);
                return;
            }

            if (editingBlog) {
                /* Update blog */
                const response = await api.patch(`/admin/blogs/${editingBlog.id}`, formData);
                if (response.data.success) {
                    setBlogs(blogs.map(b => b.id === editingBlog.id ? response.data.data : b));
                    toast.success('Blog updated successfully');
                }
            } else {
                /* Create blog */
                const response = await api.post('/admin/blogs', formData);
                if (response.data.success) {
                    setBlogs([response.data.data, ...blogs]);
                    toast.success('Blog created successfully');
                }
            }
            setIsModalOpen(false);
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to save blog';
            toast.error(message);
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;

        try {
            const response = await api.delete(`/admin/blogs/${id}`);
            if (response.data.success) {
                setBlogs(blogs.filter(b => b.id !== id));
                toast.success('Blog deleted successfully');
            }
        } catch (error) {
            toast.error('Failed to delete blog');
            console.error(error);
        }
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="heading-md dark:text-white m-0 uppercase tracking-widest text-sm font-black text-brand-600">Content Studio</h1>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Editorial Workflow Manager</span>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="w-full md:w-auto btn-primary py-4 px-8 rounded-2xl flex items-center justify-center gap-3 text-sm shadow-xl shadow-brand-600/20 hover:shadow-2xl transition-all"
                >
                    <Plus size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Draft New Article</span>
                </button>
            </div>

            <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Filter articles by title or keyword..."
                    className="input-field pl-12 py-4 text-sm w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" size={32} /></div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active Workstream */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {filteredBlogs.length > 0 ? (
                            filteredBlogs.map(blog => (
                                <div key={blog.id} className="glass-card group p-6 flex flex-col gap-4 border-white/40 hover:border-brand-300 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-1 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`h-2 w-2 rounded-full ${blog.isPublished ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{blog.isPublished ? 'Published' : 'Draft'}</span>
                                            </div>
                                            <h3 className="font-bold text-lg dark:text-white group-hover:text-brand-600 transition-colors">{blog.title}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-2">{blog.content.substring(0, 100)}...</p>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button onClick={() => handleOpenModal(blog)} className="h-9 w-9 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-brand-600 transition-all"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(blog.id)} className="h-9 w-9 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-100 dark:border-white/5">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <Calendar size={12} />
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <Eye size={12} />
                                            Views
                                        </div>
                                        {blog.author && (
                                            <div className="px-2 py-0.5 rounded bg-brand-600/10 text-brand-600 text-[10px] font-black uppercase tracking-widest">
                                                By {blog.author.name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 glass-card p-12 text-center text-gray-500">
                                <FileText size={40} className="mx-auto mb-4 opacity-20" />
                                <p className="text-sm font-medium">No blogs found. Create your first article to get started!</p>
                            </div>
                        )}
                    </div>

                    {/* Editor Insights */}
                    <div className="flex flex-col gap-8">
                        <div className="glass-card p-8 flex flex-col gap-6 bg-brand-600 text-white border-none shadow-2xl shadow-brand-600/30">
                            <div className="flex items-center gap-3">
                                <Sparkles size={24} />
                                <h3 className="font-display font-black uppercase tracking-tighter text-xl leading-none">AI Writing <span className="block text-[10px] tracking-widest font-sans opacity-60">Assistant</span></h3>
                            </div>
                            <p className="text-sm opacity-80 leading-relaxed italic">"Ready to help you create engaging content. Start drafting your article!"</p>
                            <button disabled className="bg-white text-brand-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-colors opacity-60">Coming Soon</button>
                        </div>

                        <div className="glass-card p-8 flex flex-col gap-6">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Blog Statistics</h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="dark:text-gray-300">Total Blogs</span>
                                    <span className="font-bold dark:text-white">{blogs.length}</span>
                                </div>
                                <div className="h-1 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-600 w-3/4"></div>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="dark:text-gray-300">Published</span>
                                    <span className="font-bold dark:text-white">{blogs.filter(b => b.isPublished).length}</span>
                                </div>
                                <div className="h-1 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500" style={{ width: blogs.length > 0 ? `${(blogs.filter(b => b.isPublished).length / blogs.length) * 100}%` : '0%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Blog Editor Modal - using Portal for proper z-index stacking */}
            <PortalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingBlog ? 'Edit' : 'Create'}
                subtitle="Content Management"
                size="max-w-2xl"
            >
                <form onSubmit={handleSave} className="flex flex-col gap-6">
                                {/* Title */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-1">Article Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field py-3 text-lg font-bold"
                                        placeholder="e.g. Revolutionizing Branding with NFC..."
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        maxLength={300}
                                    />
                                    <div className="text-[10px] text-gray-400">{formData.title.length}/300</div>
                                </div>

                                {/* Content */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-1">Article Content</label>
                                    <textarea
                                        required
                                        className="input-field h-40 py-3 resize-none text-sm"
                                        placeholder="Write your article content here..."
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                        maxLength={100000}
                                    />
                                    <div className="text-[10px] text-gray-400">{formData.content.length}/100,000</div>
                                </div>

                                {/* Featured Image */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-1">Featured Image URL (Optional)</label>
                                    <input
                                        type="url"
                                        className="input-field py-3 text-sm"
                                        placeholder="https://example.com/image.jpg"
                                        value={formData.featuredImage}
                                        onChange={e => setFormData({ ...formData, featuredImage: e.target.value })}
                                    />
                                </div>

                                {/* Meta Title */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-1">SEO Meta Title (Optional)</label>
                                    <input
                                        type="text"
                                        className="input-field py-3 text-sm"
                                        placeholder="For search engine optimization..."
                                        value={formData.metaTitle}
                                        onChange={e => setFormData({ ...formData, metaTitle: e.target.value })}
                                        maxLength={200}
                                    />
                                    <div className="text-[10px] text-gray-400">{formData.metaTitle.length}/200</div>
                                </div>

                                {/* Meta Description */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-1">SEO Meta Description (Optional)</label>
                                    <textarea
                                        className="input-field h-20 py-3 resize-none text-sm"
                                        placeholder="Brief description for search results..."
                                        value={formData.metaDescription}
                                        onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                                        maxLength={500}
                                    />
                                    <div className="text-[10px] text-gray-400">{formData.metaDescription.length}/500</div>
                                </div>

                                {/* Publish Status */}
                                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                                    <input
                                        id="isPublished"
                                        type="checkbox"
                                        className="w-5 h-5 rounded accent-brand-600 cursor-pointer"
                                        checked={formData.isPublished}
                                        onChange={e => setFormData({ ...formData, isPublished: e.target.checked })}
                                    />
                                    <label htmlFor="isPublished" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none flex-1">
                                        Publish this article immediately
                                    </label>
                                </div>

                            {/* Form Actions */}
                            <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 py-3 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="animate-spin" size={16} />
                                            Saving...
                                        </>
                                    ) : (
                                        editingBlog ? 'Update Article' : 'Create Article'
                                    )}
                                </button>
                            </div>
                        </form>
            </PortalModal>
        </div>
    );
};

export default AdminBlogs;
