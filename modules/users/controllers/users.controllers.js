const UserModel = require('../models/users.models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');


const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

const generateAuthTokens = (userId) => {
  const token = jwt.sign(
    { ID: userId },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
  );
  
  const refreshToken = jwt.sign(
    { ID: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );

  return { token, refreshToken };
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email et mot de passe sont requis.'
    });
  }

  try {
    const user = await UserModel.findOne({
      where: {
        email: {
          [Op.iLike]: email
        }
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides.'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides.'
      });
    }

    const { token, refreshToken } = generateAuthTokens(user.ID);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
    });

    return res.status(200).json({
      success: true,
      message: 'Connexion réussie.',
      data: {
        token,
        user: {
          ID: user.ID,
          email: user.email
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.createUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email et mot de passe sont requis.'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Format email invalide.'
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Le mot de passe doit contenir au moins 8 caractères.'
    });
  }

  try {
    const existingUser = await UserModel.findOne({
      where: {
        email: {
          [Op.iLike]: email
        }
      }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Cet email est déjà utilisé.'
      });
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS || 10));
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      email: email,
      password: hashedPassword
    });

    const { token, refreshToken } = generateAuthTokens(newUser.ID);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      success: true,
      message: 'Compte créé avec succès.',
      data: {
        token,
        user: {
          ID: newUser.ID,
          email: newUser.email
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du compte',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


exports.refreshTokenUser = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token manquant.'
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await UserModel.findByPk(decoded.ID);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé.'
      });
    }

    const { token, refreshToken: newRefreshToken } = generateAuthTokens(user.ID);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: 'Token rafraîchi avec succès.',
      token
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(403).json({
      success: false,
      message: 'Refresh token invalide ou expiré.'
    });
  }
};


exports.logoutUser = async (req, res) => {
  res.clearCookie('refreshToken');
  return res.status(200).json({
    success: true,
    message: 'Déconnexion réussie.'
  });
};