/* ============================================
 * NFC Profile Controller
 * Handles digital business card profile logic
 * MVC Architecture: Controller Layer
 * ============================================ */

const nfcService = require('../services/nfcService');
const { successResponse } = require('../utils/helpers');

class NFCController {
    /* GET /api/nfc/:slug -- Public profile view */
    static async getPublicProfile(req, res, next) {
        try {
            const profile = await nfcService.getBySlug(req.params.slug);
            return successResponse(res, profile, 'Profile fetched successfully');
        } catch (error) {
            next(error);
        }
    }

    /* GET /api/nfc/my-profiles -- Fetch profiles for current user (placeholder if needed) */
    static async getMyProfiles(req, res, next) {
        try {
            /* This could be added to nfcService if needed */
            const profiles = await require('../models').NFCProfile.findAll({
                where: { userId: req.user.id }
            });
            return successResponse(res, profiles, 'Your profiles fetched successfully');
        } catch (error) {
            next(error);
        }
    }

    /* PATCH /api/nfc/update -- Create or Update NFC Profile */
    static async updateProfile(req, res, next) {
        try {
            const profile = await nfcService.upsertProfile(req.user.id, req.body);
            return successResponse(res, profile, 'Profile updated successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = NFCController;
