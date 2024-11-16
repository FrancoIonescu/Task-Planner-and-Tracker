const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Utilizator = sequelize.define('Utilizator', {
    nume: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parola: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    rol: {
        type: DataTypes.ENUM('admin', 'manager', 'executant'),
        allowNull: false
    },
    manager_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'utilizatori',
            key: 'id'
        }
    }
}, {
    tableName: 'utilizatori',
    timestamps: false
});

module.exports = Utilizator;
