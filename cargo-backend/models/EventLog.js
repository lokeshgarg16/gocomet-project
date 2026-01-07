const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EventLog = sequelize.define('EventLog', {
    booking_id: { type: DataTypes.INTEGER, allowNull: false },
    event_type: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING },
    details: { type: DataTypes.TEXT },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = EventLog;