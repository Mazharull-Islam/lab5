const Tournament = require('../models/tournamentModel');
const Player = require('../models/playerModel');
const Game = require('../models/gameModel');
const Developer = require('../models/developerModel');

const registerTournament = async (req, res) => {
    try {
        const { playerId, developerId, gameId, tournamentDate, notes } = req.body;

        // 1. Validate Player Membership
        const player = await Player.findById(playerId);
        if (!player) return res.status(404).json({ message: "Player not found" });
        if (!['premium', 'elite'].includes(player.membershipLevel)) {
            return res.status(403).json({ message: "Only premium or elite members can register for tournaments" });
        }

        // 2. Check if developer and game exist
        const developer = await Developer.findById(developerId);
        if (!developer) return res.status(404).json({ message: "Developer not found" });

        const game = await Game.findById(gameId);
        if (!game) return res.status(404).json({ message: "Game not found" });

        // 3. Verifies no scheduling conflicts (same player, same date)
        const startOfDay = new Date(tournamentDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(tournamentDate);
        endOfDay.setHours(23, 59, 59, 999);

        const conflict = await Tournament.findOne({
            playerId,
            tournamentDate: { $gte: startOfDay, $lte: endOfDay }
        });

        if (conflict) {
            return res.status(409).json({ message: "Player already has a tournament registered on this date" });
        }

        // 4. Create registration record
        const registration = new Tournament({
            playerId,
            developerId,
            gameId,
            tournamentDate,
            notes
        });

        await registration.save();

        res.status(201).json({
            message: "Tournament registration successful",
            registration
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getTournaments = async (req, res) => {
    try {
        const { gameId, developerId, status } = req.query;
        let filter = {};
        if (gameId) filter.gameId = gameId;
        if (developerId) filter.developerId = developerId;
        if (status) filter.status = status;

        const tournaments = await Tournament.find(filter)
            .populate('playerId', 'name email')
            .populate('developerId', 'name')
            .populate('gameId', 'title genre');

        res.status(200).json(tournaments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerTournament,
    getTournaments
};
