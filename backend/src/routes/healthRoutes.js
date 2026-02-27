/* ============================================
 * Health Routes
 * API health and status check endpoints
 * ============================================ */

const { Router } = require('express');
const HealthController = require('../controllers/healthController');

const router = Router();

router.get('/', HealthController.check);
router.get('/db', HealthController.dbCheck);

module.exports = router;
