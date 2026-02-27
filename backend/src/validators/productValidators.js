/* ============================================
 * Product & Category Validators
 * Input validation for catalog endpoints
 * MVC Architecture: Validation Layer
 * ============================================ */

const { z } = require('zod');

const productSchema = z.object({
    name: z.string().min(2, 'Name is too short').max(200).trim(),
    description: z.string().optional(),
    categoryId: z.number().int().positive('Category is required'),
    basePrice: z.number().min(0, 'Price cannot be negative'),
    type: z.enum(['product', 'service']),
    images: z.array(z.object({
        url: z.string().url('Invalid image URL'),
        altText: z.string().optional(),
        isPrimary: z.boolean().default(false)
    })).optional(),
    pricingConfig: z.record(z.any()).optional(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
});

const categorySchema = z.object({
    name: z.string().min(2).max(100).trim(),
    description: z.string().optional(),
    image: z.string().url().optional(),
});

module.exports = {
    productSchema,
    categorySchema
};
