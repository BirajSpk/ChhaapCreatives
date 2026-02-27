const { sequelize } = require('../config/database');
require('../models');

async function debugSync() {
    try {
        console.log('Attempting sync with alter: true and logging enabled...');
        await sequelize.sync({
            alter: true,
            logging: (sql) => console.log('SQL:', sql)
        });
        console.log('Sync completed successfully!');
    } catch (error) {
        console.error('Sync failed!');
        console.error('Error Details:', error);
        if (error.original) {
            console.error('Original Error:', error.original);
        }
    } finally {
        process.exit();
    }
}

debugSync();
