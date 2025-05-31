const sequelize = require('./configs/sequelize');
require('dotenv').config();

const medicationRoutes = require('./modules/medications/routes/medications.routes');
app.use('api/medications', medicationRoutes);

const userRoutes = require('./modules/users/routes/users.routes');
app.use('api/users', userRoutes);

const app = express();
app.use(express.json());

const PORT = process.env.PORT;
(async() => {
    try{

        await sequelize.authenticate();
        console.log('Connexion à la base de données réussie');

        await sequelize.sync();
        console.log('Modèles synchronisés');

        app.listen(PORT, () => {
            console.log(`Serveur lancé sur http://localhost:${PORT}`);
        })

    }catch(error){
        console.log(`Erreur de connexion à la base de données : ${PORT}`);
    }
})