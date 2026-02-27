/* ============================================
 * Product Service
 * Handles business logic for Products & Services
 * MVC Architecture: Service Layer
 * ============================================ */

const { Product, Category, ProductVariant } = require('../models');
const { Op } = require('sequelize');
const { AppError } = require('../utils/helpers');

class ProductService {
    /**
     * Get all products or services with filtering and pagination
     */
    static async getAll(filters = {}) {
        const {
            type = 'product',
            category,
            search,
            minPrice,
            maxPrice,
            page = 1,
            limit = 12,
            sort,
            isFeatured,
            isActive = true
        } = filters;

        const where = { isActive };

        /* Strict separation by type */
        if (type) where.type = type;

        /* Featured filter */
        if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';

        /* Search filter */
        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
            ];
        }

        /* Price filter */
        if (minPrice || maxPrice) {
            where.basePrice = {};
            if (minPrice) where.basePrice[Op.gte] = parseFloat(minPrice);
            if (maxPrice) where.basePrice[Op.lte] = parseFloat(maxPrice);
        }

        /* Category include/filter */
        const include = [{
            model: Category,
            as: 'category',
            attributes: ['name', 'slug'],
        }];

        if (category) {
            include[0].where = { slug: category };
        }

        /* Sorting */
        let order = [['createdAt', 'DESC']];
        if (sort === 'price_asc') order = [['basePrice', 'ASC']];
        if (sort === 'price_desc') order = [['basePrice', 'DESC']];
        if (sort === 'newest') order = [['createdAt', 'DESC']];
        if (sort === 'alphabetical') order = [['name', 'ASC']];

        const { count, rows } = await Product.findAndCountAll({
            where,
            include,
            order,
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit),
            distinct: true,
        });

        return {
            products: rows,
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
        };
    }

    /**
     * Get single product/service by slug
     */
    static async getBySlug(slug, type = null) {
        const where = { slug, isActive: true };
        if (type) where.type = type;

        const product = await Product.findOne({
            where,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug'],
                },
                {
                    model: ProductVariant,
                    as: 'variants',
                    where: { isActive: true },
                    required: false,
                },
            ],
        });

        return product;
    }

    /**
     * Calculate dynamic price based on options
     * Logic for Flex size, lamination, etc.
     */
    static calculateDynamicPrice(product, options = {}) {
        let price = parseFloat(product.basePrice);

        /* 
           Example pricingConfig: 
           { 
             "type": "flex", 
             "sqftPrice": 45, 
             "laminationOptions": { "glossy": 10, "matte": 15 } 
           } 
        */
        const config = product.pricingConfig;

        if (!config) return price;

        /* Flex pricing: width * height * sqftPrice */
        if (config.type === 'flex' && options.width && options.height) {
            const sqft = (options.width * options.height) / 144; // assuming inches
            price = sqft * config.sqftPrice;
        }

        /* Add lamination etc. */
        if (options.lamination && config.laminationOptions && config.laminationOptions[options.lamination]) {
            price += parseFloat(config.laminationOptions[options.lamination]);
        }

        return price;
    }
    /* Create a new product or service with optional variants */
    static async create(data) {
        if (!data.slug) {
            data.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
        }

        return Product.create(data, {
            include: [{ model: ProductVariant, as: 'variants' }]
        });
    }

    /* Update an existing product or service and reconcile its variants */
    static async update(id, data) {
        const product = await Product.findByPk(id, { include: ['variants'] });
        if (!product) throw new AppError('Product not found', 404);

        await product.update(data);

        /* Reconcile variants if provided */
        if (data.variants && Array.isArray(data.variants)) {
            const incomingIds = data.variants.filter(v => v.id).map(v => v.id);

            /* Remove variants not present in incoming data */
            await ProductVariant.destroy({
                where: {
                    productId: id,
                    id: { [Op.notIn]: incomingIds.length ? incomingIds : [0] }
                }
            });

            /* Upsert remaining variants */
            for (const v of data.variants) {
                if (v.id) {
                    await ProductVariant.update(v, { where: { id: v.id, productId: id } });
                } else {
                    await ProductVariant.create({ ...v, productId: id });
                }
            }
        }

        return product.reload({ include: ['variants', 'category'] });
    }

    /* Delete (archive) a product or service */
    static async delete(id) {
        const product = await Product.findByPk(id);
        if (!product) throw new AppError('Product not found', 404);

        /* Soft delete */
        product.isActive = false;
        return product.save();
    }
}

module.exports = ProductService;
