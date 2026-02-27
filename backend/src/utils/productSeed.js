/* ============================================
 * Product Seed Utility
 * Creates sample products and variants for testing
 * ============================================ */

const { Category, Product, ProductVariant } = require('../models');
const logger = require('./logger');

async function seedProducts() {
    try {
        logger.info('Starting product seeding...');

        /* Find categories created in Phase 1 seed */
        const stickersCat = await Category.findOne({ where: { slug: 'stickers' } });
        const bannersCat = await Category.findOne({ where: { slug: 'flex-banner' } });
        const nfcCat = await Category.findOne({ where: { slug: 'nfc-business-cards' } });

        if (!stickersCat || !bannersCat || !nfcCat) {
            logger.error('Categories not found. Please run npm run db:seed first.');
            process.exit(1);
        }

        /* 1. Sticker Product */
        const [stickerProduct] = await Product.findOrCreate({
            where: { slug: 'custom-vinyl-stickers' },
            defaults: {
                name: 'Custom Vinyl Stickers',
                description: 'High-quality waterproof vinyl stickers. Perfect for laptops, bottles, and outdoor branding. Available in various finishes.',
                categoryId: stickersCat.id,
                basePrice: 50.00,
                images: [{ url: 'https://images.unsplash.com/photo-1572375992501-4b089b02319c?auto=format&fit=crop&q=80&w=800', altText: 'Custom Stickers', isPrimary: true }],
                isActive: true,
            }
        });

        await ProductVariant.bulkCreate([
            { productId: stickerProduct.id, size: '2x2 inch', quality: 'Standard', lamination: 'Matte', priceModifier: 0 },
            { productId: stickerProduct.id, size: '2x2 inch', quality: 'Premium', lamination: 'Glossy', priceModifier: 20 },
            { productId: stickerProduct.id, size: '4x4 inch', quality: 'Premium', lamination: 'Matte', priceModifier: 100 },
        ], { ignoreDuplicates: true });

        /* 2. Banner Product */
        const [bannerProduct] = await Product.findOrCreate({
            where: { slug: 'outdoor-flex-banner' },
            defaults: {
                name: 'Outdoor Flex Banner',
                description: 'Durable and vibrant flex banners for outdoor advertising and events. Weather-resistant with high-quality printing.',
                categoryId: bannersCat.id,
                basePrice: 250.00,
                images: [{ url: 'https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?auto=format&fit=crop&q=80&w=800', altText: 'Flex Banner', isPrimary: true }],
                isActive: true,
            }
        });

        await ProductVariant.bulkCreate([
            { productId: bannerProduct.id, size: '3x2 feet', quality: 'Normal', priceModifier: 0 },
            { productId: bannerProduct.id, size: '6x4 feet', quality: 'Star', priceModifier: 800 },
            { productId: bannerProduct.id, size: '10x5 feet', quality: 'Star', priceModifier: 2000 },
        ], { ignoreDuplicates: true });

        /* 3. NFC Card Product */
        const [nfcCard] = await Product.findOrCreate({
            where: { slug: 'matte-black-nfc-business-card' },
            defaults: {
                name: 'Matte Black NFC Business Card',
                description: 'Modern digital business card with embedded NFC chip. Tap and share your profile instantly. Premium matte finish.',
                categoryId: nfcCat.id,
                basePrice: 1500.00,
                images: [{ url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800', altText: 'NFC Card', isPrimary: true }],
                isActive: true,
            }
        });

        await ProductVariant.bulkCreate([
            { productId: nfcCard.id, size: 'Standard', quality: 'Premium PVC', lamination: 'Matte', priceModifier: 0 },
            { productId: nfcCard.id, size: 'Standard', quality: 'Metal', lamination: 'PVD', priceModifier: 3500 },
        ], { ignoreDuplicates: true });

        logger.info('Product seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        logger.error('Product seeding failed:', error);
        process.exit(1);
    }
}

seedProducts();
