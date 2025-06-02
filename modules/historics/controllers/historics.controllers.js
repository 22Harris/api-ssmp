const HistoricsModel= require('../models/historics.models');

exports.createHistorics = async (req, res) => {
    const {
      dateDeliver, 
      nameMedication, 
      typeMedication, 
      statusHistoric, 
      quantityMedication, 
      medicationId
    } = req.body;
    try{
        const historic= await HistoricsModel.create({
            dateDeliver,
            nameMedication,
            typeMedication,
            statusHistoric,
            quantityMedication,
            medicationId
        });
        res.status(201).json({ success: true, data: historic });
    }catch(error){
        console.error('erreur de la creation historic: ',error.message);
        res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
};

exports.getHistorics= async (req,res) =>{
    try{
        const getAllHistorics= await HistoricsModel.findAll();
        res.status(200).json({success:true, data: getAllHistorics});
    }catch(error){
        res.status(500).json({success:false, message: 'Erreur serveur',error:error.message});
    }
};

exports.detailsHistorics= async (req,res)=>{
    const {id}=req.params;
    try{
        const historic= await HistoricsModel.findByPk(id);
        if(!historic){
            return res.status(404).json({message:'Historique non trouvé'});
        }
        res.status(200).json({success:true, data: historic});
    }catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
      }
};