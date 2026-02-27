/* ============================================
 * Cart Controller
 * Handles database-backed cart operations
 * MVC Architecture: Controller Layer
 * ============================================ */

const { Cart, CartItem, Product, ProductVariant } = require('../models');
const { successResponse, errorResponse } = require('../utils/helpers');

class CartController {
    /* GET /api/cart -- Fetch current user's cart */
    static async getCart(req, res, next) {
        try {
            const [cart] = await Cart.findOrCreate({
                where: { userId: req.user.id },
                include: [{
                    model: CartItem,
                    as: 'items',
                    include: [
                        { model: Product, as: 'product' },
                        { model: ProductVariant, as: 'variant' }
                    ]
                }]
            });

            return successResponse(res, cart, 'Cart fetched successfully');
        } catch (error) {
            next(error);
        }
    }

    /* POST /api/cart/sync -- Sync local storage cart to database */
    static async syncCart(req, res, next) {
        try {
            const { items } = req.body; /* Array of { productId, variantId, quantity } */

            const [cart] = await Cart.findOrCreate({
                where: { userId: req.user.id }
            });

            /* Clear existing items for a clean sync from local storage */
            /* Alternatively, merge logic could be used here */
            await CartItem.destroy({ where: { cartId: cart.id } });

            if (items && items.length > 0) {
                const cartItems = items.map(item => ({
                    cartId: cart.id,
                    productId: item.id, /* Match frontend item fields */
                    variantId: item.variantId,
                    quantity: item.quantity
                }));
                await CartItem.bulkCreate(cartItems);
            }

            const updatedCart = await Cart.findByPk(cart.id, {
                include: [{
                    model: CartItem,
                    as: 'items',
                    include: [
                        { model: Product, as: 'product' },
                        { model: ProductVariant, as: 'variant' }
                    ]
                }]
            });

            return successResponse(res, updatedCart, 'Cart synced successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = CartController;
