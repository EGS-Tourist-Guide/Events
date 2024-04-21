import express from 'express';
import routeLogger from '../middleware/routeLogging.js';
import authValidator from '../middleware/authValidation.js';
import dataValidator from '../middleware/dataValidation.js';
import eventController from '../controllers/eventController.js';

// Create a new instance of the express router
const routerEvents = express.Router();

/**
 * @swagger
 * /v1/events:
 *   post:
 *     tags:
 *       - Events
 *     summary: Create a new event
 *     description: Creates a new event. At least one field from [pointofinterestid, pointofinterest] must be provided. 
 *                  If both are provided, pointofinterestid will be given priority and pointofinterest will be ignored.
 *                  If neither is provided, the request will be rejected.
 *                  If pointofinterestid is not provided but pointofinterest is, its data will be used to create a new point of interest. 
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event_Request_POST'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Created_201'
 *       400:
 *         $ref: '#/components/responses/BadRequest_400'
 *       401:
 *         $ref: '#/components/responses/Unauthorized_401'
 *       404:
 *         $ref: '#/components/responses/NotFound_404'
 *       500:
 *         $ref: '#/components/responses/InternalServerError_500'
 *       502:
 *         $ref: '#/components/responses/BadGateway_502'
 */
routerEvents.post('/events', routeLogger.request, routeLogger.response, authValidator.isValidAuthKey, dataValidator.isValidBody, async (req, res) => {
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
 *         $ref: '#/components/responses/BadRequest_400'
 *       401:
 *         $ref: '#/components/responses/Unauthorized_401'
 *       404:
 *         $ref: '#/components/responses/NotFound_404'
 *       500:
 *         $ref: '#/components/responses/InternalServerError_500'
 *       502:
 *         $ref: '#/components/responses/BadGateway_502'
 */
routerEvents.get('/events', routeLogger.request, routeLogger.response, authValidator.isValidAuthKey, dataValidator.isValidQuery, async (req, res) => {
    await eventController.readAllEvents(req, res);
});

/**
 * @swagger
 * /v1/events/{uuid}:
 *   get:
 *     tags:
 *       - Events
 *     summary: Get an event
 *     description: Fetches a single event
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
 *         $ref: '#/components/responses/BadRequest_400'
 *       401:
 *         $ref: '#/components/responses/Unauthorized_401'
 *       404:
 *         $ref: '#/components/responses/NotFound_404'
 *       500:
 *         $ref: '#/components/responses/InternalServerError_500'
 *       502:
 *         $ref: '#/components/responses/BadGateway_502'
 */
routerEvents.get('/events/:uuid', routeLogger.request, routeLogger.response, authValidator.isValidAuthKey, dataValidator.isValidUUID, async (req, res) => {
    await eventController.readEvent(req, res);
});

/**
 * @swagger
 * /v1/events/{uuid}:
 *   put:
 *     tags:
 *       - Events
 *     summary: Update an event
 *     description: Updates an event with the provided data
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
 *             $ref: '#/components/schemas/Event_Request_PUT'
 *     responses:
 *       200:
 *         description: OK
 *         headers:
 *           Location:
 *             description: URI where the updated resource can be found
 *             schema:
 *               type: string
 *       400:
 *         $ref: '#/components/responses/BadRequest_400'
 *       401:
 *         $ref: '#/components/responses/Unauthorized_401'
 *       403:
 *         $ref: '#/components/responses/Forbidden_403'
 *       404:
 *         $ref: '#/components/responses/NotFound_404'
 *       500:
 *         $ref: '#/components/responses/InternalServerError_500'
 *       502:
 *         $ref: '#/components/responses/BadGateway_502'
 */
routerEvents.put('/events/:uuid', routeLogger.request, routeLogger.response, authValidator.isValidAuthKey, authValidator.isOperationAllowed, dataValidator.isValidUUID, dataValidator.isValidBody, async (req, res) => {
    await eventController.updateEvent(req, res);
});

/**
 * @swagger
 * /v1/events/{uuid}/favorite:
 *   patch:
 *     tags:
 *       - Events
 *     summary: Add/Remove a favorite from an event
 *     description: Adds/Removes a favorite from an event. If adding it will add the event to the user calendar and update event favorite count. If removing it will remove the event from the user calendar and update event favorite count.
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
 *             $ref: '#/components/schemas/Favorite'
 *     responses:
 *       200:
 *         description: OK
 *         headers:
 *           Location:
 *             description: URI where the updated resource can be found
 *             schema:
 *               type: string
 *       400:
 *         $ref: '#/components/responses/BadRequest_400'
 *       401:
 *         $ref: '#/components/responses/Unauthorized_401'
 *       403:
 *         $ref: '#/components/responses/Forbidden_403'
 *       404:
 *         $ref: '#/components/responses/NotFound_404'
 *       500:
 *         $ref: '#/components/responses/InternalServerError_500'
 *       502:
 *         $ref: '#/components/responses/BadGateway_502'
 */
routerEvents.patch('/events/:uuid/favorite', routeLogger.request, routeLogger.response, authValidator.isValidAuthKey, dataValidator.isValidUUID, dataValidator.isValidFavorite, async (req, res) => {
    await eventController.favoriteEvent(req, res);
});

/**
 * @swagger
 * /v1/events/{uuid}:
 *   delete:
 *     tags:
 *       - Events
 *     summary: Delete an event
 *     description: Deletes an event
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userid:
 *                 type: string
 *                 example: id12345
 *     responses:
 *       204:
 *         $ref: '#/components/responses/NoContent_204'
 *       400:
 *         $ref: '#/components/responses/BadRequest_400'
 *       401:
 *         $ref: '#/components/responses/Unauthorized_401'
 *       403:
 *         $ref: '#/components/responses/Forbidden_403'
 *       500:
 *         $ref: '#/components/responses/InternalServerError_500'
 *       502:
 *         $ref: '#/components/responses/BadGateway_502'
 */
routerEvents.delete('/events/:uuid', routeLogger.request, routeLogger.response, authValidator.isValidAuthKey,  authValidator.isOperationAllowed, dataValidator.isValidUUID, async (req, res) => {
    await eventController.deleteEvent(req, res);
});

// Export the router
export default routerEvents;
