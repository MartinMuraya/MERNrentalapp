const Lease = require('../models/Lease');
const Property = require('../models/Property');

// @desc    Get my lease details
// @route   GET /api/tenant/lease
// @access  Private/Tenant
const getMyLease = async (req, res) => {
    try {
        const lease = await Lease.findOne({ tenantId: req.user._id, status: 'active' })
            .populate('propertyId', 'title location');

        if (lease) {
            res.json(lease);
        } else {
            res.json(null); // No active lease
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getMyLease };
