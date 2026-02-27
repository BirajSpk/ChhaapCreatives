/* ============================================
 * Environment Configuration
 * Validates and exports environment variables
 * ============================================ */

const { z } = require('zod');
require('dotenv').config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('5003'),
    FRONTEND_URL: z.string().default('http://localhost:5173'),
    CORS_ORIGIN: z.string().default('http://localhost:5173'),

    DB_HOST: z.string().default('localhost'),
    DB_PORT: z.string().default('3306'),
    DB_NAME: z.string().default('chhaap_creatives'),
    DB_USER: z.string().default('root'),
    DB_PASSWORD: z.string().default(''),

    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_SECRET: z.string().min(32),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

    UPLOAD_PATH: z.string().default('./uploads'),
    MAX_FILE_SIZE: z.string().default('5242880'),
    RATE_LIMIT_WINDOW: z.string().default('15'),
    RATE_LIMIT_MAX: z.string().default('100'),

    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.string().optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASSWORD: z.string().optional(),
    SMTP_FROM: z.string().optional(),

    ADMIN_EMAIL: z.string().email().optional(),
    ADMIN_PASSWORD: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('[ENV ERROR] Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
}

const env = parsed.data;

module.exports = {
    nodeEnv: env.NODE_ENV,
    port: parseInt(env.PORT, 10),
    frontendUrl: env.FRONTEND_URL,
    corsOrigin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),

    db: {
        host: env.DB_HOST,
        port: parseInt(env.DB_PORT, 10),
        name: env.DB_NAME,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
    },

    jwt: {
        secret: env.JWT_SECRET,
        expiresIn: env.JWT_EXPIRES_IN,
        refreshSecret: env.JWT_REFRESH_SECRET,
        refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
    },

    upload: {
        path: env.UPLOAD_PATH,
        maxFileSize: parseInt(env.MAX_FILE_SIZE, 10),
    },

    rateLimit: {
        windowMs: parseInt(env.RATE_LIMIT_WINDOW, 10) * 60 * 1000,
        max: parseInt(env.RATE_LIMIT_MAX, 10),
    },

    smtp: {
        host: env.SMTP_HOST,
        port: env.SMTP_PORT ? parseInt(env.SMTP_PORT, 10) : undefined,
        user: env.SMTP_USER,
        password: env.SMTP_PASSWORD,
        from: env.SMTP_FROM,
    },

    admin: {
        email: env.ADMIN_EMAIL,
        password: env.ADMIN_PASSWORD,
    },
};
