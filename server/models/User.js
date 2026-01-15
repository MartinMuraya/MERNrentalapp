const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'landlord', 'tenant'],
        default: 'tenant',
    },
    phone: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'active',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationDocs: [String], // Array of URLs to uploaded docs
    verificationStatus: {
        type: String,
        enum: ['unsubmitted', 'pending', 'verified', 'rejected'],
        default: 'unsubmitted'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
