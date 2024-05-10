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

        let poi = {};
        let eventToCreate = {};
        let calendarEventToCreate = {};
        const newEventId = uuidv4();

        // Manage point of interest
        if (req.body.pointofinterestid !== null && req.body.pointofinterestid !== undefined) {
            const queryString =
                `query findPOIs {
                searchPointsOfInterest(
                    apiKey: "${config.poiService.apikey}",
                    searchInput: {
                        _id: "${req.body.pointofinterestid}"
                    }
                ) 
                {
                    _id
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
            poi = await poiService.performOperation(queryString); // Check if point of interest is valid
            if (poi === 'ERR_NOT_FOUND') {
                return res.status(404).json({
                    error: {
                        code: '404',
                        message: 'Not Found',
                        details: 'Body parameter <pointofinterestid> does not match a valid point of interest'
                    }
                });
            }
            else if (poi === 'ERR_GATEWAY') {
                return res.status(502).json({
                    error: {
                        code: '502',
                        message: 'Bad Gateway',
                        details: 'The server got an invalid response from an upstream server'
                    }
                });
            }
            else {
                eventToCreate.pointofinterestid = req.body.pointofinterestid;
                calendarEventToCreate.location = (poi[0].street ? poi[0].street + ', ' : '') + (poi[0].postcode ? poi[0].postcode : '') + poi[0].locationName;
                //calendarEventToCreate.location = poi[0].street + ', ' + poi[0].postcode + poi[0].locationName;
            }
        }
        else {
            const mutationString =
                `mutation exCreation {
                createPointOfInterest(
                    apiKey: "${config.poiService.apikey}",
                    input: {
                        name: "${req.body.pointofinterest.name}",
                        location: {
                            type: "Point",
                            coordinates: [${req.body.pointofinterest.longitude}, ${req.body.pointofinterest.latitude}]
                        },
                        locationName: "${req.body.pointofinterest.location}",
                        street: "${req.body.pointofinterest.street}",
                        postcode: "${req.body.pointofinterest.postcode}",
                        category: "${req.body.pointofinterest.category}",
                        description: "${req.body.pointofinterest.description}",
                        thumbnail: "${req.body.pointofinterest.thumbnail}"
                    }
                ) 
                {
                    poi 
                    {
                        _id
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
                    message
                }
            }`;
            poi = await poiService.performOperation(mutationString); // Create the point of interest
            if (poi === 'ERR_GATEWAY') {
                return res.status(502).json({
                    error: {
                        code: '502',
                        message: 'Bad Gateway',
                        details: 'The server got an invalid response from an upstream server'
                    }
                });
            }
            else if (poi === 'ERR_CONFLICT_NAME') {
                return res.status(502).json({
                    error: {
                        code: '409',
                        message: 'Conflict',
                        details: `A Point of Interest with the name <${req.body.pointofinterest.name}> already exists`
                    }
                });
            }
            else if (poi === 'ERR_CONFLICT_LOCATION') {
                return res.status(502).json({
                    error: {
                        code: '409',
                        message: 'Conflict',
                        details: `A Point of Interest already exists within ${config.server.minimumPoiDistance} meters of the one you are trying to create`
                    }
                });
            }
            else {
                eventToCreate.pointofinterestid = poi._id;
                calendarEventToCreate.location = (poi[0].street ? poi[0].street + ', ' : '') + (poi[0].postcode ? poi[0].postcode : '') + poi[0].locationName;
                //calendarEventToCreate.location = poi.street + ', ' + poi.postcode + poi.locationName;
            }
        }

        // Manage calendar
        const resultCalendar = await calendarService.createUserCalendar(req.body.userid);
        if (!resultCalendar) {
            return res.status(502).json({
                error: {
                    code: '502',
                    message: 'Bad Gateway',
                    details: 'The server got an invalid response from an upstream server'
                }
            });
        }
        eventToCreate.calendarid = resultCalendar.calendarId;

        // Create event in the calendar service
        calendarEventToCreate.eventId = newEventId;
        calendarEventToCreate.summary = req.body.name;
        calendarEventToCreate.description = req.body.about;
        calendarEventToCreate.start = req.body.startdate;
        calendarEventToCreate.end = req.body.enddate;
        const resultCalendarEvent = await calendarService.addEventToCalendar(eventToCreate.calendarid, calendarEventToCreate);
        if (!resultCalendarEvent) {
            return res.status(502).json({
                error: {
                    code: '502',
                    message: 'Bad Gateway',
                    details: 'The server got an invalid response from an upstream server'
                }
            });
        }

        // Create event in the event service
        eventToCreate._id = newEventId;
        eventToCreate.organizer = req.body.organizer;
        eventToCreate.userid = req.body.userid;
        eventToCreate.category = req.body.category;
        eventToCreate.contact = req.body.contact;
        if (req.body.price !== null && req.body.price !== undefined) {
            eventToCreate.currency = req.body.price.toString().substring(0, 3);
            eventToCreate.price = req.body.price.toString().replace('EUR', '').replace('USD', '').replace('GBP', '');
        }
        if (req.body.maxparticipants !== null && req.body.maxparticipants !== undefined) {
            eventToCreate.maxparticipants = req.body.maxparticipants;
        }
        if (req.body.currentparticipants !== null && req.body.currentparticipants !== undefined) {
            eventToCreate.currentparticipants = req.body.currentparticipants;
        }

        const resultEvent = await dbOperation.createDocument(Event, eventToCreate);
        if (!resultEvent) {
            return res.status(500).json({
                error: {
                    code: '500',
                    message: 'Internal Server Error',
                    details: 'An unexpected error has occurred. Please try again later'
                }
            });
        }

        // Return the status code and the location header with the uri of the created event
        return res.status(201).setHeader('Location', `v1/events/${resultEvent._id}`).end();

    } catch (error) {
        const msg = {
            messageID: req.logID,
            messageType: error.code,
            message: error.stack,
        }
        logger.logError.error(msg); // Write to error log file
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
                    details: 'The requested resource does not exist'
                }
            });
        }

        // Get information from the calendar service
        const calendarEvent = await calendarService.getEventsFromCalendar(event.calendarid, { eventId: req.params.uuid });
        if (!calendarEvent || calendarEvent.length === 0) {
            return res.status(502).json({
                error: {
                    code: '502',
                    message: 'Bad Gateway',
                    details: 'The server got an invalid response from an upstream server'
                }
            });
        }

        // Get information from the point of interest service
        const queryString =
            `query findPOIs {
            searchPointsOfInterest(
                apiKey: "${config.poiService.apikey}",
                searchInput: {
                    _id: "${event.pointofinterestid}"
                }
            ) 
            {
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
        const poi = await poiService.performOperation(queryString);
        if (poi === 'ERR_NOT_FOUND' || poi === 'ERR_GATEWAY') {
            return res.status(502).json({
                error: {
                    code: '502',
                    message: 'Bad Gateway',
                    details: 'The server got an invalid response from an upstream server'
                }
            });
        }

        // Return the status code and event data
        let eventInfo = {};
        eventInfo._id = event._id;
        eventInfo.name = calendarEvent[0].summary;
        eventInfo.organizer = event.organizer;
        eventInfo.category = event.category;
        eventInfo.contact = event.contact;
        eventInfo.startdate = calendarEvent[0].startDateTime;
        eventInfo.enddate = calendarEvent[0].endDateTime;
        eventInfo.about = calendarEvent[0].description;
        eventInfo.price = event.price;
        eventInfo.currency = event.currency;
        eventInfo.maxparticipants = event.maxparticipants;
        eventInfo.currentparticipants = event.currentparticipants;
        eventInfo.favorites = event.favorites;
        eventInfo.pointofinterestid = event.pointofinterestid;
        eventInfo.pointofinterest = {
            name: poi[0].name,
            longitude: poi[0].location.coordinates[0],
            latitude: poi[0].location.coordinates[1],
            street: poi[0].street,
            postcode: poi[0].postcode,
            location: poi[0].locationName,
            category: poi[0].category,
            description: poi[0].description,
            thumbnail: poi[0].thumbnail
        };

        return res.status(200).json(eventInfo);

    } catch (error) {
        const msg = {
            messageID: req.logID,
            messageType: error.code,
            message: error.stack,
        }
        logger.logError.error(msg); // Write to error log file
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
        const msg = {
            messageID: req.logID,
            messageType: error.code,
            message: error.stack,
        }
        logger.logError.error(msg); // Write to error log file
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

        let poi = {};
        let eventToUpdate = {};
        let calendarEventToUpdate = {};

        // Manage point of interest
        if (req.body.pointofinterestid !== null && req.body.pointofinterestid !== undefined) {
            const queryString =
                `query findPOIs {
                searchPointsOfInterest(
                    apiKey: "${config.poiService.apikey}",
                    searchInput: {
                        _id: "${req.body.pointofinterestid}"
                    }
                ) 
                {
                    _id
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
            poi = await poiService.performOperation(queryString); // Check if point of interest is valid
            if (poi === 'ERR_NOT_FOUND') {
                return res.status(404).json({
                    error: {
                        code: '404',
                        message: 'Not Found',
                        details: 'Body parameter <pointofinterestid> does not match a valid point of interest'
                    }
                });
            }
            else if (poi === 'ERR_GATEWAY') {
                return res.status(502).json({
                    error: {
                        code: '502',
                        message: 'Bad Gateway',
                        details: 'The server got an invalid response from an upstream server'
                    }
                });
            }
            else {
                eventToUpdate.pointofinterestid = req.body.pointofinterestid;
                calendarEventToUpdate.location = (poi[0].street ? poi[0].street + ', ' : '') + (poi[0].postcode ? poi[0].postcode : '') + poi[0].locationName;
                //calendarEventToUpdate.location = poi[0].street + ', ' + poi[0].postcode + poi[0].locationName;
            }
        }
        else {
            const mutationString =
                `mutation exCreation {
                createPointOfInterest(
                    apiKey: "${config.poiService.apikey}",
                    input: {
                        name: "${req.body.pointofinterest.name}",
                        location: {
                            type: "Point",
                            coordinates: [${req.body.pointofinterest.longitude}, ${req.body.pointofinterest.latitude}]
                        },
                        locationName: "${req.body.pointofinterest.location}",
                        street: "${req.body.pointofinterest.street}",
                        postcode: "${req.body.pointofinterest.postcode}",
                        category: "${req.body.pointofinterest.category}",
                        description: "${req.body.pointofinterest.description}",
                        thumbnail: "${req.body.pointofinterest.thumbnail}"
                    }
                ) 
                {
                    poi 
                    {
                        _id
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
                    message
                }
            }`;
            poi = await poiService.performOperation(mutationString);
            if (poi === 'ERR_GATEWAY') {
                return res.status(502).json({
                    error: {
                        code: '502',
                        message: 'Bad Gateway',
                        details: 'The server got an invalid response from an upstream server'
                    }
                });
            }
            else if (poi === 'ERR_CONFLICT_NAME') {
                return res.status(502).json({
                    error: {
                        code: '409',
                        message: 'Conflict',
                        details: `A Point of Interest with the name <${req.body.pointofinterest.name}> already exists`
                    }
                });
            }
            else if (poi === 'ERR_CONFLICT_LOCATION') {
                return res.status(502).json({
                    error: {
                        code: '409',
                        message: 'Conflict',
                        details: `A Point of Interest already exists within ${config.server.minimumPoiDistance} meters of the one you are trying to create`
                    }
                });
            }
            else {
                eventToUpdate.pointofinterestid = poi._id;
                calendarEventToUpdate.location = (poi[0].street ? poi[0].street + ', ' : '') + (poi[0].postcode ? poi[0].postcode : '') + poi[0].locationName;
                //calendarEventToUpdate.location = poi.street + ', ' + poi.postcode + poi.locationName;
            }
        }

        // Manage calendar
        const resultCalendar = await calendarService.createUserCalendar(req.body.userid);
        if (!resultCalendar) {
            return res.status(502).json({
                error: {
                    code: '502',
                    message: 'Bad Gateway',
                    details: 'The server got an invalid response from an upstream server'
                }
            });
        }
        eventToUpdate.calendarid = resultCalendar.calendarId;

        // Update event in the calendar service
        calendarEventToUpdate.summary = req.body.name;
        calendarEventToUpdate.description = req.body.about;
        calendarEventToUpdate.start = req.body.startdate;
        calendarEventToUpdate.end = req.body.enddate;
        const resultCalendarEvent = await calendarService.updateEventInCalendar(eventToUpdate.calendarid, req.params.uuid, calendarEventToUpdate);
        if (!resultCalendarEvent) {
            return res.status(502).json({
                error: {
                    code: '502',
                    message: 'Bad Gateway',
                    details: 'The server got an invalid response from an upstream server'
                }
            });
        }

        // Update event in the event service
        eventToUpdate.organizer = req.body.organizer;
        eventToUpdate.userid = req.body.userid;
        eventToUpdate.category = req.body.category;
        eventToUpdate.contact = req.body.contact;
        if (req.body.price !== null && req.body.price !== undefined) {
            eventToUpdate.currency = req.body.price.toString().substring(0, 3);
            eventToUpdate.price = req.body.price.toString().replace('EUR', '').replace('USD', '').replace('GBP', '');
        }
        if (req.body.maxparticipants !== null && req.body.maxparticipants !== undefined) {
            eventToUpdate.maxparticipants = req.body.maxparticipants;
        }
        if (req.body.currentparticipants !== null && req.body.currentparticipants !== undefined) {
            eventToUpdate.currentparticipants = req.body.currentparticipants;
        }

        const resultEvent = await dbOperation.updateDocument(Event, req.params.uuid, eventToUpdate);
        if (!resultEvent) {
            return res.status(500).json({
                error: {
                    code: '500',
                    message: 'Internal Server Error',
                    details: 'An unexpected error has occurred. Please try again later'
                }
            });
        }

        // Return the status code and the location header with the uri of the updated event
        return res.status(200).setHeader('Location', `v1/events/${resultEvent._id}`).end();

    } catch (error) {
        const msg = {
            messageID: req.logID,
            messageType: error.code,
            message: error.stack,
        }
        logger.logError.error(msg); // Write to error log file
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

    let session = false;

    try {
        // Open a new database connection if it is not already open
        if (mongoose.connection.readyState === 0) {
            await dbConnection.connect();
        }

        const event = await dbOperation.readDocument(Event, req.params.uuid);

        // Delete event information from all associated services
        if (event) {

            await amazonS3.deleteFile(req.params.uuid) // Delete from file storage service

            const removed = await calendarService.removeEventFromCalendar(event.calendarid, req.params.uuid) // Delete from calendar service
            if (!removed) {
                return res.status(502).json({
                    error: {
                        code: '502',
                        message: 'Bad Gateway',
                        details: 'The server got an invalid response from an upstream server',
                    }
                });
            }

            session = await mongoose.startSession();
            session.startTransaction();
            await dbOperation.deleteManyDocuments(Favorite, { eventid: req.params.uuid}) // Delete favorite entries from the database
            await dbOperation.deleteDocument(Event, req.params.uuid); // Delete event from the database
            await session.commitTransaction();
            session.endSession();
        }

        // Return the status code
        return res.status(204).end();

    } catch (error) {
        if (session && session instanceof mongoose.ClientSession && session.hasActiveTransaction()) {
            await session.abortTransaction();
            session.endSession();
        }
        const msg = {
            messageID: req.logID,
            messageType: error.code,
            message: error.stack,
        }
        logger.logError.error(msg); // Write to error log file
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

    let session = false;

    try {
        // Open a new database connection if it is not already open
        if (mongoose.connection.readyState === 0) {
            await dbConnection.connect();
        }

        let newEvent = {};

        // Check if the event exists
        const event = await dbOperation.readDocument(Event, req.params.uuid);
        if (!event) {
            return res.status(404).json({
                error: {
                    code: '404',
                    message: 'Not Found',
                    details: 'The requested resource does not exist'
                }
            });
        }

        // Get event details from the original calendar
        const eventToCreate = await calendarService.getEventsFromCalendar(event.calendarid, { eventId: req.params.uuid });
        if (!eventToCreate || eventToCreate.length === 0) {
            return res.status(502).json({
                error: {
                    code: '502',
                    message: 'Bad Gateway',
                    details: 'The server got an invalid response from an upstream server',
                }
            });
        }

        // Check if event is already in user calendar, add if it is not
        const possibleEvent = await calendarService.getEventsFromCalendar(req.body.calendarid, { eventId: req.params.uuid });
        if (!possibleEvent || possibleEvent.length === 0) {

            newEvent.eventId = req.params.uuid;
            newEvent.summary = eventToCreate[0].summary;
            newEvent.location = eventToCreate[0].location;
            newEvent.description = eventToCreate[0].description;
            newEvent.start = eventToCreate[0].startDateTime;
            newEvent.end = eventToCreate[0].endDateTime;

            const calendarEvent = await calendarService.addEventToCalendar(req.body.calendarid, newEvent);
            if (!calendarEvent) {
                return res.status(502).json({
                    error: {
                        code: '502',
                        message: 'Bad Gateway',
                        details: 'The server got an invalid response from an upstream server',
                    }
                });
            }
        }

        // Check if user has previously favorited the event
        const query = { eventid: req.params.uuid, userid: req.body.userid };
        const favorite = await dbOperation.readAllDocuments(Favorite, query);

        // If he has never favorited the event create a new favorite entry and increment the event favorites count by 1, using a transaction
        if (!favorite || favorite.length === 0) {
            if (req.body.favoritestatus) {
                const newFavorite = {
                    eventid: req.params.uuid,
                    userid: req.body.userid,
                    favoritestatus: req.body.favoritestatus
                };

                session = await mongoose.startSession();
                session.startTransaction();
                await dbOperation.createDocument(Favorite, newFavorite);
                await dbOperation.updateDocument(Event, req.params.uuid, { $inc: { favorites: 1 } });
                await session.commitTransaction();
                session.endSession();
            }
        }
        // If user has previously favorited the event, update the favorite entry and the event favorites count accordingly, using a transaction
        else {
            const newFavorite = { favoritestatus: req.body.favoritestatus };
            session = await mongoose.startSession();
            session.startTransaction();

            if (!favorite[0].favoritestatus && req.body.favoritestatus) {       // If favoriting the event
                await dbOperation.updateDocument(Favorite, favorite[0]._id, newFavorite);
                await dbOperation.updateDocument(Event, req.params.uuid, { $inc: { favorites: 1 } });
            }
            else if (favorite[0].favoritestatus && !req.body.favoritestatus) {  // If unfavoriting the event
                await dbOperation.updateDocument(Favorite, favorite[0]._id, newFavorite);
                await dbOperation.updateDocument(Event, req.params.uuid, { $inc: { favorites: -1 } });
            }
            await session.commitTransaction();
            session.endSession();
        }

        // Return the status code and the location header with the uri of the updated event
        return res.status(200).setHeader('Location', `v1/events/${req.params.uuid}`).end();

    } catch (error) {
        if (session && session instanceof mongoose.ClientSession && session.hasActiveTransaction()) {
            await session.abortTransaction();
            session.endSession();
        }
        const msg = {
            messageID: req.logID,
            messageType: error.code,
            message: error.stack,
        }
        logger.logError.error(msg); // Write to error log file
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
