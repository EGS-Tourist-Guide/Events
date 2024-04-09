import mongoose from 'mongoose';
import config from '../config/config.js';
import dbConnection from '../database/connection.js';
import dbOperation from '../database/operations.js';
import Event from '../models/event.js';
import Favorite from '../models/favorite.js';

// Create a new event
const createEvent = async (req, res) => {
    try {
        // Open a new database connection if it is not already open
        if (mongoose.connection.readyState === 0) {
            await dbConnection.connect();
        }

        // If provided, process the currency and price
        if (req.body.price !== undefined) {
            req.body.currency = req.body.price.toString().substring(0, 3);
            req.body.price = req.body.price.toString().replace('EUR', '').replace('USD', '').replace('GBP', '');
        }

        // Create a new event in the database
        const result = await dbOperation.createDocument(Event, req.body);

        // Return the status code and the location header with the uri of the created event
        return res.status(201).setHeader('Location', `v1/events/${result._id}`).end();

    } catch (error) {
        return res.status(500).json({
            error: {
                code: '500',
                message: 'Internal Server Error',
                details: 'An unexpected error has occurred. Please try again later'
            }
        });
    }
};

// Get an event by its UUID
const readEvent = async (req, res) => {
    try {
        // Open a new database connection if it is not already open
        if (mongoose.connection.readyState === 0) {
            await dbConnection.connect();
        }

        // Read the event from the database
        const event = await dbOperation.readDocument(Event, req.params.uuid);

        // If the event does not exist
        if (!event) {
            return res.status(404).json({
                error: {
                    code: '404',
                    message: 'Not Found',
                    details: 'The requested resource does not exist',
                }
            });
        }

        // Return the status code and event data
        return res.status(200).json(event);

    } catch (error) {
        return res.status(500).json({
            error: {
                code: '500',
                message: 'Internal Server Error',
                details: 'An unexpected error has occurred. Please try again later'
            }
        });
    }
};

// Get all events, with optional filtering
const readAllEvents = async (req, res) => {
    try {
        // Open a new database connection if it is not already open
        if (mongoose.connection.readyState === 0) {
            await dbConnection.connect();
        }

        // Read events according to the query parameters
        let events;

        if (Object.keys(req.query).length === 0) {
            events = await dbOperation.readAllDocuments(Event);
        }
        else {

            // Extract the limit, offset, and search query parameters from the request (if they exist)
            const { limit, offset, search, ...queryParams } = req.query;

            // If the search query parameter was provided, create a regular expression to search for the value in the name, organizer, and category fields
            const searchRegex = search ? new RegExp(search, 'i') : null;
            const searchableFields = config.server.allowedGenericSearchParams;
            if (search) {
                const searchConditions = searchableFields.map(field => ({
                    [field]: { $regex: searchRegex }
                }));
                queryParams.$or = searchConditions;
            }

            // Only when startdate query parameter was not provided can the other date query parameters be applied
            if (queryParams.startdate === undefined) {
                // If beforedate query parameter was provided, get all events that end at and before the beforedate
                if (queryParams.beforedate !== undefined) {
                    queryParams.enddate = { $lte: new Date(queryParams.beforedate) };
                    delete queryParams.beforedate;
                }

                // If afterdate query parameter was provided, get all events that start at and after the afterdate
                if (queryParams.afterdate !== undefined) {
                    queryParams.startdate = { $gte: new Date(queryParams.afterdate) };
                    delete queryParams.afterdate;
                }
            }
            else {
                delete queryParams.beforedate;
                delete queryParams.afterdate;
            }

            // If maxprice query parameter was provided, add that condition to the query
            if (queryParams.maxprice !== undefined) {
                queryParams.price = { $lte: queryParams.maxprice };
                delete queryParams.maxprice;
            }

            events = await dbOperation.readAllDocuments(Event, queryParams, limit, offset);
        }

        // If the event array is empty (no events found)
        if (events.length === 0) {
            return res.status(404).json({
                error: {
                    code: '404',
                    message: 'Not Found',
                    details: 'The requested resource does not exist',
                }
            });
        }

        // Return the status code and event data
        return res.status(200).json(events);

    } catch (error) {
        return res.status(500).json({
            error: {
                code: '500',
                message: 'Internal Server Error',
                details: 'An unexpected error has occurred. Please try again later'
            }
        });
    }
};

