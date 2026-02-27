/* ============================================
 * Health Controller
 * API health check and status endpoints
 * MVC Architecture: Controller Layer
 * ============================================ */

const { sequelize } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/helpers');

class HealthController {
    /* GET /api/health -- basic health check */
    static async check(_req, res) {
        return successResponse(res, {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        }, 'Chhaap Creatives API is running');
    }

    /* GET /api/health/db -- database connectivity check */
    static async dbCheck(_req, res, next) {
        try {
            await sequelize.authenticate();
            return successResponse(res, {
                database: 'connected',
                dialect: 'mysql',
            }, 'Database connection is healthy');
        } catch (error) {
            return errorResponse(res, 'Database connection failed', 503);
        }
    }
}

module.exports = HealthController;
