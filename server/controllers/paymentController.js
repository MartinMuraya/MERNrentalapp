const Payment = require('../models/Payment');
const Lease = require('../models/Lease');
const ActivityLog = require('../models/ActivityLog');
const { sendNotification } = require('../utils/notificationService');
const User = require('../models/User'); // Need User model to get phone/email if not populated

// @desc    Initiate M-Pesa Payment (STK Push Stub)
// @route   POST /api/payments/pay
// @access  Private/Tenant
const initiatePayment = async (req, res) => {
    const { leaseId, amount, phoneNumber } = req.body;

    try {
        const lease = await Lease.findById(leaseId);
        if (!lease) {
            return res.status(404).json({ message: 'Lease not found' });
        }

        if (lease.tenantId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // --- M-PESA STUB LOGIC START ---
        // In a real app, we would call Safaricom Daraja API here.
        // For now, we simulate a successful request and create a pending payment.

        // Simulate Daraja Response
        const checkoutRequestID = `ws_${Date.now()}`;
        const mpesaTransactionId = `O${Date.now()}Q`; // Simulated receipt

        // Create Payment Record (Pending/Completed for stub)
        const payment = await Payment.create({
            leaseId: lease._id,
            tenantId: req.user._id,
            amount,
            mpesaTransactionId: mpesaTransactionId,
            checkoutRequestID,
            paymentType: 'Rent',
            status: 'completed', // Auto-complete for testing without real callback
            paymentDate: Date.now()
        });

        await ActivityLog.create({
            userId: req.user._id,
            action: 'PAYMENT_INITIATED',
            details: `Paid KES ${amount} for Lease ${leaseId}`,
        });

        // Notify Tenant
        await sendNotification(req.user, 'sms', 'Payment Success', `Confirmed. We received KES ${amount} for your rent. Ref: ${mpesaTransactionId}.`);
        // --- M-PESA STUB LOGIC END ---

        res.json({
            message: 'Payment processed successfully (STK simulated)',
            payment
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get my payment history
// @route   GET /api/payments/my
// @access  Private/Tenant
const getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ tenantId: req.user._id }).sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { initiatePayment, getMyPayments };
