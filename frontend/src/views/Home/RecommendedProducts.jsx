import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { productController } from '../../controllers/productController';

const RecommendedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const recommended = await productController.getRecommended(api, 8);
        setProducts(recommended);
      } catch (error) {
        console.error('Error fetching recommended products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-brand-600" size={32} />
      </div>
    );
  }

  if (products.length === 0) {
    return <div className="text-center text-gray-500 py-20">No products available</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="glass-card group overflow-hidden flex flex-col h-full hover:border-brand-500/30 transition-all">
          {/* Image Container */}
          <Link
            to={`/products/${product.slug}`}
            className="h-64 overflow-hidden bg-gray-50 dark:bg-white/5 flex-shrink-0"
          >
            <img
              src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
              alt={product.name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Content */}
          <div className="p-4 flex flex-col gap-3 flex-1">
            <div>
              <h4 className="font-bold dark:text-white line-clamp-1 text-sm">{product.name}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                {product.description || 'Premium printing service'}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mt-auto">
              <span className="text-brand-600 font-display font-bold">
                Rs. {parseFloat(product.basePrice || 0).toLocaleString()}
              </span>
              {product.minOrderQuantity && (
                <span className="text-xs text-gray-400">MOQ: {product.minOrderQuantity}</span>
              )}
            </div>

            {/* CTA Button */}
            <Link
              to={`/products/${product.slug}`}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold uppercase text-xs rounded-lg transition-all flex items-center justify-center gap-2 mt-2"
            >
              Buy Now
              <ShoppingCart size={14} />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendedProducts;
