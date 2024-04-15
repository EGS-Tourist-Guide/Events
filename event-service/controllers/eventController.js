import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/config.js';
import dbConnection from '../database/connection.js';
import dbOperation from '../database/operations.js';
import calendarService from '../services/calendar.js';
import poiService from '../services/pointOfInterest.js';
import amazonS3 from '../services/amazonS3.js';
import logger from '../logger.js';
import Event from '../models/event.js';
import Favorite from '../models/favorite.js';

// Create a new event
const createEvent = async (req, res) => {
    try {
        // Open a new database connection if it is not already open
        if (mongoose.connection.readyState === 0) {
            await dbConnection.connect();
        }

        let result;
        const newEventId = uuidv4();

        let eventToCreate = {
            _id: newEventId,
            userid: req.body.userid,
            organizer: req.body.organizer,
            category: req.body.category,
            contact: req.body.contact,
        };
        if (req.body.price !== undefined) {
            eventToCreate.currency = req.body.price.toString().substring(0, 3);
            eventToCreate.price = req.body.price.toString().replace('EUR', '').replace('USD', '').replace('GBP', '');
        }
        if (req.body.maxparticipants !== undefined) {
            eventToCreate.maxparticipants = req.body.maxparticipants;
        }
        if (req.body.currentparticipants !== undefined) {
            eventToCreate.currentparticipants = req.body.currentparticipants;
        }

        const calendarEventToCreate = {
            eventId: newEventId,
            summary: req.body.name,
            location: req.body.street + ' ' + req.body.doornumber + ', ' + req.body.postcode + ' ' + req.body.city + ', ' + req.body.country,
            description: req.body.about,
            start: req.body.startdate,
            end: req.body.enddate
        };

        // Manage calendar
        const calendar = await calendarService.createUserCalendar(req.body.userid);
        if (calendar === null || calendar === undefined) {
            return res.status(502).json({
                error: {
                    code: '502',
                    message: 'Bad Gateway',
                    details: 'The server got an invalid response from an upstream server',
                }
            });
        }
        eventToCreate.calendarid = calendar.calendarId;

        // Manage point of interest
        if (req.body.pointofinterestid !== undefined) {
            const queryString = `query findPOIs {
                searchPointsOfInterest(
                  apiKey: "${config.poiService.apikey}",
                  searchInput: {
                    _id: "${req.body.pointofinterestid}"
                  }
                ) {
                    _id
                  }
              }`;

            const poi = await poiService.performOperation(queryString); // Check if the point of interest is valid
            if (poi === null || poi === undefined || poi.data.searchPointsOfInterest.length === 0) {
                return res.status(404).json({
                    error: {
                        code: '404',
                        message: 'Not Found',
                        details: 'Body parameter <pointofinterestid> does not match a valid point of interest',
                    }
                });
            }
            eventToCreate.pointofinterestid = req.body.pointofinterestid;

            const calendarEvent = await calendarService.addEventToCalendar(eventToCreate.calendarid, calendarEventToCreate); // Create event in the calendar service
            if (calendarEvent === null || calendarEvent === undefined) {
                return res.status(502).json({
                    error: {
                        code: '502',
                        message: 'Bad Gateway',
                        details: 'The server got an invalid response from an upstream server',
                    }
                });
            }

            result = await dbOperation.createDocument(Event, eventToCreate);  // Create event in event service
        }
        else {
            let poiTocreate = {
                name: req.body.pointofinterest.name,
                location: {
                    type: 'Point',
                    coordinates: [req.body.pointofinterest.latitude, req.body.pointofinterest.longitude],
                },
                locationName: req.body.city + ', ' + req.body.country,
                street: req.body.street + ' ' + req.body.doornumber,
                postcode: req.body.postcode,
            }
            if (req.body.pointofinterest.category !== undefined) {
                poiTocreate.category = req.body.pointofinterest.category;
            }
            if (req.body.pointofinterest.description !== undefined) {
                poiTocreate.description = req.body.pointofinterest.description;
            }
            if (req.body.pointofinterest.thumbnail !== undefined) {
                poiTocreate.thumbnail = req.body.pointofinterest.thumbnail;
            }

            const mutationString = `mutation exCreation {
                createPointOfInterest(
                  apiKey: "${config.poiService.apikey}",
                  input: "${poiTocreate}"
                ) {
                    poi {
                        _id
                    }
                  }
              }`;
            const poi = await poiService.performOperation(mutationString); // Create poi in the point of interest service
            if (poi === null || poi === undefined) {
                return res.status(502).json({
                    error: {
                        code: '502',
                        message: 'Bad Gateway',
                        details: 'The server got an invalid response from an upstream server',
                    }
                });
            }
            eventToCreate.pointofinterestid = poi.data.createPointOfInterest.poi._id;

            const calendarEvent = await calendarService.addEventToCalendar(eventToCreate.calendarid, calendarEventToCreate); // Create event in the calendar service
            if (calendarEvent === null || calendarEvent === undefined) {
                return res.status(502).json({
                    error: {
                        code: '502',
                        message: 'Bad Gateway',
                        details: 'The server got an invalid response from an upstream server',
                    }
                });
            }

            result = await dbOperation.createDocument(Event, eventToCreate);  // Create event in event service
        }

        // Return the status code and the location header with the uri of the created event
        return res.status(201).setHeader('Location', `v1/events/${result._id}`).end();

    } catch (error) {
        error.messageID = req.logID;
        logger.logError.error(error); // Write to error log file
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

        // Get information from the database
        const event = await dbOperation.readDocument(Event, req.params.uuid);
        if (!event) {
            return res.status(404).json({
                error: {
                    code: '404',
                    message: 'Not Found',
                    details: 'The requested resource does not exist',
                }
            });
        }

        // Get information from the calendar service
        const calendarEvent = await calendarService.getEventsFromCalendar(event.calendarid, { eventId: req.params.uuid });
        if (calendarEvent === null || calendarEvent === undefined || calendarEvent.length === 0) {
            return res.status(502).json({
                error: {
                    code: '502',
                    message: 'Bad Gateway',
                    details: 'The server got an invalid response from an upstream server',
                }
            });
        }
        event.name = calendarEvent[0].summary;
        event.about = calendarEvent[0].description;
        event.startdate = calendarEvent[0].start;
        event.enddate = calendarEvent[0].end;

        // Get information from the point of interest service
        const queryString = `query findPOIs {
            searchPointsOfInterest(
              apiKey: "${config.poiService.apikey}",
              searchInput: {
                _id: "${event.pointofinterestid}"
              }
            ) {
                name
                location {
                coordinates
                }
                locationName
                street
                postcode
                description
                category
                thumbnail
              }
          }`;

        const poi = await poiService.performOperation(queryString); // Check if the point of interest is valid
        if (poi === null || poi === undefined || poi.data.searchPointsOfInterest.length === 0) {
            return res.status(404).json({
                error: {
                    code: '404',
                    message: 'Not Found',
                    details: 'Body parameter <pointofinterestid> does not match a valid point of interest',
                }
            });
        }
        event.street = poi.data.searchPointsOfInterest[0].street;
        event.postcode = poi.data.searchPointsOfInterest[0].postcode;
        event.location = poi.data.searchPointsOfInterest[0].locationName;
        event.pointofinterest = {
            name: poi.data.searchPointsOfInterest[0].name,
            latitude: poi.data.searchPointsOfInterest[0].location.coordinates[0],
            longitude: poi.data.searchPointsOfInterest[0].location.coordinates[1],
            category: poi.data.searchPointsOfInterest[0].category,
            description: poi.data.searchPointsOfInterest[0].description,
            thumbnail: poi.data.searchPointsOfInterest[0].thumbnail
        };

        // Remove unnecessary fields before returning
        delete event.userid;
        delete event.calendarid;
        delete event.pointofinterestid;
        delete event.created;

        // Return the status code and event data
        return res.status(200).json(event);

    } catch (error) {
        error.messageID = req.logID;
        logger.logError.error(error); // Write to error log file
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
        error.messageID = req.logID;
        logger.logError.error(error); // Write to error log file
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

        if (req.body.pointofinterestid === null || req.body.pointofinterestid === undefined) {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: 'Body parameter <pointofinterestid> must be a non-empty string between 1 and 1024 characters long (excluding leading and trailing white spaces)',
                    example: 'poi12345'
                }
            });
        }

        let result;

        let eventToUpdate = {
            organizer: req.body.organizer,
            category: req.body.category,
            contact: req.body.contact,
        };
        if (req.body.price !== undefined) {
            eventToCreate.currency = req.body.price.toString().substring(0, 3);
            eventToCreate.price = req.body.price.toString().replace('EUR', '').replace('USD', '').replace('GBP', '');
        }
        if (req.body.maxparticipants !== undefined) {
            eventToCreate.maxparticipants = req.body.maxparticipants;
        }
        if (req.body.currentparticipants !== undefined) {
            eventToCreate.currentparticipants = req.body.currentparticipants;
        }

        const calendarEventToUpdate = {
            summary: req.body.name,
            location: req.body.street + ' ' + req.body.doornumber + ', ' + req.body.postcode + ' ' + req.body.city + ', ' + req.body.country,
            description: req.body.about,
            start: req.body.startdate,
            end: req.body.enddate
        };

        // Manage calendar
        const calendar = await calendarService.createUserCalendar(req.body.userid);
        if (calendar === null || calendar === undefined) {
            return res.status(502).json({
                error: {
                    code: '502',
                    message: 'Bad Gateway',
                    details: 'The server got an invalid response from an upstream server',
                }
            });
        }
        eventToUpdate.calendarid = calendar.calendarId;

        // Manage point of interest
        const queryString = `query findPOIs {
            searchPointsOfInterest(
                apiKey: "${config.poiService.apikey}",
                searchInput: {
                _id: "${req.body.pointofinterestid}"
                }
            ) {
                _id
                }
            }`;

        const poi = await poiService.performOperation(queryString); // Check if the point of interest is valid
        if (poi === null || poi === undefined || poi.data.searchPointsOfInterest.length === 0) {
            return res.status(404).json({
                error: {
                    code: '404',
                    message: 'Not Found',
                    details: 'Body parameter <pointofinterestid> does not match a valid point of interest',
                }
            });
        }
        eventToUpdate.pointofinterestid = req.body.pointofinterestid;

        const calendarEvent = await calendarService.updateEventInCalendar(eventToUpdate.calendarid, req.params.uuid, calendarEventToUpdate); // Update event in the calendar service
        if (calendarEvent === null || calendarEvent === undefined) {
            return res.status(502).json({
                error: {
                    code: '502',
                    message: 'Bad Gateway',
                    details: 'The server got an invalid response from an upstream server',
                }
            });
        }

        result = await dbOperation.updateDocument(Event, eventToUpdate);  // Update event in event service

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
        error.messageID = req.logID;
        logger.logError.error(error); // Write to error log file
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

        const event = dbOperation.readDocument(req.params.uuid);

        // Delete files associated with the event from the file storage service
        if (event) {
            await amazonS3.deleteFile(req.params.uuid)
        }

        // Delete the event from the calendar service
        if (event) {
            const removed = await calendarService.removeEventFromCalendar(event.calendarid, req.params.uuid)
            if (removed === null || removed === undefined) {
                return res.status(502).json({
                    error: {
                        code: '502',
                        message: 'Bad Gateway',
                        details: 'The server got an invalid response from an upstream server',
                    }
                });
            }
        }

        // Delete the event from the database
        if (event) {
            await dbOperation.deleteDocument(Event, req.params.uuid);
        }

        // Return the status code
        return res.status(204).end();

    } catch (error) {
        error.messageID = req.logID;
        logger.logError.error(error); // Write to error log file
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
        error.messageID = req.logID;
        logger.logError.error(error); // Write to error log file
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
