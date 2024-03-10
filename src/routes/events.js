import express from 'express';
import authValidator from '../middleware/authValidation.js';
import dataValidator from '../middleware/dataValidation.js';
import eventController from '../controllers/eventController.js';

// Create a new instance of the express router and apply authentication middleware to all routes
const router = express.Router();
router.use(authValidator.isValidAuthKey);

// Define the routes and apply data validation middleware
router.get('/', dataValidator.isValidQuery, async (req, res) => {
    await eventController.getAllEvents(req, res);
});

router.get('/:uuid', dataValidator.isValidUUID, async (req, res) => {
    await eventController.getSingleEvent(req, res);
});

router.post('/', dataValidator.isValidBody, async (req, res) => {
    await eventController.postEvent(req, res);
});

router.put('/:uuid', dataValidator.isValidUUID, dataValidator.isValidBody, async (req, res) => {
    await eventController.putEvent(req, res);
});

router.delete('/:uuid', dataValidator.isValidUUID, async (req, res) => {
    await eventController.deleteEvent(req, res);
});

// Export the router
export default router;
