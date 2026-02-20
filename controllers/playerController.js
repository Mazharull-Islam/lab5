const Player = require('../models/playerModel');

const createPlayer = async (req, res) => {
    try {
        const player = new Player(req.body);
        await player.save();
        res.status(201).json(player);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getPlayers = async (req, res) => {
    try {
        const { membershipLevel, active } = req.query;
        let filter = {};
        if (membershipLevel) filter.membershipLevel = membershipLevel;
        if (active !== undefined) filter.active = active === 'true';

        const players = await Player.find(filter);
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPlayerById = async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        if (!player) return res.status(404).json({ message: "Player not found" });
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePlayer = async (req, res) => {
    try {
        const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!player) return res.status(404).json({ message: "Player not found" });
        res.status(200).json(player);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deletePlayer = async (req, res) => {
    try {
        const player = await Player.findByIdAndDelete(req.params.id);
        if (!player) return res.status(404).json({ message: "Player not found" });
        res.status(200).json({ message: "Player deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createPlayer,
    getPlayers,
    getPlayerById,
    updatePlayer,
    deletePlayer
};
