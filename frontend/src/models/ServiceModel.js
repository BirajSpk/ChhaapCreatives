/**
 * Service Model
 * Interfaces with service data from the backend
 */

export const ServiceModel = {
  // Fetch all services
  fetchAll: async (api, options = {}) => {
    try {
      const params = new URLSearchParams();
      if (options.limit) params.append('limit', options.limit);

      const res = await api.get(`/products?type=service&${params.toString()}`);
      return res.data.success ? res.data.data.products : [];
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  },

  // Fetch featured services
  fetchFeatured: async (api, limit = 4) => {
    try {
      const res = await api.get(`/products?type=service&limit=${limit}`);
      return res.data.success ? res.data.data.products : [];
    } catch (error) {
      console.error('Error fetching featured services:', error);
      return [];
    }
  }
};
