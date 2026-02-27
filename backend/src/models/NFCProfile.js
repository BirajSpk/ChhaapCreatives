/* ============================================
 * NFCProfile Model
 * NFC Business Card digital profile linked to order
 * Stores Linktree-style profile data
 * ============================================ */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NFCProfile = sequelize.define('NFCProfile', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    orderId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'orders', key: 'id' },
    },
    slug: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique public URL slug for the NFC profile',
    },
    fullName: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    designation: {
        type: DataTypes.STRING(150),
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    profileImage: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    links: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of { label, url, icon }',
    },
    themeSettings: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: '{ primaryColor, bgColor, fontFamily, layout }',
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'nfc_profiles',
    indexes: [
        { fields: ['slug'], unique: true },
        { fields: ['order_id'] },
        { fields: ['is_active'] },
    ],
    underscored: true,
});

module.exports = NFCProfile;
