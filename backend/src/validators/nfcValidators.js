/* ============================================
 * NFC Profile Validators
 * Input validation for NFC digital business cards
 * MVC Architecture: Validation Layer
 * ============================================ */

const { z } = require('zod');

const nfcProfileSchema = z.object({
    orderId: z.number().int().positive('Valid order ID is required'),
    slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric with hyphens').optional(),
    title: z.string().min(2, 'Title is too short').max(100).trim(),
    bio: z.string().max(500).optional(),
    links: z.array(z.object({
        platform: z.string(),
        url: z.string().url('Invalid link URL'),
        label: z.string().optional()
    })).optional(),
    theme: z.string().default('default'),
    contactInfo: z.record(z.any()).optional()
});

module.exports = {
    nfcProfileSchema
};
