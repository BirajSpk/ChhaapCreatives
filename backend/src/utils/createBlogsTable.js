const { sequelize } = require('../config/database');

async function run() {
    try {
        await sequelize.authenticate();
        console.log('Connected.');

        // Create blogs table WITHOUT foreign key first
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS blogs (
                id int(10) unsigned NOT NULL AUTO_INCREMENT,
                title varchar(300) NOT NULL,
                slug varchar(320) NOT NULL,
                content longtext NOT NULL,
                featured_image varchar(500) DEFAULT NULL,
                meta_title varchar(200) DEFAULT NULL,
                meta_description text DEFAULT NULL,
                is_published tinyint(1) DEFAULT 0,
                author_id int(10) unsigned DEFAULT NULL,
                created_at datetime NOT NULL,
                updated_at datetime NOT NULL,
                PRIMARY KEY (id),
                UNIQUE KEY slug (slug)
            )
        `);
        console.log('blogs table created!');

        // Ensure is_active exists in products
        try {
            await sequelize.query('ALTER TABLE products ADD COLUMN is_active tinyint(1) DEFAULT 1');
            console.log('Added is_active to products.');
        } catch (e) {
            console.log('products.is_active:', e.original ? e.original.code : 'exists or skipped');
        }

        // Ensure settings table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS settings (
                \`key\` varchar(100) NOT NULL,
                value text DEFAULT NULL,
                created_at datetime NOT NULL,
                updated_at datetime NOT NULL,
                PRIMARY KEY (\`key\`)
            )
        `);
        console.log('settings table ensured.');

        console.log('ALL DONE!');
    } catch (error) {
        console.error('FAILED:', error.message);
    } finally {
        process.exit();
    }
}

run();
