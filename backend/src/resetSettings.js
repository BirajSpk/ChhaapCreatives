require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Setting, sequelize } = require('./models');

async function reset() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Drop safely
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await Setting.drop();
        console.log('Setting table dropped.');

        // Recreate
        await Setting.sync({ force: true });
        console.log('Setting table recreated.');

        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        // Seed default settings
        await Setting.bulkCreate([
            { key: 'storeName', value: 'Chhaap Creatives' },
            { key: 'contactEmail', value: 'contact@chhaap.com' },
            { key: 'contactPhone', value: '9860184030' },
            { key: 'taxRate', value: 13 },
            { key: 'shippingFee', value: 150 },
            { key: 'minFreeShipping', value: 5000 },
            { key: 'currency', value: 'Rs.' }
        ]);
        console.log('Default settings seeded.');
    } catch (error) {
        console.error('RESET FAILED:', error);
    } finally {
        process.exit();
    }
}

reset();
