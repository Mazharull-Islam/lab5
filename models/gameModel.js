const mongoose = require('mongoose')

const Schema = mongoose.Schema

const gameSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true,
    enum: ['RPG', 'FPS', 'Puzzle', 'Strategy', 'Simulation']
  },
  rating: {
    type: Number,
    min: 0,
    max: 10
  },
  multiplayer: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

module.exports = mongoose.model('Game', gameSchema)