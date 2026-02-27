/* ============================================
 * Order Service
 * Handles business logic for Orders
 * MVC Architecture: Service Layer
 * ============================================ */

const { Order, OrderItem, Cart, CartItem, Product, ProductVariant, sequelize } = require('../models');
const { AppError } = require('../utils/helpers');
const productService = require('./productService');

class OrderService {
    /**
     * Create a new order from items
     */
    static async createOrder(userId, orderData) {
        const { shippingAddress, paymentMethod, items } = orderData;
        const transaction = await sequelize.transaction();

        try {
            if (!items || items.length === 0) {
                throw new AppError('Cannot create an empty order', 400);
            }

            let totalAmount = 0;
            const orderItemsData = [];

            /* Process items and calculate total */
            for (const item of items) {
                const product = await Product.findByPk(item.id);
                if (!product) throw new AppError(`Product not found: ${item.id}`, 404);

                /* Calculate final price using service layer logic */
                let price = productService.calculateDynamicPrice(product, item.options || {});

                /* Add variant price modifier if exists */
                if (item.variantId) {
                    const variant = await ProductVariant.findByPk(item.variantId);
                    if (variant) price += parseFloat(variant.priceModifier);
                }

                totalAmount += price * item.quantity;
                orderItemsData.push({
                    productId: item.id,
                    variantId: item.variantId,
                    quantity: item.quantity,
                    price: price,
                    designURL: item.additionalInfo?.designFile || null,
                    options: item.options || {}
                });
            }

            /* Create Order */
            const order = await Order.create({
                userId,
                totalAmount,
                status: 'pending',
                paymentMethod: paymentMethod || 'cod',
                paymentStatus: 'pending',
                shippingAddress,
                trackingNumber: `CHH-${Date.now()}-${Math.floor(Math.random() * 1000)}`
            }, { transaction });

            /* Create Order Items */
            const itemsWithOrderId = orderItemsData.map(item => ({ ...item, orderId: order.id }));
            await OrderItem.bulkCreate(itemsWithOrderId, { transaction });

            /* Clear Cart */
            const cart = await Cart.findOne({ where: { userId } });
            if (cart) {
                await CartItem.destroy({ where: { cartId: cart.id }, transaction });
            }

            await transaction.commit();

            /* Fetch joined order for response */
            return await Order.findByPk(order.id, {
                include: [{
                    model: OrderItem,
                    as: 'items',
                    include: [{ model: Product, as: 'product' }]
                }]
            });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Get user orders
     */
    static async getUserOrders(userId) {
        return await Order.findAll({
            where: { userId },
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{ model: Product, as: 'product' }]
            }],
            order: [['createdAt', 'DESC']]
        });
    }

    /**
     * Get order by ID with details
     */
    static async getOrderDetails(orderId, userId = null) {
        const where = { id: orderId };
        if (userId) where.userId = userId;

        const order = await Order.findOne({
            where,
            include: [{
                model: OrderItem,
                as: 'items',
                include: [
                    { model: Product, as: 'product' },
                    { model: ProductVariant, as: 'variant' }
                ]
            }]
        });

        if (!order) throw new AppError('Order not found', 404);
        return order;
    }

    /**
     * Update order status (Admin)
     */
    static async updateStatus(orderId, status, paymentStatus = null) {
        const order = await Order.findByPk(orderId);
        if (!order) throw new AppError('Order not found', 404);

        const updates = { status };
        if (paymentStatus) updates.paymentStatus = paymentStatus;

        await order.update(updates);
        return order;
    }
}

module.exports = OrderService;
