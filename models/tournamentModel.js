const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    developerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Developer',
        required: true
    },
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    tournamentDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['registered', 'completed', 'cancelled'],
        default: 'registered'
    },
    notes: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Tournament', tournamentSchema);
