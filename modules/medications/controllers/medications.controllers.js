const MedicationModel = require('../models/medications.models');

exports.createMedication = async (req, res) => {
  const { arrivalDate, name, description, type, quantity = 0 } = req.body;

  // Validation des données
  if (!arrivalDate || !name || !type) {
    return res.status(400).json({ 
      message: 'Les champs arrivalDate, name et type sont obligatoires.' 
    });
  }

  try {
    // Vérification de l'existence du médicament
    const existingMedication = await MedicationModel.findOne({ where: { name } });
    if (existingMedication) {
      return res.status(409).json({ 
        message: 'Ce médicament existe déjà.',
        existingId: existingMedication.ID 
      });
    }

    // Création du médicament
    const newMedication = await MedicationModel.create({
      arrivalDate,
      name,
      description,
      type,
      quantity: Math.max(0, quantity) // Garantit une quantité positive
    });

    return res.status(201).json({
      success: true,
      message: 'Médicament créé avec succès.',
      data: newMedication
    });

  } catch (error) {
    console.error('Error creating medication:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du médicament',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.storeMedication = async (req, res) => {
  const { ID } = req.params;
  const { quantity } = req.body;

  if (quantity === undefined || isNaN(quantity)) {
    return res.status(400).json({ 
      message: 'La quantité est requise et doit être un nombre.' 
    });
  }

  const parsedQuantity = parseFloat(quantity);
  if (parsedQuantity <= 0) {
    return res.status(400).json({ 
      message: 'La quantité doit être un nombre positif.' 
    });
  }

  try {

    const medication = await MedicationModel.findByPk(ID);
    if (!medication) {
      return res.status(404).json({ 
        message: 'Médicament non trouvé.' 
      });
    }

    const newQuantity = (medication.quantity || 0) + parsedQuantity;
    await medication.update({ quantity: newQuantity });

    return res.status(200).json({
      success: true,
      message: 'Stock mis à jour avec succès.',
      data: {
        previousQuantity: medication.quantity,
        addedQuantity: parsedQuantity,
        newQuantity
      }
    });

  } catch (error) {
    console.error('Error updating medication stock:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du stock'
    });
  }
};

exports.updateMedication = async (req, res) => {
  const { ID } = req.params;
  const { arrivalDate, name, description, type } = req.body;

  try {
    const medication = await MedicationModel.findByPk(ID);
    if (!medication) {
      return res.status(404).json({ 
        message: 'Médicament non trouvé.' 
      });
    }

    if (name && name !== medication.name) {
      const existingMed = await MedicationModel.findOne({ where: { name } });
      if (existingMed) {
        return res.status(409).json({ 
          message: 'Ce nom est déjà utilisé par un autre médicament.',
          conflictingId: existingMed.ID 
        });
      }
    }

    const updates = {};
    if (arrivalDate) updates.arrivalDate = arrivalDate;
    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (type) updates.type = type;

    await medication.update(updates);

    return res.status(200).json({
      success: true,
      message: 'Médicament mis à jour avec succès.',
      data: medication
    });

  } catch (error) {
    console.error('Error updating medication:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du médicament'
    });
  }
};

exports.getMedication = async (req, res) => {
  try {
    const medication = await MedicationModel.findByPk(req.params.ID);
    if (!medication) {
      return res.status(404).json({ 
        message: 'Médicament non trouvé.' 
      });
    }
    return res.status(200).json({
      success: true,
      data: medication
    });
  } catch (error) {
    console.error('Error fetching medication:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du médicament'
    });
  }
};

exports.getAllMedications = async (req, res) => {
  try{
    const medications = await MedicationModel.findAll();
    return res.status(200).json({
      success: true,
      data: medications
    });

  }catch(error){
    console.log('Error fetching all medications : ', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des médicaments'
    })
  }
}