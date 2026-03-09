/* ============================================
 * Auth Controller
 * Handles authentication HTTP requests
 * MVC Architecture: Controller Layer
 * Delegates business logic to AuthService
 * ============================================ */

const crypto = require('crypto');
const AuthService = require('../services/authService');
const emailService = require('../services/emailService');
const { User } = require('../models');
const { successResponse, errorResponse, AppError } = require('../utils/helpers');
const config = require('../config/env');

/* Cookie options for secure token storage */
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    path: '/',
};

class AuthController {
    /* POST /api/auth/register */
    static async register(req, res, next) {
        try {
            const { name, email, password, phone, rememberMe } = req.body;

            const user = await AuthService.createUser({ name, email, password, phone });

            /* Generate verification token */
            const verificationToken = crypto.randomBytes(32).toString('hex');
            await User.update({ verificationToken }, { where: { id: user.id } });

            /* Send verification email (non-blocking) */
            emailService.sendVerificationEmail(user, verificationToken).catch(() => { });

            /* Generate tokens with rememberMe option */
            const accessToken = AuthService.generateAccessToken(user, rememberMe);
            const refreshToken = AuthService.generateRefreshToken(user, rememberMe);
            await AuthService.storeRefreshToken(user.id, refreshToken, rememberMe);

            /* Calculate cookie expiry based on rememberMe */
            const accessTokenMaxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000;
            const refreshTokenMaxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

            /* Set cookies */
            res.cookie('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: accessTokenMaxAge });
            res.cookie('refreshToken', refreshToken, { ...COOKIE_OPTIONS, maxAge: refreshTokenMaxAge });

            return successResponse(res, {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified,
                },
                accessToken,
            }, 'Registration successful', 201);
        } catch (error) {
            next(error);
        }
    }

    /* POST /api/auth/login */
    static async login(req, res, next) {
        try {
            const { email, password, rememberMe } = req.body;
            console.log(`Login attempt: ${email}`);

            const user = await AuthService.findByEmail(email);
            if (!user) {
                console.log('Login failed: user not found');
                return errorResponse(res, 'Invalid email or password', 401);
            }

            const isPasswordValid = await AuthService.comparePassword(password, user.password);
            if (!isPasswordValid) {
                console.log('Login failed: password mismatch');
                return errorResponse(res, 'Invalid email or password', 401);
            }

            /* Generate tokens with rememberMe option */
            const accessToken = AuthService.generateAccessToken(user, rememberMe);
            const refreshToken = AuthService.generateRefreshToken(user, rememberMe);
            await AuthService.storeRefreshToken(user.id, refreshToken, rememberMe);

            /* Calculate cookie expiry based on rememberMe */
            const accessTokenMaxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000;
            const refreshTokenMaxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

            /* Set cookies */
            res.cookie('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: accessTokenMaxAge });
            res.cookie('refreshToken', refreshToken, { ...COOKIE_OPTIONS, maxAge: refreshTokenMaxAge });

            return successResponse(res, {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified,
                    profileImage: user.profileImage,
                },
                accessToken,
            }, 'Login successful');
        } catch (error) {
            next(error);
        }
    }

    /* POST /api/auth/logout */
    static async logout(req, res, next) {
        try {
            if (req.user) {
                await AuthService.clearRefreshToken(req.user.id);
            }

            res.clearCookie('accessToken', COOKIE_OPTIONS);
            res.clearCookie('refreshToken', COOKIE_OPTIONS);

            return successResponse(res, null, 'Logout successful');
        } catch (error) {
            next(error);
        }
    }

    /* POST /api/auth/refresh */
    static async refresh(req, res, next) {
        try {
            const token = req.cookies?.refreshToken || req.body?.refreshToken;
            if (!token) {
                return errorResponse(res, 'Refresh token not provided', 401);
            }

            const decoded = AuthService.verifyRefreshToken(token);
            const user = await User.findByPk(decoded.id);

            if (!user || user.refreshToken !== token) {
                return errorResponse(res, 'Invalid refresh token', 401);
            }

            /* Check if remember me session has expired */
            if (user.rememberMeEnabled && user.rememberMeExpires < new Date()) {
                await AuthService.clearRefreshToken(user.id);
                return errorResponse(res, 'Remember me session expired, please login again', 401);
            }

            /* Generate new access token with same remember me status */
            const accessToken = AuthService.generateAccessToken(user, user.rememberMeEnabled);
            const accessTokenMaxAge = user.rememberMeEnabled ? 7 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000;
            res.cookie('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: accessTokenMaxAge });

            return successResponse(res, { accessToken }, 'Token refreshed');
        } catch (error) {
            next(error);
        }
    }

    /* POST /api/auth/forgot-password */
    static async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const user = await AuthService.findByEmail(email);

            /* Always return success to prevent email enumeration */
            if (!user) {
                return successResponse(res, null, 'If an account exists with that email, a reset link has been sent.');
            }

            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetExpires = new Date(Date.now() + 60 * 60 * 1000); /* 1 hour */

            await User.update(
                { resetPasswordToken: resetToken, resetPasswordExpires: resetExpires },
                { where: { id: user.id } }
            );

            /* Send reset email (non-blocking) */
            emailService.sendPasswordResetEmail(user, resetToken).catch(() => { });

            return successResponse(res, null, 'If an account exists with that email, a reset link has been sent.');
        } catch (error) {
            next(error);
        }
    }

    /* POST /api/auth/reset-password */
    static async resetPassword(req, res, next) {
        try {
            const { token, password } = req.body;

            const user = await User.findOne({
                where: { resetPasswordToken: token },
            });

            if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
                return errorResponse(res, 'Invalid or expired reset token', 400);
            }

            const hashedPassword = await AuthService.hashPassword(password);

            await User.update(
                {
                    password: hashedPassword,
                    resetPasswordToken: null,
                    resetPasswordExpires: null,
                },
                { where: { id: user.id } }
            );

            return successResponse(res, null, 'Password reset successful');
        } catch (error) {
            next(error);
        }
    }

    /* GET /api/auth/verify-email/:token */
    static async verifyEmail(req, res, next) {
        try {
            const { token } = req.params;
            const user = await User.findOne({ where: { verificationToken: token } });

            if (!user) {
                return errorResponse(res, 'Invalid verification token', 400);
            }

            await User.update(
                { isVerified: true, verificationToken: null },
                { where: { id: user.id } }
            );

            return successResponse(res, null, 'Email verified successfully');
        } catch (error) {
            next(error);
        }
    }

    /* GET /api/auth/me -- current user profile */
    static async getProfile(req, res) {
        return successResponse(res, { user: req.user }, 'Profile fetched');
    }
}

module.exports = AuthController;