// Update an event by its UUID
const updateEvent = async (req, res) => {
    try {
        // Open a new database connection if it is not already open
        if (mongoose.connection.readyState === 0) {
            await dbConnection.connect();
        }

        // If provided, process the currency and price
        if (req.body.price !== undefined) {
            req.body.currency = req.body.price.toString().substring(0, 3);
            req.body.price = req.body.price.toString().replace('EUR', '').replace('USD', '').replace('GBP', '');
        }

        // Update the event in the database
        const result = await dbOperation.updateDocument(Event, req.params.uuid, req.body);

        // If the event does not exist
        if (result === null) {
            return res.status(404).json({
                error: {
                    code: '404',
                    message: 'Not Found',
                    details: 'The requested resource does not exist',
                }
            });
        }

        // Return the status code and the location header with the uri of the updated event
        return res.status(200).setHeader('Location', `v1/events/${result._id}`).end();

    } catch (error) {
        return res.status(500).json({
            error: {
                code: '500',
                message: 'Internal Server Error',
                details: 'An unexpected error has occurred. Please try again later'
            }
        });
    }
};

// Delete an event by its UUID
const deleteEvent = async (req, res) => {
    try {
        // Open a new database connection if it is not already open
        if (mongoose.connection.readyState === 0) {
            await dbConnection.connect();
        }

        // Delete the event from the database
        await dbOperation.deleteDocument(Event, req.params.uuid);

        // Whether the event was sucesfully deleted or an event with the UUID was not found, the return status code should be 204 (No Content)
        return res.status(204).end();

    } catch (error) {
        return res.status(500).json({
            error: {
                code: '500',
                message: 'Internal Server Error',
                details: 'An unexpected error has occurred. Please try again later'
            }
        });
    }
};

// Favorite an event by its UUID
const favoriteEvent = async (req, res) => {
    try {
        // Open a new database connection if it is not already open
        if (mongoose.connection.readyState === 0) {
            await dbConnection.connect();
        }

        // Check if the favoriteStatus parameter is a boolean
        if (typeof req.body.favoriteStatus !== 'boolean') {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: 'Body parameter <favoriteStatus> must be a boolean',
                    example: 'true'
                }
            });
        }

        // Check if user has previously favorited the event
        const query = { eventId: req.params.uuid, userId: req.body.userId };
        const favorite = await dbOperation.readAllDocuments(Favorite, query, 1, 0);

        // If he has never favorited the event, create a new favorite entry and increment the event favorites count by 1, using a transaction
        if (favorite === null || favorite === undefined || favorite.length === 0) {
            const newFavorite = {
                eventId: req.params.uuid,
                userId: req.body.userId,
                favoriteStatus: req.body.favoriteStatus
            };

            const session = await mongoose.startSession();
            session.startTransaction();
            await dbOperation.createDocument(Favorite, newFavorite);
            await dbOperation.updateDocument(Event, req.params.uuid, { $inc: { favorites: 1 } });
            await session.commitTransaction();
            session.endSession();
        }
        // If user has previously favorited the event before, update the favorite entry and the event favorites count accordingly, using a transaction
        else {
            const newFavorite = { favoriteStatus: req.body.favoriteStatus };
            const session = await mongoose.startSession();
            session.startTransaction();

            if (!favorite[0].favoriteStatus && req.body.favoriteStatus) {       // If favoriting the event
                await dbOperation.updateDocument(Favorite, favorite[0]._id, newFavorite);
                await dbOperation.updateDocument(Event, req.params.uuid, { $inc: { favorites: 1 } });
            }
            else if (favorite[0].favoriteStatus && !req.body.favoriteStatus) {  // If unfavoriting the event
                await dbOperation.updateDocument(Favorite, favorite[0]._id, newFavorite);
                await dbOperation.updateDocument(Event, req.params.uuid, { $inc: { favorites: -1 } });
            }
            await session.commitTransaction();
            session.endSession();
        }

        // Return the status code and the location header with the uri of the updated event
        return res.status(200).setHeader('Location', `v1/events/${req.params.uuid}`).end();

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({
            error: {
                code: '500',
                message: 'Internal Server Error',
                details: 'An unexpected error has occurred. Please try again later'
            }
        });
    }
};

// Export 
const eventController = {
    createEvent,
    readEvent,
    readAllEvents,
    updateEvent,
    deleteEvent,
    favoriteEvent
};

export default eventController;
