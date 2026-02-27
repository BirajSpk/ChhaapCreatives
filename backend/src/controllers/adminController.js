/* ============================================
 * Admin Controller
 * Handles business analytics and management
 * MVC Architecture: Controller Layer
 * ============================================ */

const { Order, User, Product, Category, sequelize } = require('../models');
const { successResponse, errorResponse } = require('../utils/helpers');
const { Op } = require('sequelize');
const settingService = require('../services/settingService');

class AdminController {
    /* GET /api/admin/stats -- Fetch summary statistics */
    static async getStats(req, res, next) {
        try {
            const totalOrders = await Order.count();
            const totalUsers = await User.count({ where: { role: 'user' } });

            /* Product vs Service breakdown */
            const productCount = await Product.count({ where: { type: 'product' } });
            const serviceCount = await Product.count({ where: { type: 'service' } });

            /* Revenue breakdown */
            const totalRevenueResult = await Order.findAll({
                where: { paymentStatus: 'paid' },
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalRevenue']
                ],
                raw: true
            });
            const totalRevenue = parseFloat(totalRevenueResult[0]?.totalRevenue || 0);

            /* Recent Orders with User info */
            const recentOrders = await Order.findAll({
                limit: 5,
                order: [['createdAt', 'DESC']],
                include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
            });

            /* Category distribution (simple) */
            const categoryDist = await Category.findAll({
                include: [{ model: Product, as: 'products', attributes: ['id'] }],
            });

            const stats = {
                totals: {
                    orders: totalOrders,
                    users: totalUsers,
                    products: productCount,
                    services: serviceCount,
                    revenue: totalRevenue,
                    estimatedProfit: totalRevenue * 0.4 // Placeholder margin
                },
                distribution: categoryDist.map(c => ({
                    name: c.name,
                    count: c.products?.length || 0
                })),
                recentOrders
            };

            return successResponse(res, stats, 'Admin stats fetched successfully');
        } catch (error) {
            next(error);
        }
    }

    /* GET /api/admin/orders -- Comprehensive order management */
    static async getAllOrders(req, res, next) {
        try {
            const orders = await Order.findAll({
                include: [
                    { model: User, as: 'user', attributes: ['name', 'email', 'phone'] }
                ],
                order: [['createdAt', 'DESC']]
            });
            return successResponse(res, orders, 'All orders fetched successfully');
        } catch (error) {
            next(error);
        }
    }

    /* PATCH /api/admin/orders/:id/status -- Update order status */
    static async updateOrderStatus(req, res, next) {
        try {
            const { status, paymentStatus } = req.body;
            const order = await Order.findByPk(req.params.id);
            if (!order) return errorResponse(res, 'Order not found', 404);

            if (status) order.status = status;
            if (paymentStatus) order.paymentStatus = paymentStatus;

            await order.save();
            return successResponse(res, order, 'Order status updated successfully');
        } catch (error) {
            next(error);
        }
    }

    /* GET /api/admin/settings -- Fetch all global settings */
    static async getSettings(req, res, next) {
        try {
            const settings = await settingService.getAll();
            return successResponse(res, settings, 'Settings fetched successfully');
        } catch (error) {
            next(error);
        }
    }

    /* PATCH /api/admin/settings -- Bulk update settings */
    static async updateSettings(req, res, next) {
        try {
            await settingService.updateBulk(req.body);
            return successResponse(res, null, 'Settings updated successfully');
        } catch (error) {
            next(error);
        }
    }

    /* GET /api/admin/users -- Fetch all users */
    static async getAllUsers(req, res, next) {
        try {
            const users = await User.findAll({
                attributes: ['id', 'name', 'email', 'role', 'is_verified', 'createdAt'],
                order: [['createdAt', 'DESC']]
            });
            return successResponse(res, users, 'Users fetched successfully');
        } catch (error) {
            next(error);
        }
    }

    /* DELETE /api/admin/users/:id -- Delete user account */
    static async deleteUser(req, res, next) {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) return errorResponse(res, 'User not found', 404);

            if (user.role === 'admin') {
                return errorResponse(res, 'Cannot delete an administrator account', 403);
            }

            await user.destroy();
            return successResponse(res, null, 'User deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AdminController;
