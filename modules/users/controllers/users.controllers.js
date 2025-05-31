const UserModel = require('../models/users.models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { where } = require('sequelize');

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Mot de passe incorrect.' });
    }

    const token = jwt.sign({ ID: user.ID }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      token,
      user: {
        ID: user.ID,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Erreur de connexion :', error);
    res.status(500).json({ message: 'Connexion impossible', error });
  }
};

exports.createUser = async(req, res) => {
    const {email, password} = req.body;

    try{

        const existingUser = await UserModel.findOne({where: {email}});
        if(existingUser) return res.status(400).json({message : 'Cet email est déjà utilisé'});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await UserModel.create({
            email,
            password: hashedPassword
        });

    }catch(error){
        console.log('Erreur de création d"utilisateur');
        res.status(500).json({message: 'Création impossible', error});
    }
};