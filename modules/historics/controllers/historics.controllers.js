const HistoricsModel= require('../models/historics.models');
const MedicationModel = require('../../medications/models/medications.models');
const { Sequelize, Op } = require('sequelize');

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

exports.filterHistoric = async (req, res) => {
  const { term } = req.query;

  try {
    if (!term || term.trim() === '') {
      const historics = await HistoricsModel.findAll({
        order: [['createdAt', 'DESC']],
        include: [{
          model: MedicationModel,
          as: 'medications',
          attributes: ['name', 'description', 'type'],
          required: false
        }]
      });

      return res.status(200).json({
        success: true,
        data: historics,
        count: historics.length
      });
    }

    const searchTerm = `%${term}%`;
    
    const historics = await HistoricsModel.findAll({
      where: {
        [Op.or]: [
          { ID: { [Op.like]: searchTerm } },
          { medicationId: { [Op.like]: searchTerm } },
          { statusHistoric: { [Op.like]: searchTerm } },
          { quantityMedication: { [Op.like]: searchTerm } },
          Sequelize.where(
            Sequelize.fn('DATE_FORMAT', Sequelize.col('dateDeliver'), '%Y-%m-%d'),
            { [Op.like]: searchTerm }
          ),
          Sequelize.where(
            Sequelize.col('medications.name'), 
            { [Op.like]: searchTerm }
          ),
          Sequelize.where(
            Sequelize.col('medications.type'), 
            { [Op.like]: searchTerm }
          ),
          Sequelize.where(
            Sequelize.col('medications.description'), 
            { [Op.like]: searchTerm }
          )
        ]
      },
      include: [{
        model: MedicationModel,
        as: 'medications',
        attributes: ['name', 'description', 'type'],
        required: false
      }],
      order: [['dateDeliver', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: historics,
      count: historics.length
    });

  } catch (error) {
    console.error('Error searching historics:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur de serveur lors de la récupération des historiques',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
};