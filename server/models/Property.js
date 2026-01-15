const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
    unitNumber: { type: String, required: true },
    type: { type: String, required: true }, // e.g., 1BHK, 2BHK
    rentAmount: { type: Number, required: true },
    status: { type: String, enum: ['available', 'occupied', 'maintenance'], default: 'available' },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    inviteCode: { type: String, unique: true, sparse: true }, // generated unique code
});

const propertySchema = new mongoose.Schema({
    landlordId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    location: {
        type: String,
        required: true,
    },
    amenities: [String],
    images: [String],
    units: [unitSchema],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
