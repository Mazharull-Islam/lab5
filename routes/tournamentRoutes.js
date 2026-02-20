const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');

router.post('/register', tournamentController.registerTournament);
router.get('/', tournamentController.getTournaments);

module.exports = router;
