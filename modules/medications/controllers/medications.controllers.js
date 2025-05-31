const MedicationModel = require('../models/medications.models');
const { where } = require('sequelize');

exports.createMedication = async (req, res) => {
  try {
    const { arrivalDate, name, description, type, quantity } = req.body;

    const existingMedication = await MedicationModel.findOne({ where: { name } });

    if (existingMedication) {
      return res.status(400).json({ message: 'Ce médicament existe déjà.' });
    }

    const newMedication = await MedicationModel.create({
      arrivalDate,
      name,
      description,
      type,
      quantity,
    });

    return res.status(201).json({
      message: 'Médicament créé avec succès.',
      data: newMedication,
    });

  } catch (error) {
    console.error(`Erreur de création de médicament : ${error}`);
    return res.status(201).json({
      message: 'Problème lors de la création du médicament.',
      error: error.message,
    });
  }
};

exports.storeMedication = async (req, res) => {
    try {
      const { ID, quantity } = req.body;
  
      const medication = await MedicationModel.findByPk(ID);
  
      if (!medication) {
        return res.status(404).json({ message: 'Ce médicament n\'existe pas.' });
      }
  
      medication.quantity += quantity;
      await medication.save();
  
      return res.status(200).json({
        message: 'Quantité du médicament mise à jour avec succès.',
        data: medication,
      });
  
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du médicament : ${error}`);
      return res.status(500).json({
        message: 'Problème lors de la mise à jour du médicament.',
        error: error.message,
      });
    }
  };

