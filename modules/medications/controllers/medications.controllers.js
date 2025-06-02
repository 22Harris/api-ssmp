const MedicationModel = require('../models/medications.models');
const { createHistorics } = require('../../historics/controllers/historics.controllers');


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

    // Création de l'historique lié
    await createHistorics({
      dateDeliver: arrivalDate, // correspond à la date d'entrée
      nameMedication: name,
      typeMedication: type,
      statusHistoric: 'entré', // statut de création
      quantityMedication: quantity,
      medicationId: newMedication.ID
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

    //Historique  de store
    await createHistorics({
      dateDeliver: new Date(),
      nameMedication: medication.name,
      typeMedication: medication.type,
      statusHistoric: 'approvisionnement',
      quantityMedication: parsedQuantity,
      medicationId: medication.ID
    });

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

    //Historique de modification
    await createHistorics({
      dateDeliver: new Date(), // date de modification
      nameMedication: updates.name || medication.name,
      typeMedication: updates.type || medication.type,
      statusHistoric: 'modification',
      quantityMedication: medication.quantity,
      medicationId: medication.ID
    });

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

exports.deliverMedication = async (req,res) =>{
  try {
    const medicationId=req.params.id;
    const {quantityToDeliver}=req.body //quantité entrée dans vente

    if(!quantityToDeliver || quantityToDeliver <= 0){
      return res.status(400).json({message:"Quantité invalide"});
    }

    const medication= await MedicationModel.findByPk(medicationId);
    if(!medication){
      return res.status(400).json({message:"Medicament non trouvé"});
    }
    if(medication.quantity===null || medication.quantity<quantityToDeliver){
      return res.status(400).json({message:"Stock insuffisant"});
    }

    medication.quantity-=quantityToDeliver;
    await medication.save();

    // Création de l'historique après mise à jour du stock
    await createHistorics({
      dateDeliver: new Date(),
      nameMedication: medication.name,
      typeMedication: medication.type,
      statusHistoric: 'vendu',
      quantityMedication: quantityToDeliver,  // quantité vendue
      medicationId: medication.ID
    });

    return res.status(200).json({
      success:true,
      message: "Medicament délivré avec succés",
      data: medication
    });

  }catch(error){
    console.error("Erreur lors de la livraison du médicament: ", error);
    return res.status(500).json({
      success:false,
      message: "error server",
    });
  }

}