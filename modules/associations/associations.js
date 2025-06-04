const Medication = require('../medications/models/medications.models');
const Historics = require('../historics/models/historics.models');


Medication.hasMany(Historics, {
  foreignKey: 'medicationId',
  as: 'historics',
});

Historics.belongsTo(Medication, {
  foreignKey: 'medicationId',
  as: 'medications',
});
