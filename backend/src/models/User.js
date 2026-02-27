/* ============================================
 * User Model
 * Represents registered users in the system
 * Roles: user, admin, seller
 * ============================================ */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100],
        },
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('user', 'admin', 'seller'),
        defaultValue: 'user',
        allowNull: false,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    profileImage: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    address: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: '{ street, city, state, postalCode, country }',
    },
    verificationToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    resetPasswordToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'users',
    indexes: [
        { fields: ['role'] },
        { fields: ['is_verified'] },
    ],
    underscored: true,
});

module.exports = User;
