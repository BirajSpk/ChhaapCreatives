import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Upload, Check, Loader2, ShoppingCart, ChevronRight, Info } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ServiceConfig = () => {
    const { slug } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [designFile, setDesignFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [config, setConfig] = useState({
        size: '',
        quantity: 1,
        finish: 'Glossy',
        dimensions: { width: 1, height: 1 },
        frameType: 'Classic Black'
    });

    const { addToCart } = useCart();

    useEffect(() => {
        const fetchService = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/services/${slug}`);
                if (res.data.success) {
                    setService(res.data.data);

                    // Initialize defaults based on slug
                    if (slug === 'custom-stickers') {
                        setConfig(prev => ({ ...prev, size: '35mm' }));
                    } else if (slug === 'custom-frames') {
                        setConfig(prev => ({ ...prev, size: '10x12', frameType: 'Classic Black' }));
                    } else if (slug === 'custom-flex') {
                        setConfig(prev => ({ ...prev, dimensions: { width: 2, height: 3 } }));
                    }
                }
            } catch (error) {
                toast.error('Configuration blueprint not found');
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [slug]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDesignFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            toast.success('Artwork synchronized successfully');
        }
    };

    const calculatePrice = () => {
        if (!service) return 0;
        let price = parseFloat(service.basePrice);

        if (slug === 'custom-stickers') {
            const sizeMatrix = {
                '35mm': 0, '40mm': 5, '45mm': 10, '50mm': 15, '60mm': 25, '70mm': 40, '80mm': 60, '90mm': 80
            };
            price += sizeMatrix[config.size] || 0;
        } else if (slug === 'custom-flex') {
            // Price = basePrice * area (sqft)
            price = price * (config.dimensions.width * config.dimensions.height);
        } else if (slug === 'custom-frames') {
            const frameSizes = { '10x12': 0, '12x15': 150, '18x24': 450, '24x36': 900 };
            const frameTypes = { 'Classic Black': 0, 'Royal Gold': 500, 'Natural Wood': 300, 'Minimal Silver': 250 };
            price += (frameSizes[config.size] || 0) + (frameTypes[config.frameType] || 0);
        }

        return price * config.quantity;
    };

    const handleAddToCart = () => {
        if (!designFile) {
            toast.error('Please upload your custom design');
            return;
        }

        const customizationData = {
            designFile: designFile.name,
            config: config,
            preview: previewUrl,
            flowType: slug
        };

        addToCart(service, null, config.quantity, customizationData);
        toast.success(`Custom production initiated: Added to cart`);
    };

    if (loading) return <div className="min-h-[70vh] flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" size={40} /></div>;
    if (!service) return <div className="p-20 text-center">Config unavailable</div>;

    return (
        <div className="section-container pb-20 pt-6 animate-fade-in">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-10">
                <Link to="/">Home</Link> <ChevronRight size={10} />
                <Link to="/services">Services</Link> <ChevronRight size={10} />
                <span className="text-brand-600">{service.name}</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
                {/* Preview Window */}
                <div className="flex-1">
                    <div className="sticky top-32">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-600 mb-2">Technical Preview</h2>
                            <div className="glass-card aspect-square rounded-[3rem] border-white/40 dark:border-white/5 shadow-glass-xl flex items-center justify-center bg-gray-50 dark:bg-black/40 overflow-hidden relative">
                                {previewUrl ? (
                                    <div className="w-full h-full p-12 flex items-center justify-center group relative">
                                        <img
                                            src={previewUrl}
                                            className={`max-w-full max-h-full object-contain shadow-2xl transition-all duration-700 ${slug === 'custom-stickers' ? 'rounded-full scale-90' : 'rounded-lg'}`}
                                            style={{
                                                filter: config.finish === 'Matte' ? 'contrast(0.9) brightness(1.1)' : 'none',
                                                border: slug === 'custom-frames' ? `20px solid ${config.frameType.includes('Gold') ? '#d4af37' : config.frameType.includes('Wood') ? '#8b4513' : config.frameType.includes('Silver') ? '#c0c0c0' : '#000'}` : 'none'
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-brand-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <label className="btn-primary py-3 px-8 cursor-pointer">
                                                Update Artwork
                                                <input type="file" onChange={handleFileChange} className="hidden" />
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-6 p-10 text-center">
                                        <div className="h-20 w-20 rounded-full bg-brand-600/10 flex items-center justify-center text-brand-600">
                                            <Upload size={32} />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <h3 className="font-bold dark:text-white uppercase tracking-tighter">Upload Primary Artwork</h3>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Supports AI, PSD, PDF, PNG (300DPI)</p>
                                        </div>
                                        <label className="btn-primary py-4 px-12 rounded-2xl cursor-pointer shadow-lg shadow-brand-600/20 active:scale-95 transition-transform">
                                            Select Workspace...
                                            <input type="file" onChange={handleFileChange} className="hidden" />
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Machine Config Cabinet */}
                <div className="w-full lg:w-[460px] flex flex-col gap-12">
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-black uppercase text-brand-600 tracking-[0.3em]">Module: {slug.replace('custom-', '')}</span>
                        <h1 className="heading-lg m-0 dark:text-white uppercase font-black">{service.name}</h1>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">{service.description}</p>
                    </div>

                    {/* Dimensions / Sizes */}
                    {(slug === 'custom-stickers' || slug === 'custom-frames') && (
                        <div className="flex flex-col gap-5">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Physical Dimensions</h4>
                            <div className="grid grid-cols-4 gap-2">
                                {(slug === 'custom-stickers'
                                    ? ['35mm', '40mm', '45mm', '50mm', '60mm', '70mm', '80mm', '90mm']
                                    : ['10x12', '12x15', '18x24', '24x36']
                                ).map(sz => (
                                    <button
                                        key={sz}
                                        onClick={() => setConfig({ ...config, size: sz })}
                                        className={`py-3 rounded-xl text-xs font-black transition-all border ${config.size === sz ? 'bg-brand-600 border-brand-600 text-white shadow-soft' : 'border-gray-100 dark:border-white/5 dark:text-gray-400 hover:border-brand-300'}`}
                                    >
                                        {sz}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {slug === 'custom-flex' && (
                        <div className="flex flex-col gap-5">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Custom Dimensions (Feet)</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[9px] font-bold text-gray-400 uppercase">Width</label>
                                    <input type="number" className="input-field py-3" value={config.dimensions.width} onChange={e => setConfig({ ...config, dimensions: { ...config.dimensions, width: e.target.value } })} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[9px] font-bold text-gray-400 uppercase">Height</label>
                                    <input type="number" className="input-field py-3" value={config.dimensions.height} onChange={e => setConfig({ ...config, dimensions: { ...config.dimensions, height: e.target.value } })} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Frame Assets */}
                    {slug === 'custom-frames' && (
                        <div className="flex flex-col gap-5">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Frame Aesthetics</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {['Classic Black', 'Royal Gold', 'Natural Wood', 'Minimal Silver'].map(ft => (
                                    <button
                                        key={ft}
                                        onClick={() => setConfig({ ...config, frameType: ft })}
                                        className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all border ${config.frameType === ft ? 'bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-900' : 'border-gray-100 dark:border-white/5 dark:text-gray-400'}`}
                                    >
                                        {ft}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Material Logic */}
                    <div className="flex flex-col gap-5">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Lamination / Finish</h4>
                        <div className="flex gap-3">
                            {['Glossy', 'Matte', 'Transparent'].map(fn => (
                                <button
                                    key={fn}
                                    onClick={() => setConfig({ ...config, finish: fn })}
                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${config.finish === fn ? 'bg-black dark:bg-white text-white dark:text-black' : 'border-gray-100 dark:border-white/5 dark:text-gray-400'}`}
                                >
                                    {fn}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Volume Processor */}
                    <div className="flex flex-col gap-5">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Batch Quantity</h4>
                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                            <button onClick={() => setConfig({ ...config, quantity: Math.max(1, config.quantity - 1) })} className="h-12 w-12 rounded-xl bg-white dark:bg-white/5 dark:text-white font-black hover:shadow-soft active:scale-95 transition-all">-</button>
                            <span className="text-xl font-black dark:text-white">{config.quantity}</span>
                            <button onClick={() => setConfig({ ...config, quantity: config.quantity + 1 })} className="h-12 w-12 rounded-xl bg-white dark:bg-white/5 dark:text-white font-black hover:shadow-soft active:scale-95 transition-all">+</button>
                        </div>
                    </div>

                    {/* Production Summary */}
                    <div className="mt-10 pt-10 border-t border-gray-100 dark:border-white/5 flex flex-col gap-8">
                        <div className="flex justify-between items-end">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Valuation</span>
                                <span className="text-4xl font-black dark:text-white tracking-tighter">Rs. {calculatePrice().toLocaleString()}</span>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="flex items-center gap-1 text-[10px] text-green-600 font-black uppercase">
                                    <Check size={12} /> Live Flow Rate
                                </span>
                                <div className="flex items-center gap-2 group cursor-pointer">
                                    <span className="text-[8px] text-gray-400 uppercase">Pricing Documentation</span>
                                    <Info size={10} className="text-gray-300" />
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={!designFile}
                            onClick={handleAddToCart}
                            className="btn-primary py-5 rounded-[2rem] w-full flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.2em] disabled:grayscale disabled:opacity-50 transition-all hover:shadow-2xl hover:shadow-brand-600/30"
                        >
                            <ShoppingCart size={20} /> Add to Production Queue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceConfig;
