/**
 * Product Controller
 * Handles business logic for product operations
 */

import { ProductModel } from '../models/ProductModel';
import { getRecommendedProducts, getFeaturedProducts } from '../utils/recommendationEngine';

export const productController = {
  // Get recommended products
  getRecommended: async (api, limit = 8) => {
    const products = await ProductModel.fetchAll(api);
    return getRecommendedProducts(products, limit);
  },

  // Get featured products
  getFeatured: async (api, limit = 4) => {
    const products = await ProductModel.fetchAll(api);
    return getFeaturedProducts(products, limit);
  },

  // Get products by category
  getByCategory: async (api, category, limit = 8) => {
    const products = await ProductModel.fetchByCategory(api, category);
    return products.slice(0, limit);
  },

  // Get all categories
  getCategories: async (api) => {
    try {
      const res = await api.get('/categories');
      return res.data.success ? res.data.data : [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
};
