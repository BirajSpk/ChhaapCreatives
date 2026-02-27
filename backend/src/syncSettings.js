require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Setting, sequelize } = require('./models');

async function sync() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        await Setting.sync({ alter: true });
        console.log('Setting table synced (alter).');

        // Seed default settings if empty
        const count = await Setting.count();
        if (count === 0) {
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
        }
    } catch (error) {
        console.error('SYNC FAILED:', error);
    } finally {
        process.exit();
    }
}

sync();
