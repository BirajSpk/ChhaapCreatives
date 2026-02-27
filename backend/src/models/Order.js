/* ============================================
 * Order Model
 * Represents customer orders
 * ============================================ */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'id' },
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'failed', 'cancelled'),
        defaultValue: 'pending',
    },
    paymentMethod: {
        type: DataTypes.ENUM('cod', 'esewa', 'khalti'),
        defaultValue: 'cod',
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
        defaultValue: 'pending',
    },
    trackingNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    shippingAddress: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: '{ name, phone, address, city, postalCode }',
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    adminNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'orders',
    indexes: [
        { fields: ['user_id'] },
        { fields: ['status'] },
        { fields: ['payment_status'] },
        { fields: ['created_at'] },
    ],
    underscored: true,
});

module.exports = Order;
