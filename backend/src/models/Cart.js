/* ============================================
 * Cart Model
 * Persistent shopping cart per user
 * ============================================ */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        references: { model: 'users', key: 'id' },
    },
}, {
    tableName: 'carts',
    indexes: [
        { fields: ['user_id'], unique: true },
    ],
    underscored: true,
});

module.exports = Cart;
