const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Flight = sequelize.define('Flight', {
    flight_number: { type: DataTypes.STRING, allowNull: false },
    airline_name: { type: DataTypes.STRING },
    departure_datetime: { type: DataTypes.DATE, allowNull: false },
    arrival_datetime: { type: DataTypes.DATE, allowNull: false },
    origin: { type: DataTypes.STRING(3), allowNull: false },
    destination: { type: DataTypes.STRING(3), allowNull: false }
}, {
    indexes: [{ fields: ['origin', 'destination', 'departure_datetime'] }]
});

module.exports = Flight;