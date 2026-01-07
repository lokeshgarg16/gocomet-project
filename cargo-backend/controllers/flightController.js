const routeService = require('../services/routeService');

exports.getAvailableRoutes = async (req, res) => {
    try {
        const { origin, destination, date } = req.query;
        const routes = await routeService.findRoutes(origin, destination, date);
        res.json(routes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};