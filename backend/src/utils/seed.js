/* ============================================
 * Database Seed Utility
 * Creates initial admin user and categories
 * Usage: npm run db:seed
 * ============================================ */

const bcrypt = require('bcryptjs');
const { connectDatabase, syncDatabase } = require('../config/database');
const config = require('../config/env');
const logger = require('./logger');

/* Load all models and associations */
const { User, Category } = require('../models');

/* Default categories for Chhaap Creatives */
const DEFAULT_CATEGORIES = [
    { name: 'Stickers', slug: 'stickers', description: 'Custom sticker printing in various sizes and finishes', sortOrder: 1 },
    { name: 'Flex / Banner', slug: 'flex-banner', description: 'Large format flex and banner printing', sortOrder: 2 },
    { name: 'NFC Business Cards', slug: 'nfc-business-cards', description: 'Smart NFC-enabled digital business cards', sortOrder: 3 },
    { name: 'Payment Stands', slug: 'payment-stands', description: 'QR code and NFC payment stands', sortOrder: 4 },
    { name: 'Certificates', slug: 'certificates', description: 'Professional certificate printing', sortOrder: 5 },
    { name: 'Visiting Cards', slug: 'visiting-cards', description: 'Premium visiting card printing', sortOrder: 6 },
    { name: 'Pamphlets', slug: 'pamphlets', description: 'Brochure and pamphlet printing', sortOrder: 7 },
    { name: 'Stamps', slug: 'stamps', description: 'Custom rubber and self-inking stamps', sortOrder: 8 },
    { name: 'Aesthetic Photo Frames', slug: 'aesthetic-photo-frames', description: 'Custom aesthetic photo frames', sortOrder: 9 },
    { name: 'Custom Design', slug: 'custom-design', description: 'Custom design services for all needs', sortOrder: 10 },
];

async function seed() {
    logger.info('Starting database seed...');

    const connected = await connectDatabase();
    if (!connected) {
        logger.error('Cannot seed - database connection failed.');
        process.exit(1);
    }

    await syncDatabase();

    try {
        /* Create admin user if not exists */
        const adminEmail = config.admin.email || 'admin@chhaap.com';
        const adminPassword = config.admin.password || 'Admin123!@#';

        const existingAdmin = await User.findOne({ where: { email: adminEmail } });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(adminPassword, 12);
            await User.create({
                name: 'Chhaap Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                isVerified: true,
            });
            logger.info('Admin user created successfully.');
        } else {
            logger.info('Admin user already exists, skipping.');
        }

        /* Create default categories */
        for (const cat of DEFAULT_CATEGORIES) {
            const existing = await Category.findOne({ where: { slug: cat.slug } });
            if (!existing) {
                await Category.create(cat);
                logger.info(`Category created: ${cat.name}`);
            } else {
                logger.info(`Category already exists: ${cat.name}`);
            }
        }

        logger.info('Database seed completed successfully.');
        process.exit(0);
    } catch (error) {
        logger.error('Seed failed:', { error: error.message });
        process.exit(1);
    }
}

seed();
