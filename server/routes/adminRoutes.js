const express = require('express');
const router = express.Router();
const {
    getSystemStats,
    getAllUsers,
    createUser,
    deleteUser,
    updateUser,
    getPendingProperties,
    updatePropertyStatus,
    getAllProperties,
    updateAnyProperty,
    deleteAnyProperty,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/stats', getSystemStats);
router.route('/users')
    .get(getAllUsers)
    .post(createUser);

router.route('/users/:id')
    .put(updateUser)
    .delete(deleteUser);

router.get('/properties/all', getAllProperties);
router.get('/properties/pending', getPendingProperties);
router.put('/properties/:id/status', updatePropertyStatus);
router.route('/properties/:id')
    .put(updateAnyProperty)
    .delete(deleteAnyProperty);

module.exports = router;
