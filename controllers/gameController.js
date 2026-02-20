const Game = require('../models/gameModel')

// GET all games
const getGames = async (req, res) => {   // descending order // find({reps: {$gt: 10}})
  const games = await Game.find({}).sort({ createdAt: -1 }) 
  res.status(200).json(games)
}

// GET a single game
const getGame = async (req, res) => {
  const { id } = req.params

  const game = await Game.findById(id)

  if (!game) {
    return res.status(404).json({ error: 'No such game' })
  }

  res.status(200).json(game)
}

// CREATE a new game
const createGame = async (req, res) => {
  const { title, genre, rating, multiplayer } = req.body

  try {
    const game = await Game.create({ title, genre, rating, multiplayer })
    res.status(200).json(game)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// DELETE a game
const deleteGame = async (req, res) => {
  const { id } = req.params

  const game = await Game.findOneAndDelete({ _id: id })

  if (!game) {
    return res.status(400).json({ error: 'No such game' })
  }

  res.status(200).json(game)
}

// UPDATE a game
const updateGame = async (req, res) => {
  const { id } = req.params

  const game = await Game.findOneAndUpdate(
    { _id: id },
    { ...req.body }
  )

  if (!game) {
    return res.status(400).json({ error: 'No such game' })
  }

  res.status(200).json(game)
}

module.exports = {
  getGames,
  getGame,
  createGame,
  deleteGame,
  updateGame
}
