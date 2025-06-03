const HistoricsModel= require('../models/historics.models');

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

exports.getHistorics= async (req,res) =>{
    try{
        const getAllHistorics= await HistoricsModel.findAll();
        return res.status(200).json({success:true, data: getAllHistorics});
    }catch(error){
        return res.status(500).json({success:false, message: 'Erreur serveur',error:error.message});
    }
};

exports.detailsHistorics= async (req,res)=>{
    const {id}=req.params;
    try{
        const historic= await HistoricsModel.findByPk(id);
        if(!historic){
            return res.status(404).json({message:'Historique non trouvé'});
        }
        return res.status(200).json({success:true, data: historic});
    }catch (error) {
        return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
      }
};