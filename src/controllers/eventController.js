import mongoose from 'mongoose';
import dbConnection from '../database/connection.js';
import dbOperation from '../database/operations.js';
import Event from '../models/Event.js';

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
        return res.status(201).setHeader('Location', `v1/${result._id}`).end();

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
        return res.status(200).setHeader('Location', `v1/${result._id}`).end();

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

// Export 
const eventController = {
    createEvent,
    readEvent,
    readAllEvents,
    updateEvent,
    deleteEvent
};

export default eventController;
