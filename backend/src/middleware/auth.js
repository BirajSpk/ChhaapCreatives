/* ============================================
 * Authentication Middleware
 * Verifies JWT and attaches user to request
 * MVC Architecture: Middleware Layer
 * ============================================ */

const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { User } = require('../models');

/* Verify access token and attach user to req.user */
async function authenticate(req, res, next) {
    try {
        let token = null;

        /* Extract token from Authorization header or cookies */
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            console.log('Auth failed: No token provided');
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.',
            });
        }

        /* Verify the token */
        let decoded;
        try {
            decoded = jwt.verify(token, config.jwt.secret);
        } catch (err) {
            console.log(`Auth failed: Token verification error - ${err.message}`);
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token.',
            });
        }

        /* Fetch the user from database */
        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password', 'refreshToken', 'verificationToken', 'resetPasswordToken'] },
        });

        if (!user) {
            console.log(`Auth failed: User in token not found (ID: ${decoded.id})`);
            return res.status(401).json({
                success: false,
                message: 'User not found.',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

/* Restrict access to specific roles */
function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.',
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions.',
            });
        }

        next();
    };
}

/* Optional authentication -- attaches user if token exists, but does not block */
async function optionalAuth(req, _res, next) {
    try {
        let token = null;
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        if (token) {
            const decoded = jwt.verify(token, config.jwt.secret);
            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password', 'refreshToken', 'verificationToken', 'resetPasswordToken'] },
            });
        }
    } catch {
        /* Token invalid or expired -- continue without user */
        req.user = null;
    }

    next();
}

module.exports = { authenticate, authorize, optionalAuth };
