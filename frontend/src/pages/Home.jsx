import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroShowcase from '../views/Home/HeroShowcase';
import RecommendedProducts from '../views/Home/RecommendedProducts';
import ServicesSection from '../views/Home/ServicesSection';
import ProductCategories from '../views/Home/ProductCategories';
import LatestBlogs from '../views/Home/LatestBlogs';
import ContactCTA from '../views/Home/ContactCTA';

const Home = () => {
    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-0 pb-20 lg:pt-8 lg:pb-32">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Hero Text */}
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

                    {/* Hero Showcase */}
                    <HeroShowcase />
                </div>
            </section>

            {/* Recommended Products Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <div className="flex flex-col gap-3">
                            <span className="text-[10px] text-brand-600 font-bold uppercase tracking-[0.3em]">Customer Favorites</span>
                            <h2 className="heading-md dark:text-white">Recommended Products</h2>
                        </div>
                        <Link to="/products" className="btn-ghost text-xs uppercase tracking-widest font-bold">
                            View All <ArrowRight size={16} className="ml-1" />
                        </Link>
                    </div>

                    <RecommendedProducts />
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

                    <ServicesSection />
                </div>
            </section>

            {/* Product Categories Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center flex flex-col gap-4 mb-16">
                        <h2 className="heading-md dark:text-white">Browse by Category</h2>
                        <p className="text-gray-500 italic">Explore our diverse collection of printing services.</p>
                    </div>

                    <ProductCategories />
                </div>
            </section>

            {/* Latest Blogs Section */}
            <section className="py-24 bg-brand-600/5 dark:bg-white/5 transition-colors">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center flex flex-col gap-4 mb-16">
                        <h2 className="heading-md dark:text-white">Creative Insights</h2>
                        <p className="text-gray-500 italic">Latest news and design tips from Chhaap Creatives.</p>
                    </div>

                    <LatestBlogs />
                </div>
            </section>

            {/* Contact CTA Section */}
            <ContactCTA />
        </div>
    );
};

export default Home;
