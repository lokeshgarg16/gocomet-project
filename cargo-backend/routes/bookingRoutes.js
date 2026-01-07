const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const flightController = require('../controllers/flightController');

// Ensure these functions actually exist in your controller files!
router.get('/search-flights', flightController.getAvailableRoutes);
router.post('/create', bookingController.createBooking);
router.post('/update-status', bookingController.updateStatus);
router.get('/track/:ref_id', bookingController.getHistory);

module.exports = router;