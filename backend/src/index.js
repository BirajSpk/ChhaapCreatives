/* ============================================
 * Chhaap Creatives - Backend Entry Point
 * Express server with MVC architecture
 * ============================================ */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');

const config = require('./config/env');
const { connectDatabase, syncDatabase } = require('./config/database');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const emailService = require('./services/emailService');
const logger = require('./utils/logger');

/* Load all models and associations */
require('./models');

const app = express();

/* ----------------------------------------
 * Trust proxy (for production behind reverse proxy)
 * ---------------------------------------- */
if (config.nodeEnv === 'production') {
    app.set('trust proxy', 1);
}

/* ----------------------------------------
 * Security Middleware
 * ---------------------------------------- */
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

/* ----------------------------------------
 * CORS Configuration
 * ---------------------------------------- */
app.use(cors({
    origin: config.nodeEnv === 'production' ? config.corsOrigin : '*',
    credentials: true,
    optionsSuccessStatus: 200,
}));

/* ----------------------------------------
 * Rate Limiting
 * ---------------------------------------- */
if (config.nodeEnv === 'production') {
    app.use(rateLimit({
        windowMs: config.rateLimit.windowMs,
        max: config.rateLimit.max,
        message: { success: false, message: 'Too many requests, please try again later.' },
        standardHeaders: true,
        legacyHeaders: false,
    }));
}

/* ----------------------------------------
 * Body Parsing & Cookie Middleware
 * ---------------------------------------- */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

/* ----------------------------------------
 * Compression
 * ---------------------------------------- */
app.use(compression());

/* ----------------------------------------
 * Request Logging (dev only)
 * ---------------------------------------- */
if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
}

/* ----------------------------------------
 * Static File Serving (uploads)
 * ---------------------------------------- */
app.use('/uploads', express.static(path.resolve(config.upload.path)));

/* ----------------------------------------
 * API Routes (MVC)
 * ---------------------------------------- */
app.use('/api', routes);

/* ----------------------------------------
 * Error Handling
 * ---------------------------------------- */
app.use(notFound);
app.use(errorHandler);

/* ----------------------------------------
 * Server Startup
 * ---------------------------------------- */
async function startServer() {
    try {
        /* Connect to MySQL */
        const dbConnected = await connectDatabase();
        if (!dbConnected) {
            logger.error('Failed to connect to MySQL. Server will start without database.');
        }

        /* Sync models (creates/alters tables in development) */
        if (dbConnected) {
            await syncDatabase();
        }

        /* Initialize email service */
        emailService.initialize();

        /* Start HTTP server */
        app.listen(config.port, () => {
            logger.info(`Chhaap Creatives API running on port ${config.port}`);
            logger.info(`Environment: ${config.nodeEnv}`);
            if (config.nodeEnv === 'development') {
                logger.info(`API URL: http://localhost:${config.port}/api`);
                logger.info(`Health: http://localhost:${config.port}/api/health`);
            }
        });
    } catch (error) {
        logger.error('Server startup failed:', { error: error.message });
        process.exit(1);
    }
}

startServer();

module.exports = app;
