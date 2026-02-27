const { Router } = require('express');
const BlogController = require('../controllers/blogController');

const router = Router();

router.get('/', BlogController.getAllBlogs);
router.get('/:slug', BlogController.getBlogBySlug);

module.exports = router;
