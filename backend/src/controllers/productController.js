/* ============================================
 * Product Controller
 * Handles HTTP requests for products
 * MVC Architecture: Controller Layer
 * ============================================ */

const productService = require('../services/productService');
const { successResponse, errorResponse, paginate } = require('../utils/helpers');

class ProductController {
    /* GET /api/products -- Fetch products (strict filter by type=product) */
    static async getAllProducts(req, res, next) {
        try {
            const result = await productService.getAll({ ...req.query, type: 'product' });

            return successResponse(res, {
                products: result.products,
                pagination: paginate(result.total, result.page, result.limit),
            }, 'Products fetched successfully');
        } catch (error) {
            next(error);
        }
    }

    /* GET /api/services -- Fetch services (strict filter by type=service) */
    static async getAllServices(req, res, next) {
        try {
            const result = await productService.getAll({ ...req.query, type: 'service' });

            return successResponse(res, {
                services: result.products,
                pagination: paginate(result.total, result.page, result.limit),
            }, 'Services fetched successfully');
        } catch (error) {
            next(error);
        }
    }

    /* GET /api/products/:slug -- Fetch single product or service by slug */
    static async getProductBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const product = await productService.getBySlug(slug);

            if (!product) {
                return errorResponse(res, 'Product/Service not found', 404);
            }

            return successResponse(res, product, 'Product fetched successfully');
        } catch (error) {
            next(error);
        }
    }

    /* POST /api/admin/products -- Create product/service (Admin) */
    static async createProduct(req, res, next) {
        try {
            const product = await productService.create(req.body);
            return successResponse(res, product, 'Product created successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    /* PATCH /api/admin/products/:id -- Update product/service (Admin) */
    static async updateProduct(req, res, next) {
        try {
            const product = await productService.update(req.params.id, req.body);
            return successResponse(res, product, 'Product updated successfully');
        } catch (error) {
            next(error);
        }
    }

    /* DELETE /api/admin/products/:id -- Delete product/service (Admin) */
    static async deleteProduct(req, res, next) {
        try {
            await productService.delete(req.params.id);
            return successResponse(res, null, 'Product deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProductController;
