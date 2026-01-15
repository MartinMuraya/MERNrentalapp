const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    leaseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lease',
        required: true,
    },
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    mpesaTransactionId: {
        type: String,
        unique: true,
        sparse: true, // Allow null/undefined if payment is manual or failed init
    },
    checkoutRequestID: {
        type: String, // For Daraja STK Push tracking
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    paymentDate: {
        type: Date,
    },
    paymentType: {
        type: String,
        enum: ['Rent', 'Deposit', 'Maintenance'],
        default: 'Rent',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
