const Rating = require('../models/Rating');
const Lease = require('../models/Lease');
const Property = require('../models/Property');
const ActivityLog = require('../models/ActivityLog');

// @desc    Create a rating for a property
// @route   POST /api/ratings
// @access  Private/Tenant
const createRating = async (req, res) => {
    const { propertyId, rating, review } = req.body;

    try {
        // Check if tenant has/had a lease for this property
        const lease = await Lease.findOne({
            propertyId,
            tenantId: req.user._id
        });

        if (!lease) {
            return res.status(403).json({ message: 'You can only rate properties you have lived in' });
        }

        // Check if rating already exists
        const existingRating = await Rating.findOne({
            propertyId,
            tenantId: req.user._id
        });

        if (existingRating) {
            return res.status(400).json({ message: 'You have already rated this property' });
        }

        const newRating = await Rating.create({
            propertyId,
            tenantId: req.user._id,
            rating,
            review
        });

        await ActivityLog.create({
            userId: req.user._id,
            action: 'CREATE_RATING',
            details: `Rated property ${propertyId} with ${rating} stars`
        });

        res.status(201).json(newRating);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all ratings for a property
// @route   GET /api/ratings/property/:id
// @access  Public
const getPropertyRatings = async (req, res) => {
    try {
        const ratings = await Rating.find({ propertyId: req.params.id })
            .populate('tenantId', 'name')
            .sort({ createdAt: -1 });

        const avgRating = ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            : 0;

        res.json({
            ratings,
            averageRating: avgRating.toFixed(1),
            totalRatings: ratings.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get ratings submitted by current tenant
// @route   GET /api/ratings/my
// @access  Private/Tenant
const getMyRatings = async (req, res) => {
    try {
        const ratings = await Rating.find({ tenantId: req.user._id })
            .populate('propertyId', 'title location')
            .sort({ createdAt: -1 });

        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get properties tenant can rate (has lived in but not rated)
// @route   GET /api/ratings/available
// @access  Private/Tenant
const getAvailableToRate = async (req, res) => {
    try {
        // Get all leases for this tenant
        const leases = await Lease.find({ tenantId: req.user._id })
            .populate('propertyId', 'title location');

        // Get properties already rated
        const ratedPropertyIds = await Rating.find({ tenantId: req.user._id })
            .distinct('propertyId');

        // Filter out already rated properties
        const availableProperties = leases
            .filter(lease => !ratedPropertyIds.some(id => id.equals(lease.propertyId._id)))
            .map(lease => lease.propertyId);

        res.json(availableProperties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createRating,
    getPropertyRatings,
    getMyRatings,
    getAvailableToRate,
};
