const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY_TIME} = require('../configs/config')

function generateJwtToken (user) {
    const payload = { user };
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRY_TIME
    });
    return token;
}

function calcReadingTime (blogBody) {
    const wordCount = blogBody.split(' ').length;
    const estimatedWPM = 238; // According to https://www.researchgate.net/project/How-many-words-do-we-read-per-minute-A-review-and-meta-analysis-of-reading-rate
    let readingTime = wordCount / estimatedWPM;
    readingTime = +readingTime.toFixed(1);
    return readingTime;
}

module.exports = {
    generateJwtToken,
    calcReadingTime
}