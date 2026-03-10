/**
 * Recommendation Engine for Products
 * Scores products based on multiple factors and returns ranked list
 */

export const scoreProduct = (product) => {
  let score = 0;

  // Featured products get high priority (3x multiplier)
  if (product.isFeatured) score += 3;

  // Popularity based on some metric (if available)
  if (product.popularity) score += product.popularity * 2;

  // Recently added products get a boost (1.5x multiplier)
  if (product.createdAt) {
    const daysOld = (new Date() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24);
    if (daysOld < 30) score += 1.5;
  }

  // Best selling products get high priority (2.5x multiplier)
  if (product.isBestSelling) score += 2.5;

  // Base score for all products
  score += 1;

  return score;
};

export const getRecommendedProducts = (products, limit = 8) => {
  if (!Array.isArray(products)) return [];

  return products
    .map(product => ({
      ...product,
      score: scoreProduct(product)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score, ...product }) => product);
};

export const getFeaturedProducts = (products, limit = 4) => {
  if (!Array.isArray(products)) return [];

  // Return featured products first, then fallback to recommended
  const featured = products.filter(p => p.isFeatured).slice(0, limit);
  if (featured.length >= limit) return featured;

  const recommended = getRecommendedProducts(products, limit);
  return recommended;
};

export const getProductsByScore = (products) => {
  if (!Array.isArray(products)) return [];

  return products
    .map(product => ({
      ...product,
      score: scoreProduct(product)
    }))
    .sort((a, b) => b.score - a.score);
};
