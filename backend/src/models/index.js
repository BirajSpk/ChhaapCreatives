/* ============================================
 * Model Index - Associations & Loader
 * Defines all Sequelize model relationships
 * MVC Architecture: Model Layer
 * ============================================ */

const { sequelize } = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const ProductVariant = require('./ProductVariant');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Wishlist = require('./Wishlist');
const Blog = require('./Blog');
const NFCProfile = require('./NFCProfile');
const Setting = require('./Setting');

/* ------------------------------------------
 * Category <-> Product (One-to-Many)
 * ------------------------------------------ */
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

/* ------------------------------------------
 * Product <-> ProductVariant (One-to-Many)
 * ------------------------------------------ */
Product.hasMany(ProductVariant, { foreignKey: 'productId', as: 'variants', onDelete: 'CASCADE' });
ProductVariant.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

/* ------------------------------------------
 * User <-> Order (One-to-Many)
 * ------------------------------------------ */
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

/* ------------------------------------------
 * Order <-> OrderItem (One-to-Many)
 * ------------------------------------------ */
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

/* ------------------------------------------
 * Product <-> OrderItem (One-to-Many)
 * ------------------------------------------ */
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

/* ------------------------------------------
 * ProductVariant <-> OrderItem
 * ------------------------------------------ */
ProductVariant.hasMany(OrderItem, { foreignKey: 'variantId', as: 'orderItems' });
OrderItem.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' });

/* ------------------------------------------
 * User <-> Cart (One-to-One)
 * ------------------------------------------ */
User.hasOne(Cart, { foreignKey: 'userId', as: 'cart', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

/* ------------------------------------------
 * Cart <-> CartItem (One-to-Many)
 * ------------------------------------------ */
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });

/* ------------------------------------------
 * Product <-> CartItem (One-to-Many)
 * ------------------------------------------ */
Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

/* ------------------------------------------
 * ProductVariant <-> CartItem
 * ------------------------------------------ */
ProductVariant.hasMany(CartItem, { foreignKey: 'variantId', as: 'cartItems' });
CartItem.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' });

/* ------------------------------------------
 * User <-> Wishlist (One-to-Many)
 * ------------------------------------------ */
User.hasMany(Wishlist, { foreignKey: 'userId', as: 'wishlists', onDelete: 'CASCADE' });
Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });

/* ------------------------------------------
 * Product <-> Wishlist (One-to-Many)
 * ------------------------------------------ */
Product.hasMany(Wishlist, { foreignKey: 'productId', as: 'wishlists' });
Wishlist.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

/* ------------------------------------------
 * User <-> Blog (One-to-Many, author)
 * ------------------------------------------ */
User.hasMany(Blog, { foreignKey: 'authorId', as: 'blogs' });
Blog.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

/* ------------------------------------------
 * Order <-> NFCProfile (One-to-One)
 * ------------------------------------------ */
Order.hasOne(NFCProfile, { foreignKey: 'orderId', as: 'nfcProfile' });
NFCProfile.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

/* Export all models as a single object */
const models = {
    User,
    Category,
    Product,
    ProductVariant,
    Order,
    OrderItem,
    Cart,
    CartItem,
    Wishlist,
    Blog,
    NFCProfile,
    Setting,
    sequelize,
};

module.exports = models;
