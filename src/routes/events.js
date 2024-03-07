// Import necessary dependencies
import express from 'express';
import eventController from '../controllers/eventController';

// Create a new instance of the express router
const router = express.Router();

// Define the routes for all GET requests
router.get('/', async (req, res) => {
    await eventController.getAllEvents(req, res);
});

router.get('/:uuid', async (req, res) => {
    await eventController.getSingleEvent(req, res);
});

// Define the routes for all POST requests
router.post('/', async (req, res) => {
    await eventController.postEvent(req, res);
});

// Define the routes for all PUT requests
router.put('/:uuid', async (req, res) => {
    await eventController.putEvent(req, res);
});

// Define the routes for all DELETE requests
router.delete('/:uuid', async (req, res) => {
    await eventController.deleteEvent(req, res);
});

// Export the router
export default router;
