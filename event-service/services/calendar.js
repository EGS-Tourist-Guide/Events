import config from "../config/config.js";

// Create calendar associated to user
const createUserCalendar = async (userId) => {
    try {
        const response = await fetch(config.calendarService.baseUrl + ':' + config.calendarService.port + '/v1/' + userId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': config.calendarService.apikey
            },
        });

        const data = await response.json();
        return data;

    } catch (error) {
        throw error;
    }
};

// Add event to calendar
const addEventToCalendar = async (calendarId, eventData) => {
    try {
        const response = await fetch(config.calendarService.baseUrl + ':' + config.calendarService.port + '/v1/calendars/' + calendarId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': config.calendarService.apikey
            },
            body: JSON.stringify(eventData)
        });

        const data = await response.json();
        return data;

    } catch (error) {
        throw error;
    }
};

// Get events from calendar with optional search parameters
const getEventsFromCalendar = async (calendarId, searchParams) => {
    try {
        const params = new URLSearchParams();
        for (const key in searchParams) {
            params.append(key, searchParams[key]);
        }

        const response = await fetch(config.calendarService.baseUrl + ':' + config.calendarService.port + '/v1/calendars/' + calendarId + '?' + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apikey': config.calendarService.apikey
            },
        });

        const data = await response.json();
        return data;

    } catch (error) {
        throw error;
    }
};

// Update event in calendar
const updateEventInCalendar = async (calendarId, eventId, eventData) => {
    try {
        const response = await fetch(config.calendarService.baseUrl + ':' + config.calendarService.port + '/v1/calendars/' + calendarId + '/' + eventId, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'apikey': config.calendarService.apikey
            },
            body: JSON.stringify(eventData)
        });

        const data = await response.json();
        return data;

    } catch (error) {
        throw error;
    }
};

// Remove event from calendar
const removeEventFromCalendar = async (calendarId, eventId) => {
    try {
        const response = await fetch(config.calendarService.baseUrl + ':' + config.calendarService.port + '/v1/calendars/' + calendarId + '/' + eventId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'apikey': config.calendarService.apikey
            },
        });

        const data = await response.json();
        return data;

    } catch (error) {
        throw error;
    }
};

// Export
const calendarService = {
    createUserCalendar,
    addEventToCalendar,
    getEventsFromCalendar,
    updateEventInCalendar,
    removeEventFromCalendar
};

export default calendarService;
