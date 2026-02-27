/* ============================================
 * Category Routes
 * Maps category endpoints to controller
 * ============================================ */

const { Router } = require('express');
const CategoryController = require('../controllers/categoryController');

const router = Router();

router.get('/', CategoryController.getAllCategories);
router.get('/:slug', CategoryController.getCategoryBySlug);

module.exports = router;
