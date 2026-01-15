const User = require('../models/User');
const Property = require('../models/Property');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getSystemStats = async (req, res) => {
    try {
        const totalLandlords = await User.countDocuments({ role: 'landlord' });
        const totalTenants = await User.countDocuments({ role: 'tenant' });
        const totalProperties = await Property.countDocuments({});
        const pendingProperties = await Property.countDocuments({ status: 'pending' });

        res.json({
            totalLandlords,
            totalTenants,
            totalProperties,
            pendingProperties,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.status = req.body.status || user.status;
            user.role = req.body.role || user.role; // Allow role change if needed
            await user.save();

            await ActivityLog.create({
                userId: req.user._id,
                action: 'UPDATE_USER',
                details: `Updated user ${user.email} status to ${user.status}`,
            });

            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get pending properties
// @route   GET /api/admin/properties/pending
// @access  Private/Admin
const getPendingProperties = async (req, res) => {
    try {
        const properties = await Property.find({ status: 'pending' }).populate('landlordId', 'name email');
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Approve or Reject property
// @route   PUT /api/admin/properties/:id/status
// @access  Private/Admin
const updatePropertyStatus = async (req, res) => {
    const { status } = req.body; // 'approved' or 'rejected'

    try {
        const property = await Property.findById(req.params.id);

        if (property) {
            property.status = status;
            await property.save();

            await ActivityLog.create({
                userId: req.user._id,
                action: 'UPDATE_PROPERTY',
                details: `${status.toUpperCase()} property ${property.title}`,
            });

            res.json(property);
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getSystemStats,
    getAllUsers,
    updateUserStatus,
    getPendingProperties,
    updatePropertyStatus,
};
