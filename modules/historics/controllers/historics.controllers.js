const HistoricsModel= require('../models/historics.models');
const MedicationModel = require('../../medications/models/medications.models');

exports.createHistorics = async (req, res) => {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Données de requête invalides'
      });
    }
  
    const { medicationId, dateDeliver, statusHistoric, quantityMedication } = req.body;
  
    if (!medicationId || !dateDeliver || !statusHistoric || !quantityMedication) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs (medicationId, dateDeliver, statusHistoric, quantityMedication) sont requis'
      });
    }
  
    try {
      const historic = await HistoricsModel.create({
        medicationId,
        dateDeliver: new Date(dateDeliver),
        statusHistoric,
        quantityMedication: Number(quantityMedication),
      });
  
      return res.status(201).json({ 
        success: true, 
        data: historic 
      });
  
    } catch (error) {
      console.error('Erreur de la création historic:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };

exports.getHistorics = async (req, res) => {
  try {
    const historics = await HistoricsModel.findAll();
    
    const historicsWithMedication = await Promise.all(
      historics.map(async historic => {
        const medication = await MedicationModel.findByPk(historic.medicationId, {
          attributes: ['name', 'description', 'type']
        });
        
        return {
          ...historic.toJSON(),
          medication: {
            name: medication.name,
            description: medication.description,
            type: medication.type
          }
        };
      })
    );

    return res.status(200).json({ success: true, data: historicsWithMedication });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur',
      error: error.message 
    });
  }
};

exports.detailsHistorics= async (req,res)=>{
  const { id }=req.params;
  try{
      const historic= await HistoricsModel.findByPk(id, {
        include: {
          model: MedicationModel,
          as: 'medications'
        }
      });

      if(!historic){
        return res.status(404).json({message:'Historique non trouvé'});
      }

      
      return res.status(200).json({success:true, data: historic});
  }catch (error) {
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
};

exports.getByMedication = async (req, res) => {
  const { medicationId } = req.params;
  try {
    const historics = await HistoricsModel.findAll({ where: { medicationId }, include: {
      model: MedicationModel,
      as: 'medications'
    } });
    
    if (historics.length === 0) {
      return res.status(404).json({ message: "Aucun historique trouvé pour ce médicament." });
    }

    return res.status(200).json({ success: true, data: historics });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

