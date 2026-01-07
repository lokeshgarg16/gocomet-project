const { Op } = require('sequelize');
const Flight = require('../models/Flight');

exports.findRoutes = async (origin, destination, date) => {
    const start = new Date(date);
    start.setHours(0,0,0,0);
    const end = new Date(date);
    end.setHours(23,59,59,999);

    // 1. Direct Flights
    const direct = await Flight.findAll({
        where: { origin, destination, departure_datetime: { [Op.between]: [start, end] } }
    });

    // 2. One Transit Route
    const leg1Options = await Flight.findAll({
        where: { origin, departure_datetime: { [Op.between]: [start, end] } }
    });

    for (const l1 of leg1Options) {
        const nextDay = new Date(l1.arrival_datetime);
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(23, 59, 59);

        const l2 = await Flight.findOne({
            where: {
                origin: l1.destination,
                destination: destination,
                departure_datetime: { [Op.gt]: l1.arrival_datetime, [Op.lte]: nextDay }
            }
        });

        if (l2) return { direct, transit: [l1, l2] };
    }

    return { direct, transit: null };
};