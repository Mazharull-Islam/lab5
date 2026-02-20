const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        min: 12,
        max: 100
    },
    membershipLevel: {
        type: String,
        enum: ['free', 'premium', 'elite'],
        default: 'free'
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
