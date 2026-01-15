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
// @desc    Create new user
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            phone,
            status: 'active'
        });

        if (user) {
            await ActivityLog.create({
                userId: req.user._id,
                action: 'CREATE_USER',
                details: `Created user ${user.email} as ${user.role}`
            });
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            await ActivityLog.create({
                userId: req.user._id,
                action: 'DELETE_USER',
                details: `Deleted user ${user.email}`
            });
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user details (Status, Role, etc.)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
            user.status = req.body.status || user.status;
            user.phone = req.body.phone || user.phone;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            await ActivityLog.create({
                userId: req.user._id,
                action: 'UPDATE_USER',
                details: `Updated user ${updatedUser.email}`
            });

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                status: updatedUser.status
            });
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
    createUser,
    deleteUser,
    updateUser,
    getPendingProperties,
    updatePropertyStatus,
};
