const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Task = sequelize.define('Task', {
    descriere: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    creat_de: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'utilizatori',
            key: 'id'
        }
    },
    alocat_la: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'utilizatori',
            key: 'id'
        }
    },
    stare: {
        type: DataTypes.ENUM('OPEN', 'PENDING', 'COMPLETED', 'CLOSED'),
        defaultValue: 'OPEN'
    },
    creat_la: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    finalizat_la: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'taskuri',
    timestamps: false
});

module.exports = Task;
