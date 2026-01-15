const express = require('express');
const router = express.Router();
const { getMyLease } = require('../controllers/leaseController');
const { initiatePayment, getMyPayments } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/lease', getMyLease);
router.post('/pay', initiatePayment);
router.get('/payments', getMyPayments);

module.exports = router;
