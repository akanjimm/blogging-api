const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require("bcrypt");


// Define a schema
const Schema = mongoose.Schema;

// Define blog schema
const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Invalid email'],
        trim: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minLength: 6,
        trim: true,
    }
}, { timestamps: true });

// Validate unique fields
UserSchema.plugin(uniqueValidator, { message: 'already taken.' });

// Hash password before saving to database
UserSchema.pre("save", async function (next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

// Method to verify password inputed by user during login
UserSchema.methods.isPasswordVerified = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// UserSchema.methods.isPasswordCorrect = async function (inputPassword) {
//     const isCorrect = await bcrypt.compare(inputPassword, this.password);
//     return isCorrect;
//   };

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;