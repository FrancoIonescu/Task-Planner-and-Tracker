require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
});

sequelize.authenticate()
    .then(() => console.log('Conexiunea la MySQL a fost stabilită!'))
    .catch(err => console.error('Nu s-a putut conecta la MySQL:', err));

module.exports = sequelize;
