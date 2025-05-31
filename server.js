require('dotenv').config();
const express = require('express');
const sequelize = require('./configs/sequelize');

const medicationRoutes = require('./modules/medications/routes/medications.routes');
const userRoutes = require('./modules/users/routes/users.routes');

const app = express();
app.use(express.json());

// Routes
app.use('/api/medications', medicationRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie');

    await sequelize.sync();
    console.log('Modèles synchronisés');

    app.listen(PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erreur de connexion à la base de données :', error.message);
  }
})();
