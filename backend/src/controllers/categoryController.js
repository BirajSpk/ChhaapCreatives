/* ============================================
 * Category Controller
 * Handles HTTP requests for categories
 * MVC Architecture: Controller Layer
 * ============================================ */

const { Category, Product } = require('../models');
const { successResponse, errorResponse, AppError } = require('../utils/helpers');

class CategoryController {
    /* GET /api/categories -- Fetch all active categories */
    static async getAllCategories(req, res, next) {
        try {
            const categories = await Category.findAll({
                where: { isActive: true },
                order: [['sortOrder', 'ASC']],
            });

            return successResponse(res, categories, 'Categories fetched successfully');
        } catch (error) {
            next(error);
        }
    }

    /* GET /api/categories/:slug -- Fetch single category by slug */
    static async getCategoryBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const category = await Category.findOne({
                where: { slug, isActive: true },
                include: [{
                    model: Product,
                    as: 'products',
                    where: { isActive: true },
                    required: false,
                }],
            });

            if (!category) {
                return errorResponse(res, 'Category not found', 404);
            }

            return successResponse(res, category, 'Category fetched successfully');
        } catch (error) {
            next(error);
        }
    }
    /* POST /api/admin/categories -- Create category (Admin) */
    static async createCategory(req, res, next) {
        try {
            const category = await Category.create(req.body);
            return successResponse(res, category, 'Category created successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    /* PATCH /api/admin/categories/:id -- Update category (Admin) */
    static async updateCategory(req, res, next) {
        try {
            const category = await Category.findByPk(req.params.id);
            if (!category) return errorResponse(res, 'Category not found', 404);
            await category.update(req.body);
            return successResponse(res, category, 'Category updated successfully');
        } catch (error) {
            next(error);
        }
    }

    /* DELETE /api/admin/categories/:id -- Delete category (Admin) */
    static async deleteCategory(req, res, next) {
        try {
            const category = await Category.findByPk(req.params.id);
            if (!category) return errorResponse(res, 'Category not found', 404);
            await category.destroy();
            return successResponse(res, null, 'Category deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = CategoryController;
