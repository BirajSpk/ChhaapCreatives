/* ============================================
 * Blog Model
 * Blog posts for SEO and content marketing
 * ============================================ */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Blog = sequelize.define('Blog', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(300),
        allowNull: false,
        validate: { notEmpty: true },
    },
    slug: {
        type: DataTypes.STRING(320),
        allowNull: false,
        unique: true,
    },
    content: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    featuredImage: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    metaTitle: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    metaDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    authorId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'users', key: 'id' },
    },
}, {
    tableName: 'blogs',
    indexes: [
        { fields: ['slug'], unique: true },
        { fields: ['is_published'] },
        { fields: ['created_at'] },
    ],
    underscored: true,
});

module.exports = Blog;
