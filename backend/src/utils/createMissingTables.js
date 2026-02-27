const { sequelize } = require('../config/database');

async function run() {
    try {
        await sequelize.authenticate();
        console.log('Connected to database.');

        // 1. Carts Table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS carts (
                id int(10) unsigned NOT NULL AUTO_INCREMENT,
                user_id int(10) unsigned NOT NULL,
                created_at datetime NOT NULL,
                updated_at datetime NOT NULL,
                PRIMARY KEY (id),
                UNIQUE KEY user_id (user_id)
            )
        `);
        console.log('carts table ensured.');

        // 2. Cart Items Table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS cart_items (
                id int(10) unsigned NOT NULL AUTO_INCREMENT,
                cart_id int(10) unsigned NOT NULL,
                product_id int(10) unsigned NOT NULL,
                variant_id int(10) unsigned DEFAULT NULL,
                quantity int(10) unsigned NOT NULL DEFAULT 1,
                created_at datetime NOT NULL,
                updated_at datetime NOT NULL,
                PRIMARY KEY (id),
                KEY cart_id (cart_id),
                KEY product_id (product_id)
            )
        `);
        console.log('cart_items table ensured.');

        // 3. Orders Table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id int(10) unsigned NOT NULL AUTO_INCREMENT,
                user_id int(10) unsigned NOT NULL,
                total_amount decimal(10,2) NOT NULL DEFAULT 0.00,
                status enum('pending','processing','shipped','delivered','failed','cancelled') DEFAULT 'pending',
                payment_method enum('cod','esewa','khalti') DEFAULT 'cod',
                payment_status enum('pending','paid','failed','refunded') DEFAULT 'pending',
                tracking_number varchar(100) DEFAULT NULL,
                shipping_address json DEFAULT NULL,
                notes text DEFAULT NULL,
                admin_notes text DEFAULT NULL,
                created_at datetime NOT NULL,
                updated_at datetime NOT NULL,
                PRIMARY KEY (id),
                KEY user_id (user_id),
                KEY status (status),
                KEY payment_status (payment_status),
                KEY created_at (created_at)
            )
        `);
        console.log('orders table ensured.');

        // 4. Order Items Table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id int(10) unsigned NOT NULL AUTO_INCREMENT,
                order_id int(10) unsigned NOT NULL,
                product_id int(10) unsigned NOT NULL,
                variant_id int(10) unsigned DEFAULT NULL,
                quantity int(10) unsigned NOT NULL DEFAULT 1,
                price decimal(10,2) NOT NULL,
                custom_design_url varchar(500) DEFAULT NULL,
                created_at datetime NOT NULL,
                updated_at datetime NOT NULL,
                PRIMARY KEY (id),
                KEY order_id (order_id),
                KEY product_id (product_id)
            )
        `);
        console.log('order_items table ensured.');

        // 5. Wishlists Table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS wishlists (
                id int(10) unsigned NOT NULL AUTO_INCREMENT,
                user_id int(10) unsigned NOT NULL,
                product_id int(10) unsigned NOT NULL,
                created_at datetime NOT NULL,
                updated_at datetime NOT NULL,
                PRIMARY KEY (id),
                UNIQUE KEY user_product (user_id, product_id),
                KEY user_id (user_id)
            )
        `);
        console.log('wishlists table ensured.');

        // 6. NFC Profiles Table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS nfc_profiles (
                id int(10) unsigned NOT NULL AUTO_INCREMENT,
                order_id int(10) unsigned DEFAULT NULL,
                slug varchar(100) NOT NULL,
                full_name varchar(150) NOT NULL,
                designation varchar(150) DEFAULT NULL,
                phone varchar(20) DEFAULT NULL,
                email varchar(255) DEFAULT NULL,
                profile_image varchar(500) DEFAULT NULL,
                links json DEFAULT NULL,
                theme_settings json DEFAULT NULL,
                is_active tinyint(1) DEFAULT 1,
                created_at datetime NOT NULL,
                updated_at datetime NOT NULL,
                PRIMARY KEY (id),
                UNIQUE KEY slug (slug),
                KEY order_id (order_id),
                KEY is_active (is_active)
            )
        `);
        console.log('nfc_profiles table ensured.');

        console.log('ALL MISSING TABLES ENSURED SUCCESSFULLY!');
    } catch (error) {
        console.error('FAILED TO CREATE TABLES:', error.message);
    } finally {
        process.exit();
    }
}

run();
