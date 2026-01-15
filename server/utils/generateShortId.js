const crypto = require('crypto');

const generateShortId = (length = 8) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
};

module.exports = generateShortId;
