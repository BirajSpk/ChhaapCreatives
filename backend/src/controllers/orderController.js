/* ============================================
 * Order Controller
 * Handles order creation and management
 * MVC Architecture: Controller Layer
 * ============================================ */

const orderService = require('../services/orderService');
const { successResponse, errorResponse } = require('../utils/helpers');

class OrderController {
    /* POST /api/orders -- Create a new order */
    static async createOrder(req, res, next) {
        try {
            const order = await orderService.createOrder(req.user.id, req.body);
            return successResponse(res, order, 'Order placed successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    /* GET /api/orders/my-orders -- Fetch orders for current user */
    static async getMyOrders(req, res, next) {
        try {
            const orders = await orderService.getUserOrders(req.user.id);
            return successResponse(res, orders, 'Orders fetched successfully');
        } catch (error) {
            next(error);
        }
    }

    /* GET /api/orders/:id -- Fetch single order detail */
    static async getOrderById(req, res, next) {
        try {
            const order = await orderService.getOrderDetails(req.params.id, req.user.id);
            return successResponse(res, order, 'Order details fetched successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = OrderController;
