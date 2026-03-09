/* ============================================
 * Auth Service
 * Business logic for authentication operations
 * MVC Architecture: Service Layer
 * ============================================ */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { User } = require('../models');
const { AppError } = require('../utils/helpers');

const SALT_ROUNDS = 12;

/* Token expiry times */
const TOKEN_EXPIRY = {
    accessToken: '15m',           /* 15 minutes for regular access */
    refreshToken: '7d',            /* 7 days for regular refresh */
    accessTokenRemember: '7d',     /* 7 days with remember me */
    refreshTokenRemember: '30d',   /* 30 days with remember me */
};

class AuthService {
    /* Hash a plain text password */
    static async hashPassword(password) {
        return bcrypt.hash(password, SALT_ROUNDS);
    }

    /* Compare plain text password with hash */
    static async comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    }

    /* Generate JWT access token */
    static generateAccessToken(user, rememberMe = false) {
        const expiresIn = rememberMe ? TOKEN_EXPIRY.accessTokenRemember : TOKEN_EXPIRY.accessToken;
        return jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            config.jwt.secret,
            { expiresIn }
        );
    }

    /* Generate JWT refresh token */
    static generateRefreshToken(user, rememberMe = false) {
        const expiresIn = rememberMe ? TOKEN_EXPIRY.refreshTokenRemember : TOKEN_EXPIRY.refreshToken;
        return jwt.sign(
            { id: user.id },
            config.jwt.refreshSecret,
            { expiresIn }
        );
    }

    /* Verify refresh token */
    static verifyRefreshToken(token) {
        return jwt.verify(token, config.jwt.refreshSecret);
    }

    /* Find user by email */
    static async findByEmail(email) {
        return User.findOne({ where: { email: email.toLowerCase() } });
    }

    /* Find user by ID (excluding sensitive fields) */
    static async findById(id) {
        return User.findByPk(id, {
            attributes: { exclude: ['password', 'refreshToken', 'verificationToken', 'resetPasswordToken'] },
        });
    }

    /* Create a new user */
    static async createUser(data) {
        const existingUser = await this.findByEmail(data.email);
        if (existingUser) {
            throw new AppError('Email already registered', 409);
        }

        const hashedPassword = await this.hashPassword(data.password);
        const user = await User.create({
            ...data,
            email: data.email.toLowerCase(),
            password: hashedPassword,
        });

        return user;
    }

    /* Store refresh token for a user */
    static async storeRefreshToken(userId, refreshToken, rememberMe = false) {
        const rememberMeExpires = rememberMe ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null;
        await User.update(
            { 
                refreshToken,
                rememberMeEnabled: rememberMe,
                rememberMeExpires: rememberMeExpires
            },
            { where: { id: userId } }
        );
    }

    /* Clear refresh token (logout) */
    static async clearRefreshToken(userId) {
        await User.update(
            { 
                refreshToken: null,
                rememberMeEnabled: false,
                rememberMeExpires: null
            },
            { where: { id: userId } }
        );
    }

    /* Clear expired remember me sessions */
    static async clearExpiredRememberMe() {
        await User.update(
            { 
                rememberMeEnabled: false,
                rememberMeExpires: null
            },
            { 
                where: {
                    rememberMeEnabled: true,
                    rememberMeExpires: {
                        [require('sequelize').Op.lt]: new Date()
                    }
                }
            }
        );
    }
}

module.exports = AuthService;
