import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { productController } from '../../controllers/productController';

const HeroShowcase = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const products = await productController.getFeatured(api, 6);
        setItems(products);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, items.length - 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, items.length - 1)) % Math.max(1, items.length - 1));
  };

  if (loading) {
    return (
      <div className="glass-card-lg p-12 flex items-center justify-center h-80">
        <Loader2 className="animate-spin text-brand-600" size={32} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="glass-card-lg p-12 flex items-center justify-center h-80">
        <p className="text-gray-500 dark:text-gray-400">No featured products available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-500/20 blur-[100px] rounded-full"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-brown-500/10 blur-[100px] rounded-full"></div>

      <div className="glass-card-lg p-8 relative flex flex-col gap-6">
        {/* Main Showcase Item */}
        <div className="relative overflow-hidden rounded-xl group">
          <Link
            to={`/products/${items[currentIndex]?.slug}`}
            className="block h-72 overflow-hidden bg-gradient-to-br from-brand-200 to-brown-300 dark:from-brand-900/50 dark:to-brown-900/50"
          >
            {items[currentIndex]?.images?.[0]?.url ? (
              <img
                src={items[currentIndex].images[0].url}
                alt={items[currentIndex].name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white/40 font-display text-2xl font-black">
                  {items[currentIndex]?.name || 'CHHAAP'}
                </span>
              </div>
            )}
          </Link>

          {/* Navigation Buttons */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all z-10"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <h3 className="font-display font-bold dark:text-white text-lg line-clamp-1">
                {items[currentIndex]?.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                {items[currentIndex]?.description || 'Premium quality printing service'}
              </p>
            </div>
            <span className="text-brand-600 font-display font-bold whitespace-nowrap">
              Rs. {parseFloat(items[currentIndex]?.basePrice || 0).toLocaleString()}
            </span>
          </div>

          {/* CTA */}
          <Link
            to={`/products/${items[currentIndex]?.slug}`}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold uppercase text-sm rounded-lg transition-all flex items-center justify-center gap-2"
          >
            Buy Now
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* Thumbnail Carousel */}
        <div className="grid grid-cols-2 gap-2">
          {items.slice(0, 4).map((item, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-20 rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentIndex
                  ? 'border-brand-600 ring-2 ring-brand-600/30'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {item?.images?.[0]?.url ? (
                <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-white/5 flex items-center justify-center">
                  <span className="text-[10px] text-gray-400">No image</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Indicator Dots */}
        <div className="flex justify-center gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? 'bg-brand-600 w-8' : 'bg-white/20 w-2 hover:bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroShowcase;
