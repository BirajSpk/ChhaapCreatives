/* ============================================
 * Wishlist Model
 * User's saved/favorited products
 * ============================================ */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Wishlist = sequelize.define('Wishlist', {
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
    productId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'products', key: 'id' },
    },
}, {
    tableName: 'wishlists',
    indexes: [
        { fields: ['user_id'] },
        { fields: ['user_id', 'product_id'], unique: true },
    ],
    underscored: true,
});

module.exports = Wishlist;
