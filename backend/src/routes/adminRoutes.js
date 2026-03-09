/* ============================================
 * Admin Routes
 * Protected endpoints for business management
 * ============================================ */

const { Router } = require('express');
const AdminController = require('../controllers/adminController');
const ProductController = require('../controllers/productController');
const CategoryController = require('../controllers/categoryController');
const BlogController = require('../controllers/blogController');
const { authenticate, authorize } = require('../middleware/auth');

const router = Router();

/* All admin routes require authentication and admin role */
router.use(authenticate);
router.use(authorize('admin'));

/* Analytics & Orders */
router.get('/stats', AdminController.getStats);
router.get('/orders', AdminController.getAllOrders);
router.patch('/orders/:id/status', AdminController.updateOrderStatus);

/* Product Management */
router.post('/products', ProductController.createProduct);
router.patch('/products/:id', ProductController.updateProduct);
router.delete('/products/:id', ProductController.deleteProduct);

/* System Settings */
router.get('/settings', AdminController.getSettings);
router.patch('/settings', AdminController.updateSettings);

/* User Management */
router.get('/users', AdminController.getAllUsers);
router.delete('/users/:id', AdminController.deleteUser);

/* Category Management */
router.post('/categories', CategoryController.createCategory);
router.patch('/categories/:id', CategoryController.updateCategory);
router.delete('/categories/:id', CategoryController.deleteCategory);

/* Blog Management */
router.get('/blogs', BlogController.getAllBlogsAdmin);
router.post('/blogs', BlogController.createBlog);
router.patch('/blogs/:id', BlogController.updateBlog);
router.delete('/blogs/:id', BlogController.deleteBlog);

module.exports = router;
