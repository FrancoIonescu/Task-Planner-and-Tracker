const sequelize = require('./db');
const Utilizator = require('./utilizator');
const Task = require('./task');
require('./asocieri');

sequelize.sync({ force: false }) 
    .then(() => console.log('Tabelele au fost sincronizate cu baza de date'))
    .catch(err => console.error('Eroare la sincronizarea tabelelor:', err));
