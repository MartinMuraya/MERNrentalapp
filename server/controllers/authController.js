const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, phone, role } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Default role to tenant if not specified, but allow admin/landlord creation for now (for MVP speed)
        // In production, admin creation should be protected.
        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: role || 'tenant',
        });

        if (user) {
            // Log activity
            await ActivityLog.create({
                userId: user._id,
                action: 'REGISTER',
                details: `User registered as ${user.role}`,
                ipAddress: req.ip,
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            // Log activity
            await ActivityLog.create({
                userId: user._id,
                action: 'LOGIN',
                details: 'User logged in',
                ipAddress: req.ip,
            });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Upload verification documents
// @route   POST /api/auth/verify
// @access  Private
const uploadVerification = async (req, res) => {
    // Mock upload - in real app use multer to S3/Cloudinary
    // req.body.docUrl would be passed from frontend
    const { docUrl } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.verificationDocs.push(docUrl);
            user.verificationStatus = 'pending';
            const updatedUser = await user.save();

            await ActivityLog.create({
                userId: req.user._id,
                action: 'VERIFICATION_SUBMITTED',
                details: 'User submitted documents for verification',
            });

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                verificationStatus: updatedUser.verificationStatus,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, uploadVerification };
