/**
 * Blog Model
 * Interfaces with blog data from the backend
 */

export const BlogModel = {
  // Fetch all blogs
  fetchAll: async (api, options = {}) => {
    try {
      const params = new URLSearchParams();
      if (options.limit) params.append('limit', options.limit);

      const res = await api.get(`/blogs?${params.toString()}`);
      return res.data.success ? res.data.data.blogs : [];
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
  },

  // Fetch recent blogs
  fetchRecent: async (api, limit = 3) => {
    try {
      const res = await api.get(`/blogs?limit=${limit}`);
      if (res.data.success) {
        const blogs = res.data.data.blogs || [];
        return blogs.slice(0, limit);
      }
      return [];
    } catch (error) {
      console.error('Error fetching recent blogs:', error);
      return [];
    }
  },

  // Fetch single blog
  fetchById: async (api, slug) => {
    try {
      const res = await api.get(`/blogs/${slug}`);
      return res.data.success ? res.data.data : null;
    } catch (error) {
      console.error('Error fetching blog:', error);
      return null;
    }
  }
};
