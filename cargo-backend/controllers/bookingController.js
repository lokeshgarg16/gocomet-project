const Booking = require('../models/Booking');
const EventLog = require('../models/EventLog');
const { acquireLock, releaseLock } = require('../middleware/lockManager');

// 1. Create Booking (Requirement 2)
exports.createBooking = async (req, res) => {
    try {
        const { ref_id, origin, destination, pieces, weight_kg, flight_ids } = req.body;

        // Check if ref_id already exists to prevent crash
        const existing = await Booking.findOne({ where: { ref_id } });
        if (existing) {
            return res.status(400).json({ error: "Booking reference ID already exists." });
        }

        const booking = await Booking.create({
            ref_id,
            origin,
            destination,
            pieces: pieces || 1,
            weight_kg,
            flight_ids: flight_ids || [],
            status: 'BOOKED'
        });

        // Record initial event in timeline (Requirement 2b)
        await EventLog.create({
            booking_id: booking.id,
            event_type: 'BOOKED',
            location: origin,
            details: `Initial booking created for ${origin} to ${destination}.`
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Update Status (Requirement 2-Depart, 3-Arrive, 6-Cancel)
exports.updateStatus = async (req, res) => {
    const { ref_id, status, location, details } = req.body;

    if (!ref_id || !status) {
        return res.status(400).json({ error: "ref_id and status are required." });
    }

    // Concurrency Control: Distributed Lock (NFR 1)
    const lockAcquired = await acquireLock(ref_id);
    if (!lockAcquired) {
        return res.status(423).json({ error: "Booking is currently being updated. Please try again." });
    }

    try {
        const booking = await Booking.findOne({ where: { ref_id } });
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        // Requirement 6b: Cannot cancel if already arrived/delivered
        if (status === 'CANCELLED' && ['ARRIVED', 'DELIVERED'].includes(booking.status)) {
            return res.status(400).json({ error: "Cannot cancel a booking that has already arrived at destination." });
        }

        // Update status in main Booking table
        await booking.update({ status });

        // Record event in timeline (Requirement 2b & 3b)
        await EventLog.create({
            booking_id: booking.id,
            event_type: status,
            location: location || "In Transit",
            details: details || `Status manually updated to ${status}`
        });

        res.json({ message: `Booking status updated to ${status}`, booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Always release the lock so other users can update
        await releaseLock(ref_id);
    }
};

// 3. Get Booking History (Requirement 5)
exports.getHistory = async (req, res) => {
    try {
        const { ref_id } = req.params;

        const booking = await Booking.findOne({
            where: { ref_id },
            include: [{
                model: EventLog,
                as: 'Timeline', // Alias must match your association in server.js
            }],
            // Order timeline by timestamp ascending (chronological)
            order: [[ { model: EventLog, as: 'Timeline' }, 'createdAt', 'ASC']]
        });

        if (!booking) {
            return res.status(404).json({ error: "No record found for this Reference ID." });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};