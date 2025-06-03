const express = require('express');
const router = express.Router();

const historicController = require('../controllers/historics.controllers');
const authMiddleware = require('../../../middlewares/authentications.middlewares');

router.post('/create-historic', authMiddleware, historicController.createHistorics);
router.get('/get-all-historics', authMiddleware, historicController.getHistorics);
router.get('/get-historic/:id', authMiddleware, historicController.detailsHistorics);

module.exports = router;
