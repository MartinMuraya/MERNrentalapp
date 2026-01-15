const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true,
    },
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    review: {
        type: String,
        maxlength: 500,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Ensure a tenant can only rate a property once
ratingSchema.index({ propertyId: 1, tenantId: 1 }, { unique: true });

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
