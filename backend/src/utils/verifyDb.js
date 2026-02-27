const { sequelize } = require('../config/database');
const { User, Category, Product } = require('../models');

async function verify() {
    try {
        await sequelize.authenticate();
        console.log('Database connection: OK');

        const tables = await sequelize.getQueryInterface().showAllTables();
        console.log('Tables in database:', tables);

        const userCount = await User.count();
        console.log('User count:', userCount);

        const categories = await Category.findAll({ attributes: ['name', 'slug'] });
        console.log('Categories found:', categories.length);
        categories.forEach(c => console.log(` - ${c.name} (${c.slug})`));

        process.exit(0);
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
}

verify();
