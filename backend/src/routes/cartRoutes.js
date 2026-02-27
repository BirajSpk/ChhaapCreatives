/* ============================================
 * Cart Routes
 * Mapping cart endpoints to controller logic
 * ============================================ */

const { Router } = require('express');
const CartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');

const router = Router();

/* All cart routes require authentication */
router.use(authenticate);

router.get('/', CartController.getCart);
router.post('/sync', CartController.syncCart);

module.exports = router;
