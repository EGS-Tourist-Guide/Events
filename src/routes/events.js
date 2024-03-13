import express from 'express';
import authValidator from '../middleware/authValidation.js';
import dataValidator from '../middleware/dataValidation.js';
import eventController from '../controllers/eventController.js';

// Create a new instance of the express router and apply authentication middleware to all routes
const routerEvents = express.Router();
routerEvents.use(authValidator.isValidAuthKey);

// Define the routes, apply data validation middleware and call the appropriate controller method
routerEvents.post('/events', dataValidator.isValidBody, async (req, res) => {
    await eventController.createEvent(req, res);
});

routerEvents.get('/events', dataValidator.isValidQuery, async (req, res) => {
    await eventController.readAllEvents(req, res);
});

routerEvents.get('/events/:uuid', dataValidator.isValidUUID, async (req, res) => {
    await eventController.readEvent(req, res);
});

routerEvents.put('/events/:uuid', dataValidator.isValidUUID, dataValidator.isValidBody, async (req, res) => {
    await eventController.updateEvent(req, res);
});

routerEvents.delete('/events/:uuid', dataValidator.isValidUUID, async (req, res) => {
    await eventController.deleteEvent(req, res);
});

// Export the router
export default routerEvents;
