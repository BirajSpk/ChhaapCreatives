/* ============================================
 * Blog Validators (Zod Schemas)
 * Input validation for blog endpoints
 * MVC Architecture: Validation Layer
 * ============================================ */

const { z } = require('zod');

const createBlogSchema = z.object({
    title: z.string()
        .min(3, 'Title must be at least 3 characters')
        .max(300, 'Title must be at most 300 characters')
        .trim(),
    content: z.string()
        .min(10, 'Content must be at least 10 characters')
        .max(100000, 'Content must be at most 100,000 characters')
        .trim(),
    featuredImage: z.string().url('Invalid featured image URL').optional().nullable(),
    metaTitle: z.string()
        .max(200, 'Meta title must be at most 200 characters')
        .trim()
        .optional(),
    metaDescription: z.string()
        .max(500, 'Meta description must be at most 500 characters')
        .trim()
        .optional(),
    isPublished: z.boolean().optional().default(false),
});

const updateBlogSchema = z.object({
    title: z.string()
        .min(3, 'Title must be at least 3 characters')
        .max(300, 'Title must be at most 300 characters')
        .trim()
        .optional(),
    content: z.string()
        .min(10, 'Content must be at least 10 characters')
        .max(100000, 'Content must be at most 100,000 characters')
        .trim()
        .optional(),
    featuredImage: z.string().url('Invalid featured image URL').optional().nullable(),
    metaTitle: z.string()
        .max(200, 'Meta title must be at most 200 characters')
        .trim()
        .optional(),
    metaDescription: z.string()
        .max(500, 'Meta description must be at most 500 characters')
        .trim()
        .optional(),
    isPublished: z.boolean().optional(),
}).refine(
    (data) => Object.values(data).some(val => val !== undefined),
    'At least one field must be provided for update'
);

module.exports = {
    createBlogSchema,
    updateBlogSchema,
};
