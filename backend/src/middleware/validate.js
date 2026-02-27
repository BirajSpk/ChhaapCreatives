/* ============================================
 * Validation Middleware
 * Validates request body, query or params using Zod
 * ============================================ */

const { errorResponse } = require('../utils/helpers');

const validate = (schema, source = 'body') => (req, res, next) => {
    try {
        const validatedData = schema.parse(req[source]);
        req[source] = validatedData;
        next();
    } catch (error) {
        const errorMessages = error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
        }));

        return errorResponse(res, 'Validation failed', 400, { errors: errorMessages });
    }
};

module.exports = validate;
