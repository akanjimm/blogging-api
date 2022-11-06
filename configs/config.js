require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    MONGO_DB_CONNECTION_URL: process.env.MONGO_DB_CONNECTION_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY_TIME: process.env.JWT_EXPIRY_TIME
}
