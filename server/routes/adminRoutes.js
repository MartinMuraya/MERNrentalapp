const express = require('express');
const router = express.Router();
const {
    getSystemStats,
    getAllUsers,
    updateUserStatus,
    getPendingProperties,
    updatePropertyStatus,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/stats', getSystemStats);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUserStatus);
router.get('/properties/pending', getPendingProperties);
router.put('/properties/:id/status', updatePropertyStatus);

module.exports = router;
