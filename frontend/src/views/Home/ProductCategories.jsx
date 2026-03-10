import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { productController } from '../../controllers/productController';

const ProductCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catsData = await productController.getCategories(api);
        setCategories(catsData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-brand-600" size={32} />
      </div>
    );
  }

  // Fallback categories
  const displayCategories = categories.length > 0 ? categories : [
    { id: 1, name: 'Stickers', slug: 'stickers' },
    { id: 2, name: 'Visiting Cards', slug: 'visiting-cards' },
    { id: 3, name: 'Certificates', slug: 'certificates' },
    { id: 4, name: 'Flex & Banners', slug: 'banners' },
    { id: 5, name: 'NFC Business Cards', slug: 'nfc' },
    { id: 6, name: 'Photo Frames', slug: 'frames' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {displayCategories.map((category) => (
        <Link
          key={category.id}
          to={`/products?category=${category.slug}`}
          className="glass-card p-6 flex flex-col items-center gap-4 text-center group hover:border-brand-500/30 transition-all hover:-translate-y-1"
        >
          {/* Category Icon/Image */}
          <div className="h-16 w-16 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center group-hover:bg-brand-600 transition-colors">
            {category.image ? (
              <img src={category.image} alt={category.name} className="h-full w-full object-cover rounded-full" />
            ) : (
              <span className="text-2xl">📦</span>
            )}
          </div>

          {/* Category Name */}
          <div className="flex flex-col gap-1 flex-1">
            <h4 className="font-bold dark:text-white text-sm">{category.name}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Explore collection
            </p>
          </div>

          {/* Arrow Indicator */}
          <ArrowRight size={16} className="text-brand-600 group-hover:translate-x-1 transition-transform" />
        </Link>
      ))}
    </div>
  );
};

export default ProductCategories;
