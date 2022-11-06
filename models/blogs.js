const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Define a schema
const Schema = mongoose.Schema;

// Define Blog Schema
const BlogSchema = new Schema({
    title: {
        type: String,
        required: [true, "This is required"],
        unique: true,
        minLength: 20,
        maxLength: 59,
        trim: true
    },
    description: {
        type: String,
        // minLength: 150,
        maxLength: 200,
        trim: true
    },
    author: {
        type: Schema.Types.ObjectId
    },
    state: {
        type: String,
        default: "draft",
        enum: ["draft", "published"]
    },
    read_count: {
        type: Number,
        default: 0
    },
    reading_time: {
        type: Number
    },
    tags: {
        type: [String]
    },
    body: {
        type: String,
        required: [true, "This is required"]
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
}, { timestamps: true });

// Validate unique fields
BlogSchema.plugin(uniqueValidator, { message: 'already taken.' });

const BlogModel = mongoose.model('blogs', BlogSchema);

module.exports = BlogModel;