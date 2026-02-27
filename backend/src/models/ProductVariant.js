/* ============================================
 * ProductVariant Model
 * Represents size/quality/lamination variants
 * with price modifiers for dynamic pricing
 * ============================================ */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductVariant = sequelize.define('ProductVariant', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    productId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id',
        },
    },
    size: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Size option (e.g., A4, A3, 3x3 inch, 10x5 ft)',
    },
    quality: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Quality tier (e.g., Standard, Premium, Ultra)',
    },
    laminated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Whether lamination is applied',
    },
    priceModifier: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        comment: 'Amount to add/subtract from base price',
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'product_variants',
    indexes: [
        { fields: ['product_id'] },
        { fields: ['size'] },
        { fields: ['quality'] },
        { fields: ['is_active'] },
    ],
    underscored: true,
});

module.exports = ProductVariant;
