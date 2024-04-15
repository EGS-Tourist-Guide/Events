import config from "../config/config.js";

// Create calendar associated to user
const createUserCalendar = async (userId, maxRetries = 2, retryDelay = 250, timeout = 7500) => {
    try {
        const response = fetch(config.calendarService.baseUrl + ':' + config.calendarService.port + '/v1/' + userId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': config.calendarService.apikey
            },
        });

        // Wait for either the response or the timeout to occur
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                const timeoutError = new Error('createUserCalendar from ../services/calendar.js timed out');
                timeoutError.code = 'ETIMEOUT';
                reject(timeoutError);
            }, timeout);
        });
        await Promise.race([response, timeoutPromise]);

        const data = await response.json();
        return data;

    } catch (error) {
        if (maxRetries > 0) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return createUserCalendar(userId, maxRetries - 1, retryDelay + 250, timeout);
        }
        else {
            throw error;
        }
    }
};

// Add event to calendar
const addEventToCalendar = async (calendarId, eventData, maxRetries = 2, retryDelay = 250, timeout = 7500) => {
    try {
        const response = await fetch(config.calendarService.baseUrl + ':' + config.calendarService.port + '/v1/calendars/' + calendarId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': config.calendarService.apikey
            },
            body: JSON.stringify(eventData)
        });

        // Wait for either the response or the timeout to occur
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                const timeoutError = new Error('addEventToCalendar from ../services/calendar.js timed out');
                timeoutError.code = 'ETIMEOUT';
                reject(timeoutError);
            }, timeout);
        });
        await Promise.race([response, timeoutPromise]);

        const data = await response.json();
        return data;

    } catch (error) {
        if (maxRetries > 0) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return addEventToCalendar(calendarId, eventData, maxRetries - 1, retryDelay + 250, timeout);
        }
        else {
            throw error;
        }
    }
};

// Get events from calendar with optional search parameters
const getEventsFromCalendar = async (calendarId, searchParams, maxRetries = 2, retryDelay = 250, timeout = 7500) => {
    try {
        const params = new URLSearchParams();
        for (const key in searchParams) {
            params.append(key, searchParams[key]);
        }

        const response = fetch(config.calendarService.baseUrl + ':' + config.calendarService.port + '/v1/calendars/' + calendarId + '?' + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apikey': config.calendarService.apikey
            },
        });

        // Wait for either the response or the timeout to occur
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                const timeoutError = new Error('getEventsFromCalendar from ../services/calendar.js timed out');
                timeoutError.code = 'ETIMEOUT';
                reject(timeoutError);
            }, timeout);
        });
        await Promise.race([response, timeoutPromise]);

        const data = await response.json();
        return data;

    } catch (error) {
        if (maxRetries > 0) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return getEventsFromCalendar(calendarId, searchParams, maxRetries - 1, retryDelay + 250, timeout);
        }
        else {
            throw error;
        }
    }
};

// Update event in calendar
const updateEventInCalendar = async (calendarId, eventId, eventData, maxRetries = 2, retryDelay = 250, timeout = 7500) => {
    try {
        const response = fetch(config.calendarService.baseUrl + ':' + config.calendarService.port + '/v1/calendars/' + calendarId + '/' + eventId, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'apikey': config.calendarService.apikey
            },
            body: JSON.stringify(eventData)
        });

        // Wait for either the response or the timeout to occur
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                const timeoutError = new Error('updateEventInCalendar from ../services/calendar.js timed out');
                timeoutError.code = 'ETIMEOUT';
                reject(timeoutError);
            }, timeout);
        });
        await Promise.race([response, timeoutPromise]);

        const data = await response.json();
        return data;

    } catch (error) {
        if (maxRetries > 0) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return updateEventInCalendar(calendarId, eventId, eventData, maxRetries - 1, retryDelay + 250, timeout);
        }
        else {
            throw error;
        }
    }
};

// Remove event from calendar
const removeEventFromCalendar = async (calendarId, eventId, maxRetries = 2, retryDelay = 250, timeout = 7500) => {
    try {
        const response = fetch(config.calendarService.baseUrl + ':' + config.calendarService.port + '/v1/calendars/' + calendarId + '/' + eventId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'apikey': config.calendarService.apikey
            },
        });

        // Wait for either the response or the timeout to occur
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                const timeoutError = new Error('removeEventFromCalendar from ../services/calendar.js timed out');
                timeoutError.code = 'ETIMEOUT';
                reject(timeoutError);
            }, timeout);
        });
        await Promise.race([response, timeoutPromise]);

        const data = await response.json();
        return data;

    } catch (error) {
        if (maxRetries > 0) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return removeEventFromCalendar(calendarId, eventId, maxRetries - 1, retryDelay + 250, timeout);
        }
        else {
            throw error;
        }
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
