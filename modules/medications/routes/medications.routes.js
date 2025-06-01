const express = require('express');
const router = express.Router();

const medicationsController = require('../controllers/medications.controllers');
const authMiddleware = require('../../../middlewares/authentications.middlewares')

router.post('/create-medication', authMiddleware, medicationsController.createMedication);
router.patch('/store-medication/:id', authMiddleware, medicationsController.storeMedication);
router.patch('/update-medication/:id', authMiddleware, medicationsController.updateMedication);
router.get('/get-medication/:id', authMiddleware, medicationsController.getMedication);
router.get('get-all-medications', authMiddleware, medicationsController.getAllMedications);

module.exports = router;