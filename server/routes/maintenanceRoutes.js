const express = require('express');
const router = express.Router();
const {
    createRequest,
    getLandlordRequests,
    getTenantRequests,
    updateRequestStatus
} = require('../controllers/maintenanceController');
const { protect, landlord } = require('../middleware/authMiddleware');

router.post('/', protect, createRequest);
router.get('/my', protect, getTenantRequests);
router.get('/landlord', protect, landlord, getLandlordRequests);
router.put('/:id', protect, landlord, updateRequestStatus);

module.exports = router;
