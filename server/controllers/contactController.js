const nodemailer = require('nodemailer');

exports.sendContactEmail = async (req, res) => {
    const { firstName, lastName, email, message } = req.body;

    // Basic validation
    if (!firstName || !email || !message) {
        return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    try {
        // Create transporter
        // NOTE: For Gmail, you might need an App Password if 2FA is on
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // e.g. yourcompany@gmail.com
                pass: process.env.EMAIL_PASS  // e.g. your app password
            }
        });

        // Email options
        const mailOptions = {
            from: `"${firstName} ${lastName}" <${email}>`, // Sent "from" the user's name but via our auth
            to: 'barbzrents@gmail.com',
            subject: `New Contact Form Inquiry from ${firstName} ${lastName}`,
            text: `
                Name: ${firstName} ${lastName}
                Email: ${email}

                Message:
                ${message}
            `,
            replyTo: email
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: 'Email sent successfully' });

    } catch (error) {
        console.error('Email send error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send email. Please try again later.',
            error: error.message
        });
    }
};
