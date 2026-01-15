const MaintenanceRequest = require('../models/MaintenanceRequest');
const Property = require('../models/Property');
const ActivityLog = require('../models/ActivityLog');

// @desc    Create a maintenance request
// @route   POST /api/maintenance
// @access  Private/Tenant
const createRequest = async (req, res) => {
    const { propertyId, unitId, issue, description, photoUrl, priority } = req.body;

    try {
        const request = await MaintenanceRequest.create({
            tenantId: req.user._id,
            propertyId,
            unitId,
            issue,
            description,
            photoUrl,
            priority
        });

        await ActivityLog.create({
            userId: req.user._id,
            action: 'MAINTENANCE_REQUEST',
            details: `Reported issue: ${issue}`,
        });

        res.status(201).json(request);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get requests for a landlord's properties
// @route   GET /api/maintenance/landlord
// @access  Private/Landlord
const getLandlordRequests = async (req, res) => {
    try {
        // Find all properties owned by landlord
        const properties = await Property.find({ landlordId: req.user._id }).select('_id');
        const propertyIds = properties.map(p => p._id);

        const requests = await MaintenanceRequest.find({ propertyId: { $in: propertyIds } })
            .populate('tenantId', 'name email phone')
            .populate('propertyId', 'title')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get requests for a tenant
// @route   GET /api/maintenance/my
// @access  Private/Tenant
const getTenantRequests = async (req, res) => {
    try {
        const requests = await MaintenanceRequest.find({ tenantId: req.user._id })
            .populate('propertyId', 'title')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update request status
// @route   PUT /api/maintenance/:id
// @access  Private/Landlord
const updateRequestStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const request = await MaintenanceRequest.findById(req.params.id)
            .populate('propertyId');

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Verify ownership
        if (request.propertyId.landlordId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        request.status = status;
        await request.save();

        // Notify tenant (Stub) - "Email sent to tenant..."

        res.json(request);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createRequest,
    getLandlordRequests,
    getTenantRequests,
    updateRequestStatus
};
