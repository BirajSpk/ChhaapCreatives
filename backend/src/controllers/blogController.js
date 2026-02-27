const { Blog, User } = require('../models');
const { successResponse, errorResponse, paginate } = require('../utils/helpers');

class BlogController {
    /* GET /api/blogs -- Fetch all blogs */
    static async getAllBlogs(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            console.log('Blog model:', !!Blog);
            const { count, rows } = await Blog.findAndCountAll({
                where: { isPublished: true },
                include: [{
                    model: User,
                    as: 'author',
                    attributes: ['name']
                }],
                order: [['createdAt', 'DESC']],
                limit,
                offset
            });

            return successResponse(res, {
                blogs: rows,
                pagination: paginate(count, page, limit)
            }, 'Blogs fetched successfully');
        } catch (error) {
            console.error('Blog fetch error:', error);
            next(error);
        }
    }

    /* GET /api/blogs/:slug -- Fetch single blog by slug */
    static async getBlogBySlug(req, res, next) {
        try {
            const blog = await Blog.findOne({
                where: { slug: req.params.slug, isPublished: true },
                include: [{
                    model: User,
                    as: 'author',
                    attributes: ['name']
                }]
            });

            if (!blog) return errorResponse(res, 'Blog not found', 404);

            return successResponse(res, blog, 'Blog fetched successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = BlogController;
