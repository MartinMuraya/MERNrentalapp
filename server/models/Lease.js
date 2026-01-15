const mongoose = require('mongoose');

const leaseSchema = new mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true,
    },
    unitId: {
        type: String, // Or ObjectId if subdocument IDs are strictly managed
        required: true,
    },
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
    },
    rentAmount: {
        type: Number,
        required: true,
    },
    depositAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'terminated', 'expired'],
        default: 'active',
    },
    terms: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Lease = mongoose.model('Lease', leaseSchema);

module.exports = Lease;
