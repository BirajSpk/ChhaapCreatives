import React, { useState } from 'react';
import { FileText, Plus, Edit, Trash2, Search, Loader2, Eye, Calendar, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminBlogs = () => {
    const [loading, setLoading] = useState(false);

    const mockBlogs = [
        { id: 1, title: 'Revolutionizing Branding with NFC Technology', author: 'Saurav', category: 'Technology', status: 'published', createdAt: '2024-02-20' },
        { id: 2, title: 'Why High-Quality Printing Still Matters in 2024', author: 'Admin', category: 'Design', status: 'draft', createdAt: '2024-02-18' },
    ];

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="heading-md dark:text-white m-0 uppercase tracking-widest text-sm font-black text-brand-600">Content Studio</h1>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Editorial Workflow Manager</span>
                </div>
                <button className="w-full md:w-auto btn-primary py-4 px-8 rounded-2xl flex items-center justify-center gap-3 text-sm shadow-xl shadow-brand-600/20">
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
                />
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" /></div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active Workstream */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {mockBlogs.map(blog => (
                            <div key={blog.id} className="glass-card group p-6 flex flex-col gap-4 border-white/40 hover:border-brand-300 transition-all cursor-pointer">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`h-2 w-2 rounded-full ${blog.status === 'published' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{blog.status}</span>
                                        </div>
                                        <h3 className="font-bold text-lg dark:text-white group-hover:text-brand-600 transition-colors">{blog.title}</h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="h-9 w-9 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-brand-600 transition-all"><Edit size={16} /></button>
                                        <button className="h-9 w-9 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-100 dark:border-white/5">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <Calendar size={12} />
                                        {blog.createdAt}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <Eye size={12} />
                                        124 Views
                                    </div>
                                    <div className="px-2 py-0.5 rounded bg-brand-600/10 text-brand-600 text-[10px] font-black uppercase tracking-widest">
                                        {blog.category}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Editor Insights */}
                    <div className="flex flex-col gap-8">
                        <div className="glass-card p-8 flex flex-col gap-6 bg-brand-600 text-white border-none shadow-2xl shadow-brand-600/30">
                            <div className="flex items-center gap-3">
                                <Sparkles size={24} />
                                <h3 className="font-display font-black uppercase tracking-tighter text-xl leading-none">AI Writing <span className="block text-[10px] tracking-widest font-sans opacity-60">Assistant</span></h3>
                            </div>
                            <p className="text-sm opacity-80 leading-relaxed italic">"The draft for 'Design Trends' is 80% complete. Would you like me to optimize it for SEO?"</p>
                            <button className="bg-white text-brand-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-colors">Start Optimizer</button>
                        </div>

                        <div className="glass-card p-8 flex flex-col gap-6">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Content Performance</h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="dark:text-gray-300">Avg. Read Time</span>
                                    <span className="font-bold dark:text-white">4.2 min</span>
                                </div>
                                <div className="h-1 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-600 w-3/4"></div>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="dark:text-gray-300">Bounce Rate</span>
                                    <span className="font-bold dark:text-white">12%</span>
                                </div>
                                <div className="h-1 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-1/4"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBlogs;
