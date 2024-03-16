import express from 'express';
import authValidator from '../middleware/authValidation.js';
import dataValidator from '../middleware/dataValidation.js';
import eventController from '../controllers/eventController.js';

// Create a new instance of the express router and apply authentication middleware to all routes
const routerEvents = express.Router();
routerEvents.use(authValidator.isValidAuthKey);

/**
 * @swagger
 * /v1/events:
 *   post:
 *     tags:
 *       - Events
 *     summary: Create a new event
 *     description: Creates a new event with the provided data
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event_Request'
 *     responses:
 *       201:
 *         description: Created success
 *         headers:
 *           Location:
 *             description: URI where the newly created event can be found
 *             schema:
 *               type: string
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *                     example:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *         headers:
 *           WWW-Authenticate:
 *             description: 'Basic realm="service-api-key"'
 *             schema:
 *               type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 */
routerEvents.post('/events', dataValidator.isValidBody, async (req, res) => {
    await eventController.createEvent(req, res);
});

/**
 * @swagger
 * /v1/events:
 *   get:
 *     tags:
 *       - Events
 *     summary: Get all events
 *     description: Fetches all events, with optional query parameters
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Maximum number of events to return
 *         required: false
 *         schema:
 *           type: integer
 *           format: int32
 *           default: 25
 *           minimum: 1
 *           maximum: 50
 *       - name: offset
 *         in: query
 *         description: Number of events to skip for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           format: int32
 *           default: 0
 *           minimum: 0
 *       - name: search 
 *         in: query
 *         description: Generic search string (can be a partial/full match with name, organizer, and category). It has priority over all other query parameters and is case-insensitive
 *         required: false
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 256
 *       - name: name
 *         in: query
 *         description: Name of the event (must be an exact match). It is case-sensitive
 *         required: false
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 256
 *       - name: organizer
 *         in: query
 *         description: Name of the event organizer (must be an exact match). It is case-sensitive
 *         required: false
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 256
 *       - name: city
 *         in: query
 *         description: Name of the city where the event is taking place (must be an exact match). It is case-sensitive
 *         required: false
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 256
 *       - name: category
 *         in: query
 *         description: Category of the event (must be an exact match). It is case-sensitive
 *         required: false
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 256
 *       - name: startdate
 *         in: query
 *         description: Events that start at this date (must be an exact match). If applied, will delete the beforedate and afterdate query parameters should they exist. It is case-sensitive
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time  
 *       - name: beforedate
 *         in: query
 *         description: Events that end before or at this date (must be an exact match). It is case-sensitive
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *       - name: afterdate
 *         in: query
 *         description: Events that start at and after this date (must be an exact match). It is case-sensitive
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *       - name: maxprice
 *         in: query
 *         description: Maximum price of the event (must be an exact match). It is case-sensitive
 *         required: false
 *         schema:
 *           type: string
 *           pattern: '^(\d+\.\d{2})$' 
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event_Response'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *                     example:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *         headers:
 *           WWW-Authenticate:
 *             description: 'Basic realm="service-api-key"'
 *             schema:
 *               type: string
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 */
routerEvents.get('/events', dataValidator.isValidQuery, async (req, res) => {
    await eventController.readAllEvents(req, res);
});

/**
 * @swagger
 * /v1/events/{uuid}:
 *   get:
 *     tags:
 *       - Events
 *     summary: Get a single event
 *     description: Fetches a single event by its UUID
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: uuid
 *         in: path
 *         description: UUID of the event to fetch
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Event_Response'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *                     example:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *         headers:
 *           WWW-Authenticate:
 *             description: 'Basic realm="service-api-key"'
 *             schema:
 *               type: string
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 */
routerEvents.get('/events/:uuid', dataValidator.isValidUUID, async (req, res) => {
    await eventController.readEvent(req, res);
});

/**
 * @swagger
 * /v1/events/{uuid}:
 *   put:
 *     tags:
 *       - Events
 *     summary: Update an existing event
 *     description: Updates an existing event by its UUID with the provided data
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: uuid
 *         in: path
 *         description: UUID of the event to update
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event_Request'
 *     responses:
 *       200:
 *         description: OK
 *         headers:
 *           Location:
 *             description: URI where the updated event can be found
 *             schema:
 *               type: string
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *                     example:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *         headers:
 *           WWW-Authenticate:
 *             description: 'Basic realm="service-api-key"'
 *             schema:
 *               type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 */
routerEvents.put('/events/:uuid', dataValidator.isValidUUID, dataValidator.isValidBody, async (req, res) => {
    await eventController.updateEvent(req, res);
});

/**
 * @swagger
 * /v1/events/{uuid}/favorite:
 *   patch:
 *     tags:
 *       - Events
 *     summary: Add a favorite to an existing event
 *     description: Updates an existing event by its UUID, increasing the number of favorites by 1
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: uuid
 *         in: path
 *         description: UUID of the event to update
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: OK
 *         headers:
 *           Location:
 *             description: URI where the updated event can be found
 *             schema:
 *               type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *         headers:
 *           WWW-Authenticate:
 *             description: 'Basic realm="service-api-key"'
 *             schema:
 *               type: string
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 */
routerEvents.patch('/events/:uuid/favorite', dataValidator.isValidUUID, async (req, res) => {
    await eventController.favoriteEvent(req, res);
});

/**
 * @swagger
 * /v1/events/{uuid}:
 *   delete:
 *     tags:
 *       - Events
 *     summary: Delete a single event
 *     description: Deletes a single event by its UUID
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: uuid
 *         in: path
 *         description: UUID of the event to delete
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: No Content
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *                     example:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *         headers:
 *           WWW-Authenticate:
 *             description: 'Basic realm="service-api-key"'
 *             schema:
 *               type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 */
routerEvents.delete('/events/:uuid', dataValidator.isValidUUID, async (req, res) => {
    await eventController.deleteEvent(req, res);
});

// Export the router
export default routerEvents;
