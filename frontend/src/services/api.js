import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api/bookings',
});

export const searchFlights = (params) => API.get('/search-flights', { params });
export const createBooking = (data) => API.post('/create', data);
export const trackBooking = (refId) => API.get(`/track/${refId}`);
export const updateStatus = (data) => API.post('/update-status', data);
