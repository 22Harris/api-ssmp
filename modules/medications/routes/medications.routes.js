const express = require('express');
const router = express.Router();

const medicationsController = require('../controllers/medications.controllers');
const authMiddleware = require('../../../middlewares/authentications.middlewares')

router.post('/create-medication', medicationsController.createMedication);
router.patch('/store-medication/:ID', medicationsController.storeMedication);
router.patch('/update-medication/:ID', medicationsController.updateMedication);

router.get('/get-medication/:id', authMiddleware, medicationsController.getMedication);
router.get('/get-all-medications', authMiddleware, medicationsController.getAllMedications);
router.post('/deliver-medication/:id', authMiddleware, medicationsController.deliverMedication);
  
module.exports = router;