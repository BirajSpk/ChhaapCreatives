/* ============================================
 * Auth Validators (Zod Schemas)
 * Input validation for authentication endpoints
 * MVC Architecture: Validation Layer
 * ============================================ */

const { z } = require('zod');

/* Password must be 8+ chars with uppercase, lowercase, digit, and special char */
const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one digit')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
    email: z.string().email('Invalid email address').max(255).trim().toLowerCase(),
    password: passwordSchema,
    phone: z.string().max(20).optional(),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address').trim().toLowerCase(),
    password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address').trim().toLowerCase(),
});

const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: passwordSchema,
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
});

const updateProfileSchema = z.object({
    name: z.string().min(2).max(100).trim().optional(),
    phone: z.string().max(20).optional(),
    address: z.string().optional(),
});

module.exports = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    updateProfileSchema,
};
