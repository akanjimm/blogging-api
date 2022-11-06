const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY_TIME} = require('../config/config')

function generateJwtToken (user) {
    const payload = { user };
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRY_TIME
    });
    return token;
}

module.exports = {
    generateJwtToken
}