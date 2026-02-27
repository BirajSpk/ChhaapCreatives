/* ============================================
 * File Upload Middleware (Multer)
 * Handles local file uploads with validation
 * MVC Architecture: Middleware Layer
 * ============================================ */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config/env');

/* Ensure upload directory exists */
const uploadDir = path.resolve(config.upload.path);
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

/* Configure storage */
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

/* Allowed file types */
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const ALLOWED_DESIGN_TYPES = [...ALLOWED_IMAGE_TYPES, 'application/pdf', 'image/tiff'];

/* File filter for images */
function imageFilter(_req, file, cb) {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG, WebP, and SVG images are allowed'), false);
    }
}

/* File filter for design files (images + PDF) */
function designFilter(_req, file, cb) {
    if (ALLOWED_DESIGN_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only images (JPEG, PNG, WebP, SVG, TIFF) and PDF files are allowed'), false);
    }
}

/* Upload configurations */
const uploadImage = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: config.upload.maxFileSize },
});

const uploadDesign = multer({
    storage,
    fileFilter: designFilter,
    limits: { fileSize: config.upload.maxFileSize * 2 },
});

module.exports = { uploadImage, uploadDesign };
