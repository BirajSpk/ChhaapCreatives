/* ============================================
 * Global Error Handler Middleware
 * Catches all errors and sends structured response
 * MVC Architecture: Middleware Layer
 * ============================================ */

const config = require('../config/env');

function errorHandler(err, req, res, _next) {
    /* Default values */
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = err.errors || null;

    /* Handle Sequelize validation errors */
    if (err.name === 'SequelizeValidationError') {
        statusCode = 400;
        message = 'Validation failed';
        errors = err.errors.map((e) => ({
            field: e.path,
            message: e.message,
        }));
    }

    /* Handle Sequelize unique constraint violations */
    if (err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
        message = 'Resource already exists';
        errors = err.errors.map((e) => ({
            field: e.path,
            message: `${e.path} already exists`,
        }));
    }

    /* Handle Sequelize foreign key constraint errors */
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        statusCode = 400;
        message = 'Referenced resource not found';
    }

    /* Handle JWT errors */
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    /* Handle Zod validation errors */
    if (err.name === 'ZodError') {
        statusCode = 400;
        message = 'Validation failed';
        errors = err.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
    }

    /* Handle Multer file upload errors */
    if (err.code === 'LIMIT_FILE_SIZE') {
        statusCode = 413;
        message = 'File size exceeds the allowed limit';
    }

    /* Log errors in development */
    if (config.nodeEnv === 'development') {
        console.error('[ERROR]', {
            statusCode,
            message,
            stack: err.stack,
        });
    }

    /* Send structured error response */
    res.status(statusCode).json({
        success: false,
        message,
        ...(errors && { errors }),
        ...(config.nodeEnv === 'development' && { stack: err.stack }),
    });
}

module.exports = errorHandler;
