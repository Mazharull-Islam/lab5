const express = require('express');
const router = express.Router();
const developerController = require('../controllers/developerController');

router.post('/', developerController.createDeveloper);
router.get('/', developerController.getDevelopers);
router.get('/:id', developerController.getDeveloperById);
router.patch('/:id', developerController.updateDeveloper);
router.delete('/:id', developerController.deleteDeveloper);

module.exports = router;
