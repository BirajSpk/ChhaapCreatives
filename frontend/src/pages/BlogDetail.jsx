import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Loader2, Tag, Share2 } from 'lucide-react';
import api from '../services/api';

const BlogDetail = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await api.get(`/blogs/${slug}`);
                if (res.data.success) setBlog(res.data.data);
            } catch (error) {
                console.error('Failed to fetch blog post');
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug]);

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="animate-spin text-brand-600" size={32} />
        </div>
    );

    if (!blog) return (
        <div className="section-container page-section text-center">
            <h2 className="heading-md dark:text-white">Blog post not found</h2>
            <Link to="/blogs" className="btn-primary mt-6">Back to Blogs</Link>
        </div>
    );

    return (
        <div className="section-container page-section animate-fade-in">
            <Link to="/blogs" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-600 transition-all mb-10">
                <ArrowLeft size={16} /> All Articles
            </Link>

            <article className="max-w-4xl mx-auto flex flex-col gap-10">
                {/* Header */}
                <header className="flex flex-col gap-6">
                    <div className="flex items-center gap-4 text-[10px] text-brand-600 font-bold uppercase tracking-widest bg-brand-600/10 w-fit px-4 py-1.5 rounded-full">
                        <Tag size={12} /> Design & Print
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-black dark:text-white leading-[1.2]">
                        {blog.title}
                    </h1>
                    <div className="flex items-center gap-6 text-xs text-gray-400 font-bold uppercase tracking-widest border-b border-gray-100 dark:border-white/5 pb-8">
                        <span className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-[10px]">C</div>
                            Chhaap Admin
                        </span>
                        <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                        <button className="flex items-center gap-2 ml-auto hover:text-brand-600 transition-colors"><Share2 size={14} /> Share</button>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="rounded-glass-lg overflow-hidden h-[400px] bg-gray-100 dark:bg-white/5">
                    <img src={blog.image || 'https://via.placeholder.com/1200x800'} className="h-full w-full object-cover" alt={blog.title} />
                </div>

                {/* Content */}
                <div className="glass-card p-10 md:p-16 leading-[1.8] text-gray-700 dark:text-gray-300 flex flex-col gap-8 whitespace-pre-wrap">
                    {blog.content}
                </div>

                {/* Footer */}
                <footer className="border-t border-gray-100 dark:border-white/5 pt-12 text-center flex flex-col items-center gap-6">
                    <h4 className="font-bold dark:text-white uppercase tracking-widest text-xs">Thanks for reading</h4>
                    <p className="text-sm text-gray-500 italic max-w-md mx-auto">
                        Informed decisions lead to better branding. Explore our products to see how we apply these insights.
                    </p>
                    <Link to="/products" className="btn-primary px-10">Explore Services</Link>
                </footer>
            </article>
        </div>
    );
};

export default BlogDetail;
