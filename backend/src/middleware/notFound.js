/* ============================================
 * 404 Not Found Middleware
 * Catches requests to undefined routes
 * ============================================ */

function notFound(req, res, _next) {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
}

module.exports = notFound;
