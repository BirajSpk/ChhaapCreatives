import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await api.get('/blogs');
                if (res.data.success) setBlogs(res.data.data);
            } catch (error) {
                console.error('Failed to fetch blogs');
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <div className="section-container page-section animate-fade-in">
            <div className="flex flex-col gap-4 mb-16 text-center">
                <h1 className="heading-lg dark:text-white">Our Creative Blog</h1>
                <p className="text-gray-500 italic">Insights into printing, design, and branding excellence.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-brand-600" size={32} />
                </div>
            ) : blogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {blogs.map((blog) => (
                        <Link to={`/blogs/${blog.slug}`} key={blog.id} className="glass-card group overflow-hidden flex flex-col">
                            <div className="h-56 overflow-hidden bg-gray-100 dark:bg-white/5">
                                <img
                                    src={blog.image || 'https://via.placeholder.com/600x400'}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt={blog.title}
                                />
                            </div>
                            <div className="p-8 flex flex-col gap-4">
                                <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><User size={12} /> Admin</span>
                                </div>
                                <h3 className="heading-sm dark:text-white group-hover:text-brand-600 transition-colors line-clamp-2">
                                    {blog.title}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                                    {blog.metaDescription}
                                </p>
                                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-widest">
                                    Read Article <ArrowRight size={14} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="glass-card p-20 text-center flex flex-col items-center gap-4">
                    <h3 className="font-bold dark:text-white">No blog posts yet</h3>
                    <p className="text-gray-500">We are currently crafting some amazing stories. Stay tuned!</p>
                </div>
            )}
        </div>
    );
};

export default BlogList;
