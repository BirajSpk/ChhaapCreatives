import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, Plus, Minus, ArrowRight, Loader2, ChevronRight, Check } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/products/${slug}`);
                if (res.data.success) {
                    setProduct(res.data.data);
                    if (res.data.data.variants?.length > 0) {
                        setSelectedVariant(res.data.data.variants[0]);
                    }
                    if (res.data.data.minOrderQuantity) {
                        setQuantity(res.data.data.minOrderQuantity);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch product');
                toast.error('Product not found or unavailable');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-600" size={40} />
            </div>
        );
    }

    if (!product) return null;

    /* Handle images */
    let images = product.images;
    if (typeof images === 'string') {
        try { images = JSON.parse(images); } catch (e) { images = []; }
    }
    const gallery = images?.length > 0 ? images : [{ url: 'https://via.placeholder.com/600x600?text=Chhaap', altText: product.name }];

    const totalPrice = (parseFloat(product.basePrice) + (selectedVariant?.priceModifier || 0)) * quantity;

    const handleAddToCart = () => {
        if (quantity < (product.minOrderQuantity || 1)) {
            toast.error(`Minimum order quantity is ${product.minOrderQuantity}`);
            return;
        }
        addToCart(product, selectedVariant, quantity);
        toast.success(`${product.name} added to cart!`);
    };

    return (
        <div className="section-container page-section animate-fade-in">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <Link to="/" className="hover:text-brand-600">Home</Link>
                <ChevronRight size={14} />
                <Link to="/products" className="hover:text-brand-600">Products</Link>
                <ChevronRight size={14} />
                <span className="text-gray-900 dark:text-white capitalize">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Image Gallery */}
                <div className="flex flex-col gap-6">
                    <div className="glass-card overflow-hidden rounded-glass-lg aspect-square border-white/50 dark:border-white/5 relative group">
                        <img
                            src={gallery[activeImage]?.url}
                            alt={gallery[activeImage]?.altText}
                            className="h-full w-full object-cover transition-transform duration-700"
                        />
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/80 dark:bg-black/80 backdrop-blur-md text-gray-700 dark:text-white hover:text-brand-600 transition-all shadow-soft border border-white/20">
                                <Heart size={20} />
                            </button>
                            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/80 dark:bg-black/80 backdrop-blur-md text-gray-700 dark:text-white hover:text-brand-600 transition-all shadow-soft border border-white/20">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                    {gallery.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                            {gallery.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-brand-600 shadow-soft scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={img.url} alt={img.altText} className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Area */}
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-3">
                        <span className="text-xs uppercase tracking-[0.2em] font-bold text-brand-600">{product.category?.name}</span>
                        <h1 className="heading-lg dark:text-white">{product.name}</h1>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-3xl font-bold dark:text-white">
                                Rs. {totalPrice.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-400 uppercase tracking-wider font-medium px-2 py-1 rounded bg-gray-100 dark:bg-white/5">Inclusive of tax</span>
                        </div>
                        {product.minOrderQuantity > 1 && (
                            <span className="text-[10px] text-brand-600 font-bold uppercase tracking-widest bg-brand-50 dark:bg-brand-900/20 px-3 py-1 rounded w-fit">
                                Min. Order: {product.minOrderQuantity} units
                            </span>
                        )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {product.description}
                    </p>

                    {/* Variant Selection */}
                    {product.variants?.length > 0 && (
                        <div className="flex flex-col gap-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Available Options</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {product.variants.map((v) => (
                                    <button
                                        key={v.id}
                                        onClick={() => setSelectedVariant(v)}
                                        className={`flex flex-col gap-1 p-4 rounded-xl border transition-all text-left relative overflow-hidden ${selectedVariant?.id === v.id ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/20 shadow-soft' : 'border-gray-100 dark:border-white/10 hover:border-brand-200 hover:bg-white/40 dark:hover:bg-white/5'}`}
                                    >
                                        <div className="flex justify-between items-center w-full">
                                            <span className="text-sm font-bold dark:text-white">{v.size} {v.quality ? `- ${v.quality}` : ''}</span>
                                            {selectedVariant?.id === v.id && <Check size={16} className="text-brand-600" />}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {v.priceModifier > 0 && <span className="text-xs text-brand-700 font-bold">+ Rs. {v.priceModifier}</span>}
                                            {v.lamination && <span className="text-[10px] text-gray-400 capitalize">• {v.lamination} lamination</span>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity & Actions */}
                    <div className="flex flex-col gap-6 pt-4 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-10">
                            <div className="flex flex-col gap-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Quantity</h4>
                                <div className="flex items-center gap-4 p-1 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 w-fit">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(product.minOrderQuantity || 1, q - 1))}
                                        className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors dark:text-white"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="text-lg font-bold min-w-[30px] text-center dark:text-white">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors dark:text-white"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="btn-primary flex-1 py-4 gap-2 whitespace-nowrap"
                            >
                                <ShoppingCart size={20} />
                                Add {quantity > 1 ? `${quantity} Items` : 'to Cart'}
                            </button>
                            <button className="btn-secondary py-4 px-10">
                                Buy Now
                            </button>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 pt-6">
                        {[
                            'Premium Quality Material',
                            'Secure Packaging',
                            'Fast Turnaround',
                            'Direct Shipping'
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <div className="h-5 w-5 flex items-center justify-center rounded-full bg-green-500/10 text-green-600">
                                    <Check size={12} />
                                </div>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
