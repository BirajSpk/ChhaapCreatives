/* ============================================
 * Database Sync Utility
 * Run standalone to sync all models with MySQL
 * Usage: npm run db:sync
 * ============================================ */

const { connectDatabase, syncDatabase } = require('../config/database');
const logger = require('./logger');

/* Load all models and associations */
require('../models');

async function run() {
    logger.info('Starting database sync...');

    const connected = await connectDatabase();
    if (!connected) {
        logger.error('Cannot sync - database connection failed.');
        process.exit(1);
    }

    /* force: true will DROP and recreate all tables */
    /* alter: true will modify existing tables to match models */
    const forceSync = process.argv.includes('--force');

    const synced = await syncDatabase({ force: forceSync, alter: !forceSync });
    if (synced) {
        logger.info('Database sync completed successfully.');
    } else {
        logger.error('Database sync failed.');
    }

    process.exit(synced ? 0 : 1);
}

run();
