const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    unitId: {
        type: String, // Storing subdoc ID as string usually easiest for lookup, or ObjectId
        required: true
    },
    issue: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    photoUrl: {
        type: String, // URL to uploaded image
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'resolved', 'rejected'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'emergency'],
        default: 'medium'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);
