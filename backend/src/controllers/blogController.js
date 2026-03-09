const { Blog, User } = require('../models');
const { successResponse, errorResponse, paginate, AppError } = require('../utils/helpers');
const { createBlogSchema, updateBlogSchema } = require('../validators/blogValidators');

/* Simple slug generator */
const generateSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

class BlogController {
    /* GET /api/blogs -- Fetch all blogs (published) */
    static async getAllBlogs(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

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
            next(error);
        }
    }

    /* GET /api/admin/blogs -- Fetch all blogs (admin panel, including drafts) */
    static async getAllBlogsAdmin(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const { count, rows } = await Blog.findAndCountAll({
                include: [{
                    model: User,
                    as: 'author',
                    attributes: ['id', 'name']
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

    /* POST /api/admin/blogs -- Create new blog */
    static async createBlog(req, res, next) {
        try {
            /* Validate input */
            const validData = createBlogSchema.parse(req.body);
            const authorId = req.user?.id;

            /* Generate slug from title */
            let blogSlug = generateSlug(validData.title);
            
            /* Check for duplicate slug */
            const existingBlog = await Blog.findOne({ where: { slug: blogSlug } });
            if (existingBlog) {
                blogSlug = `${blogSlug}-${Date.now()}`;
            }

            const blog = await Blog.create({
                title: validData.title,
                slug: blogSlug,
                content: validData.content,
                featuredImage: validData.featuredImage || null,
                metaTitle: validData.metaTitle || validData.title,
                metaDescription: validData.metaDescription || validData.content.substring(0, 160),
                isPublished: validData.isPublished || false,
                authorId
            });

            /* Fetch with author details */
            const newBlog = await Blog.findByPk(blog.id, {
                include: [{ model: User, as: 'author', attributes: ['id', 'name'] }]
            });

            return successResponse(res, newBlog, 'Blog created successfully', 201);
        } catch (error) {
            if (error.name === 'ZodError') {
                const formatted = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
                return errorResponse(res, formatted, 400);
            }
            next(error);
        }
    }

    /* PATCH /api/admin/blogs/:id -- Update blog */
    static async updateBlog(req, res, next) {
        try {
            const { id } = req.params;
            
            /* Validate input */
            const validData = updateBlogSchema.parse(req.body);

            const blog = await Blog.findByPk(id);
            if (!blog) return errorResponse(res, 'Blog not found', 404);

            /* Generate new slug if title changed */
            let newSlug = blog.slug;
            if (validData.title && validData.title !== blog.title) {
                newSlug = generateSlug(validData.title);
                
                /* Check for duplicate slug (excluding current blog) */
                const existingBlog = await Blog.findOne({
                    where: {
                        slug: newSlug,
                        id: { [require('sequelize').Op.ne]: id }
                    }
                });
                if (existingBlog) {
                    newSlug = `${newSlug}-${Date.now()}`;
                }
            }

            await blog.update({
                title: validData.title || blog.title,
                slug: newSlug,
                content: validData.content || blog.content,
                featuredImage: validData.featuredImage !== undefined ? validData.featuredImage : blog.featuredImage,
                metaTitle: validData.metaTitle || blog.metaTitle,
                metaDescription: validData.metaDescription || blog.metaDescription,
                isPublished: validData.isPublished !== undefined ? validData.isPublished : blog.isPublished
            });

            const updatedBlog = await Blog.findByPk(blog.id, {
                include: [{ model: User, as: 'author', attributes: ['id', 'name'] }]
            });

            return successResponse(res, updatedBlog, 'Blog updated successfully');
        } catch (error) {
            if (error.name === 'ZodError') {
                const formatted = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
                return errorResponse(res, formatted, 400);
            }
            next(error);
        }
    }

    /* DELETE /api/admin/blogs/:id -- Delete blog */
    static async deleteBlog(req, res, next) {
        try {
            const { id } = req.params;
            const blog = await Blog.findByPk(id);

            if (!blog) return errorResponse(res, 'Blog not found', 404);

            await blog.destroy();
            return successResponse(res, null, 'Blog deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = BlogController;
