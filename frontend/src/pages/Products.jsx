import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowRight, Loader2, PackageX } from 'lucide-react';
import api from '../services/api';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    /* Fetch filters and initial products */
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const res = await api.get('/categories');
                if (res.data.success) setCategories(res.data.data);
            } catch (error) {
                console.error('Failed to fetch categories');
            }
        };
        fetchFilters();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = Object.fromEntries([...searchParams]);
                const res = await api.get('/products', { params });
                if (res.data.success) {
                    setProducts(res.data.data.products);
                    setPagination(res.data.data.pagination);
                }
            } catch (error) {
                console.error('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchParams]);

    const handleSearch = (e) => {
        e.preventDefault();
        const search = e.target.search.value;
        setSearchParams(prev => {
            if (search) prev.set('search', search);
            else prev.delete('search');
            prev.set('page', '1');
            return prev;
        });
    };

    const handleCategoryFilter = (slug) => {
        setSearchParams(prev => {
            if (slug) prev.set('category', slug);
            else prev.delete('category');
            prev.set('page', '1');
            return prev;
        });
    };

    const handleSort = (sort) => {
        setSearchParams(prev => {
            prev.set('sort', sort);
            return prev;
        });
    };

    return (
        <div className="section-container pb-20 pt-4 animate-fade-in">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="flex flex-col gap-2">
                    <h1 className="heading-lg dark:text-white">Our Services</h1>
                    <p className="text-gray-500 dark:text-gray-400">Browse through our premium printing and design offerings.</p>
                </div>

                <div className="flex w-full md:w-auto items-center gap-3">
                    <form onSubmit={handleSearch} className="relative flex-1 md:w-64">
                        <input
                            name="search"
                            type="text"
                            placeholder="Search services..."
                            className="input-field pl-11 py-2.5 text-sm"
                            defaultValue={searchParams.get('search') || ''}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </form>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="btn-secondary py-2.5 px-4 md:hidden"
                    >
                        <SlidersHorizontal size={18} />
                    </button>
                    <select
                        onChange={(e) => handleSort(e.target.value)}
                        value={searchParams.get('sort') || ''}
                        className="input-field w-auto min-w-[140px] py-2.5 text-sm hidden md:block"
                    >
                        <option value="">Newest Arrivals</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Sidebar Filter - Desktop */}
                <aside className={`lg:flex flex-col gap-8 ${isFilterOpen ? 'fixed inset-0 z-[60] bg-neutral-light dark:bg-neutral-dark p-6' : 'hidden'}`}>
                    <div className="flex justify-between items-center lg:hidden mb-6">
                        <h3 className="heading-sm dark:text-white">Filters</h3>
                        <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                            ✕
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Categories</h4>
                        <div className="flex flex-col gap-1.5">
                            <button
                                onClick={() => handleCategoryFilter(null)}
                                className={`text-left py-2 px-3 rounded-xl text-sm transition-all ${!searchParams.get('category') ? 'bg-brand-600 text-white shadow-soft' : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5'}`}
                            >
                                All Services
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryFilter(cat.slug)}
                                    className={`text-left py-2 px-3 rounded-xl text-sm transition-all ${searchParams.get('category') === cat.slug ? 'bg-brand-600 text-white shadow-soft' : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    {loading ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <Loader2 className="animate-spin text-brand-600" size={40} />
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center gap-4 animate-scale-in">
                            <div className="h-20 w-20 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-400">
                                <PackageX size={40} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="heading-sm dark:text-white">No products found</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">We couldn't find any services matching your current filters or search query.</p>
                            </div>
                            <button
                                onClick={() => setSearchParams({})}
                                className="btn-secondary py-2 px-6 mt-2"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-16">
                            {[...Array(pagination.totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSearchParams(prev => { prev.set('page', i + 1); return prev; })}
                                    className={`h-10 w-10 flex items-center justify-center rounded-xl font-bold transition-all ${pagination.currentPage === i + 1 ? 'bg-brand-600 text-white shadow-soft' : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:border-brand-300 dark:hover:border-brand-500/30'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProductCard = ({ product }) => {
    /* Safe parsing for JSON images if it's string (fallback for dev) */
    let images = product.images;
    if (typeof images === 'string') {
        try { images = JSON.parse(images); } catch (e) { images = []; }
    }
    const mainImage = images?.[0]?.url || 'https://via.placeholder.com/400x400?text=Chhaap';

    return (
        <div className="glass-card group flex flex-col h-full hover:shadow-glass-lg transition-all duration-300 border-white/40 dark:border-white/5">
            <Link to={`/products/${product.slug}`} className="relative overflow-hidden aspect-square rounded-t-glass">
                <img
                    src={mainImage}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <span className="text-white text-sm font-medium inline-flex items-center gap-2">
                        View Details <ArrowRight size={16} />
                    </span>
                </div>
            </Link>
            <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-brand-600 font-bold">{product.category?.name}</span>
                    <h3 className="font-display font-bold text-lg dark:text-white line-clamp-1">{product.name}</h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {product.description}
                </p>
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-white/5">
                    <div className="flex flex-col leading-tight">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Starting from</span>
                        <span className="text-lg font-bold dark:text-white">Rs. {product.basePrice}</span>
                    </div>
                    <Link to={`/products/${product.slug}`} className="h-10 w-10 flex items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 hover:bg-brand-600 hover:text-white transition-all shadow-soft">
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Products;
