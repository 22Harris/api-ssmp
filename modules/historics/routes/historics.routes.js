const express = require('express');
const router = express.Router();

const historicsController = require('../controllers/historics.controllers');
const authMiddleware = require('../../../middlewares/authentications.middlewares');

router.post('/create-historic', authMiddleware, historicsController.createHistorics);
router.get('/get-all-historics', authMiddleware, historicsController.getHistorics);
router.get('/get-historic/:id', authMiddleware, historicsController.detailsHistorics);

module.exports = router;
