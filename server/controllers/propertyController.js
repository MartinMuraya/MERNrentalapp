const Property = require('../models/Property');
const ActivityLog = require('../models/ActivityLog');
const Lease = require('../models/Lease');
const User = require('../models/User');
const generateShortId = require('../utils/generateShortId');

// @desc    Create a new property
// @route   POST /api/properties
// @access  Private/Landlord
const createProperty = async (req, res) => {
    const { title, description, location, amenities, units } = req.body;

    try {
        const property = new Property({
            landlordId: req.user._id,
            title,
            description,
            location,
            amenities,
            units, // Array of unit objects
            // images: req.files // To be implemented with multer/upload logic later, assume URLs for now
        });

        const createdProperty = await property.save();

        await ActivityLog.create({
            userId: req.user._id,
            action: 'CREATE_PROPERTY',
            details: `Created property ${createdProperty.title}`,
        });

        res.status(201).json(createdProperty);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all properties for logged in landlord
// @route   GET /api/properties/my
// @access  Private/Landlord
const getMyProperties = async (req, res) => {
    try {
        const properties = await Property.find({ landlordId: req.user._id }).sort({ createdAt: -1 });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get property by ID
// @route   GET /api/properties/:id
// @access  Private/Landlord
const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (property) {
            if (property.landlordId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized' });
            }
            res.json(property);
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private/Landlord
const updateProperty = async (req, res) => {
    const { title, description, location, amenities } = req.body;

    try {
        const property = await Property.findById(req.params.id);

        if (property) {
            if (property.landlordId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            property.title = title || property.title;
            property.description = description || property.description;
            property.location = location || property.location;
            property.amenities = amenities || property.amenities;
            // Note: Updating units usually requires more complex logic (adding/removing), simplified for now

            const updatedProperty = await property.save();

            await ActivityLog.create({
                userId: req.user._id,
                action: 'UPDATE_PROPERTY',
                details: `Updated property ${updatedProperty.title}`,
            });

            res.json(updatedProperty);
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private/Landlord
const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (property) {
            if (property.landlordId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            await property.deleteOne();

            await ActivityLog.create({
                userId: req.user._id,
                action: 'DELETE_PROPERTY',
                details: `Deleted property ${property.title}`,
            });

            res.json({ message: 'Property removed' });
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Assign tenant to unit
// @route   POST /api/properties/:id/units/:unitId/assign
// @access  Private/Landlord
const assignTenant = async (req, res) => {
    const { email, startDate, endDate, rentAmount, depositAmount } = req.body;
    const { id: propertyId, unitId } = req.params;

    try {
        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        if (property.landlordId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const tenant = await User.findOne({ email, role: 'tenant' });
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }

        // Find the unit
        const unit = property.units.id(unitId);
        if (!unit) {
            return res.status(404).json({ message: 'Unit not found' });
        }

        if (unit.status !== 'available') {
            return res.status(400).json({ message: 'Unit is not available' });
        }

        // Create Lease
        const lease = await Lease.create({
            propertyId,
            unitId: unitId, // Storing subdoc ID string or custom ID
            tenantId: tenant._id,
            startDate,
            endDate,
            rentAmount: rentAmount || unit.rentAmount,
            depositAmount: depositAmount || 0,
            status: 'active'
        });

        // Update Unit
        unit.status = 'occupied';
        unit.tenantId = tenant._id;
        await property.save();

        await ActivityLog.create({
            userId: req.user._id,
            action: 'ASSIGN_TENANT',
            details: `Assigned ${tenant.email} to Unit ${unit.unitNumber} in ${property.title}`,
        });

        res.json({ message: 'Tenant assigned successfully', lease });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Generate invite link for a unit
// @route   POST /api/properties/:id/units/:unitId/invite
// @access  Private/Landlord
const generateInvite = async (req, res) => {
    const { id, unitId } = req.params;

    try {
        const property = await Property.findById(id);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        if (property.landlordId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const unit = property.units.id(unitId);
        if (!unit) return res.status(404).json({ message: 'Unit not found' });

        // Generate code if not exists
        if (!unit.inviteCode) {
            unit.inviteCode = generateShortId(8);
            await property.save();
        }

        const inviteLink = `http://localhost:5173/join/${unit.inviteCode}`;

        res.json({
            inviteCode: unit.inviteCode,
            inviteLink
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createProperty,
    getMyProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    assignTenant,
    generateInvite,
};

