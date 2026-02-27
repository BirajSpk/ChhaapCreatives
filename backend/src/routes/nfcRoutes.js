const { Router } = require('express');
const NFCController = require('../controllers/nfcController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { nfcProfileSchema } = require('../validators/nfcValidators');

const router = Router();

/* Public Route */
router.get('/public/:slug', NFCController.getPublicProfile);

/* Protected Routes */
router.use(authenticate);
router.get('/my-profiles', NFCController.getMyProfiles);
router.post('/update', validate(nfcProfileSchema), NFCController.updateProfile);

module.exports = router;
