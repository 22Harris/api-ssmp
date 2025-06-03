require('dotenv').config();
const express = require('express');
const sequelize = require('./configs/sequelize');
const cors = require('cors');


const medicationRoutes = require('./modules/medications/routes/medications.routes');
const userRoutes = require('./modules/users/routes/users.routes');
const historicsRoutes = require('./modules/historics/routes/historics.routes');//ity ihany koa

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes API
app.use('/api/medications', medicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/historics', historicsRoutes);


app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.stack);
  res.status(500).json({ 
    message: 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

const PORT = process.env.PORT;
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion DB réussie');

    await sequelize.sync({
      alter: process.env.NODE_ENV === 'development',
      force: false
    });
    console.log('🔄 Modèles synchronisés');


    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
      console.log(`⚙️ Environnement: ${process.env.NODE_ENV || 'development'}`);
    });

  } catch (error) {
    console.error('❌ Erreur de démarrage:', error.message);
    process.exit(1);
  }
})();

// Gestion propre des arrêts
process.on('SIGTERM', () => {
  console.log('🛑 Fermeture propre du serveur');
  sequelize.close().then(() => process.exit(0));
});