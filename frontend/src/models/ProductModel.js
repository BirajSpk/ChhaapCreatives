/**
 * Product Model
 * Interfaces with product data from the backend
 */

export const ProductModel = {
  // Fetch all products
  fetchAll: async (api, options = {}) => {
    try {
      const params = new URLSearchParams();
      if (options.limit) params.append('limit', options.limit);
      if (options.category) params.append('category', options.category);
      if (options.type) params.append('type', options.type);

      const res = await api.get(`/products?${params.toString()}`);
      return res.data.success ? res.data.data.products : [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  // Fetch single product
  fetchById: async (api, id) => {
    try {
      const res = await api.get(`/products/${id}`);
      return res.data.success ? res.data.data : null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // Fetch by category
  fetchByCategory: async (api, category) => {
    try {
      const res = await api.get(`/products?category=${category}`);
      return res.data.success ? res.data.data.products : [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }
};
