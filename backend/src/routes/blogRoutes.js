const { Router } = require('express');
const BlogController = require('../controllers/blogController');
const { authenticate } = require('../middleware/auth');

const router = Router();

/* Public routes */
router.get('/', BlogController.getAllBlogs);
router.get('/:slug', BlogController.getBlogBySlug);

module.exports = router;
