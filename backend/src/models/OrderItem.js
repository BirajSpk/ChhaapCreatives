/* ============================================
 * OrderItem Model
 * Individual items within an order
 * ============================================ */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    orderId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'orders', key: 'id' },
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
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Price at the time of order (snapshot)',
    },
    customDesignUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Uploaded custom design file path',
    },
    customizationData: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Stores detailed configuration (sizes, preview parameters) at order time',
    },
}, {
    tableName: 'order_items',
    indexes: [
        { fields: ['order_id'] },
        { fields: ['product_id'] },
    ],
    underscored: true,
});

module.exports = OrderItem;
