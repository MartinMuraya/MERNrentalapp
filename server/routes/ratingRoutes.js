const express = require('express');
const router = express.Router();
const {
    createRating,
    getPropertyRatings,
    getMyRatings,
    getAvailableToRate,
} = require('../controllers/ratingController');
const { protect, tenant } = require('../middleware/authMiddleware');

// Public route
router.get('/property/:id', getPropertyRatings);

// Tenant routes
router.post('/', protect, tenant, createRating);
router.get('/my', protect, tenant, getMyRatings);
router.get('/available', protect, tenant, getAvailableToRate);

module.exports = router;
