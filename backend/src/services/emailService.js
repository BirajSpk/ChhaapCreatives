/* ============================================
 * Email Service
 * Handles email sending via Nodemailer
 * MVC Architecture: Service Layer
 * ============================================ */

const nodemailer = require('nodemailer');
const config = require('../config/env');
const logger = require('../utils/logger');

class EmailService {
    constructor() {
        this.transporter = null;
        this.initialized = false;
    }

    /* Initialize the email transporter */
    initialize() {
        if (!config.smtp.host || !config.smtp.user) {
            logger.warn('SMTP not configured. Email sending is disabled.');
            return;
        }

        this.transporter = nodemailer.createTransport({
            host: config.smtp.host,
            port: config.smtp.port || 587,
            secure: config.smtp.port === 465,
            auth: {
                user: config.smtp.user,
                pass: config.smtp.password,
            },
        });

        this.initialized = true;
        logger.info('Email service initialized.');
    }

    /* Send an email */
    async send({ to, subject, html, text }) {
        if (!this.initialized || !this.transporter) {
            logger.warn('Email not sent - SMTP not configured.', { to, subject });
            return null;
        }

        try {
            const info = await this.transporter.sendMail({
                from: config.smtp.from || config.smtp.user,
                to,
                subject,
                html,
                text,
            });

            logger.info('Email sent successfully.', { to, subject, messageId: info.messageId });
            return info;
        } catch (error) {
            logger.error('Failed to send email.', { to, subject, error: error.message });
            throw error;
        }
    }

    /* Send email verification link */
    async sendVerificationEmail(user, token) {
        const verifyUrl = `${config.frontendUrl}/verify-email?token=${token}`;
        return this.send({
            to: user.email,
            subject: 'Verify Your Email - Chhaap Creatives',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5C4033;">Welcome to Chhaap Creatives</h2>
          <p>Hello ${user.name},</p>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${verifyUrl}" style="display: inline-block; background-color: #5C4033; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Verify Email
          </a>
          <p style="color: #666; font-size: 14px;">If you did not create an account, please ignore this email.</p>
        </div>
      `,
        });
    }

    /* Send password reset link */
    async sendPasswordResetEmail(user, token) {
        const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;
        return this.send({
            to: user.email,
            subject: 'Reset Your Password - Chhaap Creatives',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5C4033;">Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>You requested a password reset. Click the button below to set a new password:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #5C4033; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color: #666; font-size: 14px;">This link expires in 1 hour. If you did not request this, please ignore this email.</p>
        </div>
      `,
        });
    }
}

/* Singleton instance */
const emailService = new EmailService();

module.exports = emailService;
