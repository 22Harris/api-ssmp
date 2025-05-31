const express = require('express');
const router = express.Router();

const medicationsController = require('../controllers/medications.controllers');

router.post('/create-medication', medicationsController.createMedication);
router.patch('/store-medication/:ID', medicationsController.storeMedication);
router.patch('/update-medication/:ID', medicationsController.updateMedication);

module.exports = router;