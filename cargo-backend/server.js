const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const bookingRoutes = require('./routes/bookingRoutes');
const Booking = require('./models/Booking');
const EventLog = require('./models/EventLog');

const app = express();
app.use(cors());
app.use(express.json());

Booking.hasMany(EventLog, { as: 'Timeline', foreignKey: 'booking_id' });

app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});