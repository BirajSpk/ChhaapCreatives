/* ============================================
 * Order Routes
 * Mapping order endpoints to controller logic
 * ============================================ */

const { Router } = require('express');
const OrderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

const router = Router();

/* All order routes require authentication */
router.use(authenticate);

router.post('/', OrderController.createOrder);
router.get('/my-orders', OrderController.getMyOrders);
router.get('/:id', OrderController.getOrderById);

module.exports = router;
