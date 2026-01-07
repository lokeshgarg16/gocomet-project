// In your server.js or models/index.js
const Booking = require('./models/Booking');
const EventLog = require('./models/EventLog');

Booking.hasMany(EventLog, { as: 'Timeline', foreignKey: 'booking_id' });
EventLog.belongsTo(Booking, { foreignKey: 'booking_id' });