/**
 * Blog Controller
 * Handles business logic for blog operations
 */

import { BlogModel } from '../models/BlogModel';

export const blogController = {
  // Get all blogs
  getAll: async (api, limit = 10) => {
    const blogs = await BlogModel.fetchAll(api, { limit });
    return blogs;
  },

  // Get recent blogs
  getRecent: async (api, limit = 3) => {
    const blogs = await BlogModel.fetchRecent(api, limit);
    return blogs;
  }
};
