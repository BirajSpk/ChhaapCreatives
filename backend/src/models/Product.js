/* ============================================
 * Product Model
 * Represents products/services offered
 * ============================================ */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    slug: {
        type: DataTypes.STRING(220),
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    categoryId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id',
        },
    },
    basePrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    images: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of image objects: [{ url, altText, isPrimary }]',
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    type: {
        type: DataTypes.ENUM('product', 'service'),
        allowNull: false,
        defaultValue: 'product',
    },
    pricingConfig: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Configuration for dynamic pricing: { sizes: [], laminations: [], etc. }',
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    metaTitle: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    metaDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'products',
    indexes: [
        { fields: ['slug'], unique: true },
        { fields: ['category_id'] },
        { fields: ['is_featured'] },
        { fields: ['is_active'] },
        { fields: ['base_price'] },
        { fields: ['type'] },
    ],
    underscored: true,
});

module.exports = Product;
