const express = require('express');
const router = express.Router();
const {
    createProperty,
    getMyProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    assignTenant,
} = require('../controllers/propertyController');
const { protect, landlord, verified } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, landlord, verified, createProperty);

router.route('/my')
    .get(protect, landlord, getMyProperties);

router.route('/:id')
    .get(protect, getPropertyById) // Landlord or Admin can view
    .put(protect, landlord, updateProperty)
    .delete(protect, landlord, deleteProperty);

router.route('/:id/units/:unitId/assign')
    .post(protect, landlord, assignTenant);

router.route('/:id/units/:unitId/invite')
    .post(protect, landlord, require('../controllers/propertyController').generateInvite);

module.exports = router;


module.exports = router;
