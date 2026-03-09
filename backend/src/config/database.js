/* ============================================
 * Database Configuration (Sequelize + MySQL)
 * Initializes and exports the Sequelize instance
 * ============================================ */

const { Sequelize } = require('sequelize');
const config = require('./env');
const logger = require('../utils/logger');

const sequelize = new Sequelize(
    config.db.name,
    config.db.user,
    config.db.password,
    {
        host: config.db.host,
        port: config.db.port,
        dialect: 'mysql',
        logging: config.nodeEnv === 'development' ? console.log : false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true,
        },
    }
);

/* Attempt database connection with retry logic */
async function connectDatabase() {
    const MAX_RETRIES = 5;
    const RETRY_DELAY = 3000;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            await sequelize.authenticate();
            console.log('[DB] MySQL connection established successfully.');
            return true;
        } catch (error) {
            console.error(`[DB] Connection attempt ${attempt}/${MAX_RETRIES} failed:`, error.message);
            if (attempt < MAX_RETRIES) {
                console.log(`[DB] Retrying in ${RETRY_DELAY / 1000} seconds...`);
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
            }
        }
    }

    console.error('[DB] Unable to connect to MySQL after all retries.');
    return false;
}

/* Sync all models with the database */
async function syncDatabase(options = {}) {
    try {
        const syncOptions = config.nodeEnv === 'development'
            ? { alter: false, force: false, ...options }
            : { ...options };

        await sequelize.sync(syncOptions);
        console.log('[DB] All models synchronized successfully.');
        return true;
    } catch (error) {
        logger.error('Database sync failed:', error);
        logger.warn('Continuing with server startup despite database sync error...');
        /* Continue anyway - don't throw, just warn */
        return false;
    }
}

module.exports = {
    sequelize,
    connectDatabase,
    syncDatabase,
};
