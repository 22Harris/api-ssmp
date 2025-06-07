const express = require('express');
const router = express.Router();

const medicationsController = require('../controllers/medications.controllers');
const authMiddleware = require('../../../middlewares/authentications.middlewares')

router.post('/create-medication', authMiddleware, medicationsController.createMedication);
router.patch('/store-medication/:ID', authMiddleware, medicationsController.storeMedication);
router.patch('/update-medication/:ID', authMiddleware, medicationsController.updateMedication);

router.get('/get-medication/:ID', authMiddleware, medicationsController.getMedication);
router.get('/get-all-medications', authMiddleware, medicationsController.getAllMedications);
router.get('/search-medication-by-term', authMiddleware, medicationsController.searchMedication);
router.patch('/deliver-medication/:id', authMiddleware, medicationsController.deliverMedication);
  
module.exports = router;