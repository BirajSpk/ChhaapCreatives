/* ============================================
 * Auth Routes
 * Maps authentication endpoints to controller
 * MVC Architecture: Route Layer
 * ============================================ */

const { Router } = require('express');
const AuthController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} = require('../validators/authValidators');

const router = Router();

/* Public routes */
router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/forgot-password', validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), AuthController.resetPassword);
router.get('/verify-email/:token', AuthController.verifyEmail);
router.post('/refresh', AuthController.refresh);

/* Protected routes */
router.post('/logout', authenticate, AuthController.logout);
router.get('/me', authenticate, AuthController.getProfile);

module.exports = router;
