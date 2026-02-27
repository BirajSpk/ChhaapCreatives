/* ============================================
 * Product Routes
 * Maps product endpoints to controller
 * ============================================ */

const { Router } = require('express');
const ProductController = require('../controllers/productController');

const router = Router();

router.get('/', ProductController.getAllProducts);
router.get('/:slug', ProductController.getProductBySlug);

module.exports = router;
