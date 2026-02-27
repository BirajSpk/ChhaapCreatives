/* ============================================
 * Route Aggregator
 * Centralizes all API route mounting
 * MVC Architecture: Route Layer
 * ============================================ */

const { Router } = require('express');
const authRoutes = require('./authRoutes');
const healthRoutes = require('./healthRoutes');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const serviceRoutes = require('./serviceRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');
const adminRoutes = require('./adminRoutes');
const nfcRoutes = require('./nfcRoutes');
const blogRoutes = require('./blogRoutes');

const router = Router();

/* Mount route modules */
router.use('/auth', authRoutes);
router.use('/health', healthRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/services', serviceRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);
router.use('/nfc', nfcRoutes);
router.use('/blogs', blogRoutes);

/* Additional route modules will be added in later phases:
 * router.use('/users', userRoutes);
 * router.use('/categories', categoryRoutes);
 * router.use('/products', productRoutes);
 * router.use('/orders', orderRoutes);
 * router.use('/cart', cartRoutes);
 * router.use('/wishlist', wishlistRoutes);
 * router.use('/blogs', blogRoutes);
 * router.use('/nfc', nfcRoutes);
 */

module.exports = router;
