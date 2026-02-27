const { sequelize } = require('../config/database');

async function cleanupIndexes() {
    try {
        console.log('Fetching indexes for table: users...');
        const [results] = await sequelize.query('SHOW INDEX FROM users');

        const indexesToDrop = results
            .filter(idx => idx.Key_name !== 'PRIMARY')
            .map(idx => idx.Key_name);

        // Unique names only
        const uniqueIndexes = [...new Set(indexesToDrop)];

        console.log(`Found ${uniqueIndexes.length} indexes to drop.`);

        for (const idxName of uniqueIndexes) {
            try {
                console.log(`Dropping index: ${idxName}...`);
                await sequelize.query(`ALTER TABLE users DROP INDEX \`${idxName}\``);
            } catch (err) {
                console.error(`Failed to drop index ${idxName}:`, err.message);
            }
        }

        console.log('Cleanup completed sequence.');
    } catch (error) {
        console.error('Cleanup failed:', error);
    } finally {
        process.exit();
    }
}

cleanupIndexes();
