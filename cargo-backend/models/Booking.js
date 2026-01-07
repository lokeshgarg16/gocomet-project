const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define('Booking', {
    ref_id: { type: DataTypes.STRING, unique: true, allowNull: false },
    origin: { type: DataTypes.STRING(3) },
    destination: { type: DataTypes.STRING(3) },
    pieces: { type: DataTypes.INTEGER },
    weight_kg: { type: DataTypes.INTEGER },
    status: { 
        type: DataTypes.ENUM('BOOKED', 'DEPARTED', 'ARRIVED', 'DELIVERED', 'CANCELLED'),
        defaultValue: 'BOOKED'
    },
    flight_ids: { type: DataTypes.JSON } 
});

module.exports = Booking;