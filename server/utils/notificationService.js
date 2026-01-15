const ActivityLog = require('../models/ActivityLog');

/**
 * Sends a notification to a user.
 * @param {Object} user - The user object (must contain email/phone).
 * @param {string} type - 'email' or 'sms'.
 * @param {string} subject - Subject line (for email) or header.
 * @param {string} message - Body of the message.
 */
const sendNotification = async (user, type, subject, message) => {
    // 1. Log to Console (Simulation)
    console.log(`[NOTIFICATION SERVICE] Sending ${type.toUpperCase()} to ${user.email} (${user.phone})`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log('------------------------------------------------');

    // 2. In a real app, call Twilio/SendGrid here
    // await twilioClient.messages.create({ ... });

    // 3. Log to DB for audit trail
    try {
        await ActivityLog.create({
            userId: user._id,
            action: `NOTIFICATION_SENT_${type.toUpperCase()}`,
            details: `Sent ${subject} to ${user.email}`,
        });
    } catch (error) {
        console.error("Failed to log notification", error);
    }
};

module.exports = { sendNotification };
