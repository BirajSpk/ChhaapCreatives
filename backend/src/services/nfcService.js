/* ============================================
 * NFC Service
 * Handles business logic for NFC Business Cards
 * MVC Architecture: Service Layer
 * ============================================ */

const { NFCProfile, Order, sequelize } = require('../models');
const { AppError } = require('../utils/helpers');
const crypto = require('crypto');

/* Simple encryption for sensitive data as requested */
const ALGORITHM = 'aes-256-cbc';
const KEY = crypto.scryptSync(process.env.JWT_SECRET || 'chhaap-secret-key', 'salt', 32);
const IV = Buffer.alloc(16, 0); // In production, use random IV and store it

class NFCService {
    static encrypt(text) {
        if (!text) return null;
        const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    static decrypt(text) {
        if (!text) return null;
        try {
            const decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV);
            let decrypted = decipher.update(text, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (error) {
            return null;
        }
    }

    /**
     * Get profile by slug (Public)
     */
    static async getBySlug(slug) {
        const profile = await NFCProfile.findOne({
            where: { slug, isActive: true }
        });

        if (!profile) throw new AppError('NFC Profile not found', 404);

        /* De-sanitize if needed for display (most fields are public) */
        return profile;
    }

    /**
     * Create or Update NFC Profile
     */
    static async upsertProfile(userId, data) {
        const { orderId, slug, title, bio, links, theme, contactInfo } = data;

        /* Verify ownership via order if creating */
        const order = await Order.findOne({ where: { id: orderId, userId } });
        if (!order) throw new AppError('Invalid order or unauthorized', 403);

        const [profile, created] = await NFCProfile.findOrCreate({
            where: { orderId },
            defaults: {
                userId,
                slug: slug || `nfc-${Date.now()}`,
                title,
                bio,
                links: links || [],
                theme: theme || 'default',
                contactInfo: contactInfo || {}
            }
        });

        if (!created) {
            await profile.update({
                title,
                bio,
                links,
                theme,
                contactInfo
            });
        }

        return profile;
    }

    /**
     * Admin only profile update
     */
    static async adminUpdate(id, data) {
        const profile = await NFCProfile.findByPk(id);
        if (!profile) throw new AppError('Profile not found', 404);

        await profile.update(data);
        return profile;
    }
}

module.exports = NFCService;
