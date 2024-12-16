const Utilizator = require('./utilizator');
const Task = require('./task');

// Un manager poate crea mai multe task-uri
Utilizator.hasMany(Task, { foreignKey: 'creat_de', as: 'taskuri_create' });
Task.belongsTo(Utilizator, { foreignKey: 'creat_de', as: 'creator' });

// Un executant poate avea multe task-uri alocate
Utilizator.hasMany(Task, { foreignKey: 'alocat_la', as: 'taskuri_alocate' });
Task.belongsTo(Utilizator, { foreignKey: 'alocat_la', as: 'executant' });
