import React, { useState, useEffect } from 'react';
import { ArrowRight, Printer, Palette, CreditCard, Sparkles, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-0 pb-20 lg:pt-8 lg:pb-32">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="flex flex-col gap-8 z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs font-bold uppercase tracking-widest border border-brand-200 dark:border-brand-800/50 w-fit">
                            <Sparkles size={14} />
                            <span>Premium Printing Services</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-gray-900 dark:text-white leading-[1.1]">
                            Elevate Your <span className="text-brand-600">Brand</span> with Precision
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
                            From premium NFC business cards to high-quality banners, we provide the best printing solutions tailored to your unique requirements.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/products" className="btn-primary group">
                                Browse Products
                                <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link to="/contact" className="btn-secondary">
                                Custom Design
                            </Link>
                        </div>
                    </div>

                    {/* Glass Mockup Illustration */}
                    <div className="relative">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-500/20 blur-[100px] rounded-full"></div>
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-brown-500/10 blur-[100px] rounded-full"></div>
                        <div className="glass-card-lg p-8 relative flex flex-col gap-6 transform hover:rotate-1 transition-transform duration-700">
                            <div className="h-48 rounded-xl bg-gradient-to-br from-brand-200 to-brown-300 dark:from-brand-900/50 dark:to-brown-900/50 flex items-center justify-center">
                                <span className="text-white/40 font-display text-4xl font-black">CHHAAP</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="h-32 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20"></div>
                                <div className="h-32 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20"></div>
                            </div>
                            <div className="h-4 rounded-full bg-brand-200/50 dark:bg-brand-800/30 w-3/4"></div>
                            <div className="h-4 rounded-full bg-brand-200/30 dark:bg-brand-800/20 w-1/2"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <div className="flex flex-col gap-3">
                            <span className="text-[10px] text-brand-600 font-bold uppercase tracking-[0.3em]">Customer Favorites</span>
                            <h2 className="heading-md dark:text-white">Featured Collections</h2>
                        </div>
                        <Link to="/products" className="btn-ghost text-xs uppercase tracking-widest font-bold">
                            View All <ArrowRight size={16} className="ml-1" />
                        </Link>
                    </div>

                    <FeaturedSection />
                </div>
            </section>

            {/* Services Section */}
            <section className="bg-brand-600/5 dark:bg-white/5 py-24 transition-colors">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center flex flex-col gap-4 mb-20">
                        <h2 className="heading-md dark:text-white">Our Specialized Services</h2>
                        <div className="h-1.5 w-24 bg-brand-600 mx-auto rounded-full"></div>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-4 leading-relaxed">
                            Explore our wide range of professional printing and design services designed to make your business stand out in the crowded market.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <ServiceCard
                            icon={<Printer />}
                            title="Stickers & Labels"
                            desc="Vinyl, Paper, Transparent and specialized stickers for all purposes."
                        />
                        <ServiceCard
                            icon={<Palette />}
                            title="Flex & Banners"
                            desc="Large format printing with vibrant colors and durable materials for outdoors."
                        />
                        <ServiceCard
                            icon={<CreditCard />}
                            title="NFC Business Cards"
                            desc="The future of networking. Smart digital cards for the modern professional era."
                        />
                        <ServiceCard
                            icon={<Sparkles />}
                            title="Aesthetic Photo Frames"
                            desc="Beautifully crafted frames to preserve your most precious memories forever."
                        />
                    </div>
                </div>
            </section>

            {/* Blogs Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center flex flex-col gap-4 mb-16">
                        <h2 className="heading-md dark:text-white">Creative Insights</h2>
                        <p className="text-gray-500 italic">Latest news and design tips from Chhaap Creatives.</p>
                    </div>

                    <RecentBlogs />
                </div>
            </section>
        </div>
    );
};

const FeaturedSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/products?limit=4');
                if (res.data.success) setProducts(res.data.data.products || []);
            } catch (e) { } finally { setLoading(false); }
        };
        fetch();
    }, []);

    if (loading) return <div className="h-48 flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" /></div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.isArray(products) && products.map(p => (
                <Link to={`/products/${p.slug}`} key={p.id} className="glass-card group overflow-hidden">
                    <div className="h-64 overflow-hidden bg-gray-50 dark:bg-white/5">
                        <img src={p.images?.[0]?.url || 'https://via.placeholder.com/300'} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6 flex flex-col gap-2">
                        <h4 className="font-bold dark:text-white line-clamp-1">{p.name}</h4>
                        <p className="text-brand-600 font-display font-bold">Rs. {parseFloat(p.basePrice).toLocaleString()}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
};

const RecentBlogs = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/blogs');
                if (res.data.success) setBlogs((res.data.data.blogs || []).slice(0, 3));
            } catch (e) { }
        };
        fetch();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map(b => (
                <Link to={`/blogs/${b.slug}`} key={b.id} className="glass-card p-6 flex flex-col gap-4 hover:border-brand-500/30 transition-all">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(b.createdAt).toLocaleDateString()}</span>
                    <h4 className="font-bold dark:text-white line-clamp-2">{b.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{b.metaDescription}</p>
                </Link>
            ))}
        </div>
    );
};

const ServiceCard = ({ icon, title, desc }) => (
    <div className="glass-card p-8 flex flex-col gap-6 group hover:-translate-y-2 transition-all duration-300">
        <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-all">
            {React.cloneElement(icon, { size: 28 })}
        </div>
        <div className="flex flex-col gap-2">
            <h3 className="heading-sm dark:text-white">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {desc}
            </p>
        </div>
        <Link to="/products" className="text-sm font-bold text-brand-600 dark:text-brand-400 mt-2 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            Learn More <ArrowRight size={16} />
        </Link>
    </div>
);

export default Home;
