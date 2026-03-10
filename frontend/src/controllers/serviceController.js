/**
 * Service Controller
 * Handles business logic for service operations
 */

import { ServiceModel } from '../models/ServiceModel';

export const serviceController = {
  // Get all services
  getAll: async (api, limit = 8) => {
    const services = await ServiceModel.fetchAll(api, { limit });
    return services;
  },

  // Get featured services
  getFeatured: async (api, limit = 4) => {
    const services = await ServiceModel.fetchFeatured(api, limit);
    return services;
  }
};
