/* ============================================
 * Helper Utilities
 * Shared utility functions for the backend
 * ============================================ */

/* Generate a URL-friendly slug from a string */
function generateSlug(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

/* Generate a unique slug by appending a short random suffix */
function generateUniqueSlug(text) {
    const base = generateSlug(text);
    const suffix = Math.random().toString(36).substring(2, 8);
    return `${base}-${suffix}`;
}

/* Paginate query results */
function getPagination(page = 1, limit = 12) {
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const offset = (parsedPage - 1) * parsedLimit;

    return { limit: parsedLimit, offset, page: parsedPage };
}

/* Build pagination metadata for API response */
function paginate(totalItems, page, limit) {
    const totalPages = Math.ceil(totalItems / limit);
    return {
        currentPage: parseInt(page),
        totalPages,
        totalItems,
        itemsPerPage: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };
}

/* Create standardized API success response */
function successResponse(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
}

/* Create standardized API error response */
function errorResponse(res, message = 'Error', statusCode = 500, errors = null) {
    return res.status(statusCode).json({
        success: false,
        message,
        ...(errors && { errors }),
    });
}

/* Custom application error class */
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}

module.exports = {
    generateSlug,
    generateUniqueSlug,
    getPagination,
    paginate,
    successResponse,
    errorResponse,
    AppError,
};
