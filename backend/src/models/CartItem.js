/* ============================================
 * CartItem Model
 * Individual items in a user's cart
 * ============================================ */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CartItem = sequelize.define('CartItem', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    cartId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'carts', key: 'id' },
    },
    productId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'products', key: 'id' },
    },
    variantId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'product_variants', key: 'id' },
    },
    quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
        validate: { min: 1 },
    },
    customizationData: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Stores design uploads, custom sizes, and other service-specific data',
    },
}, {
    tableName: 'cart_items',
    indexes: [
        { fields: ['cart_id'] },
        { fields: ['product_id'] },
    ],
    underscored: true,
});

module.exports = CartItem;
