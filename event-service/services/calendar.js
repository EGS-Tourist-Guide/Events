import config from "../config/config.js";
import axios from 'axios';

// Create calendar associated to user
const createUserCalendar = async (userId, maxRetries = 2, retryDelay = 250, timeout = 7500) => {
    try {
        const response = await axios.post(config.calendarService.baseUrl + ':' + config.calendarService.port + '/v1/' + userId,
        {
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': config.calendarService.apikey
            },
            timeout: timeout,
            signal: newAbortSignal(timeout)
        });

        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error) && (error.code === 'ECONNABORTED' || error.response === undefined)) {
            if (maxRetries > 0) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return createUserCalendar(userId, maxRetries - 1, retryDelay + 250, timeout);
            }
            else {
                throw new Error('Maximum retries reached on createUserCalendar');
            }
        }
        else {
            throw error;
        }
    }
};

// Add event to calendar
const addEventToCalendar = async (calendarId, eventData, maxRetries = 2, retryDelay = 250, timeout = 7500) => {
    try {
        const response = await axios.post(config.calendarService.baseUrl + ':' + config.calendarService.port + '/v1/calendars/' + calendarId,
        {
            ...eventData
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': config.calendarService.apikey
            },
            timeout: timeout,
            signal: newAbortSignal(timeout)
        });

        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error) && (error.code === 'ECONNABORTED' || error.response === undefined)) {
            if (maxRetries > 0) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return addEventToCalendar(calendarId, eventData, maxRetries - 1, retryDelay + 250, timeout);
            }
            else {
                throw new Error('Maximum retries reached on addEventToCalendar');
            }
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

        const response = await axios.get(config.calendarService.baseUrl + ':' + config.calendarService.port + '/v1/calendars/' + calendarId + '?' + params,
        {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': config.calendarService.apikey
            },
            timeout: timeout,
            signal: newAbortSignal(timeout)
        });

        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error) && (error.code === 'ECONNABORTED' || error.response === undefined)) {
            if (maxRetries > 0) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return getEventsFromCalendar(calendarId, searchParams, maxRetries - 1, retryDelay + 250, timeout);
            }
            else {
                throw new Error('Maximum retries reached on getEventsFromCalendar');
            }
        }
        else {
            throw error;
        }
    }
};

// Update event in calendar
const updateEventInCalendar = async (calendarId, eventId, eventData, maxRetries = 2, retryDelay = 250, timeout = 7500) => {
    try {
        const params = new URLSearchParams();
        for (const key in searchParams) {
            params.append(key, searchParams[key]);
        }

        const response = await axios.patch(config.calendarService.baseUrl + ':' + config.calendarService.port + '/v1/calendars/' + calendarId + '/' + eventId,
        {
            ...eventData
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': config.calendarService.apikey
            },
            timeout: timeout,
            signal: newAbortSignal(timeout)
        });

        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error) && (error.code === 'ECONNABORTED' || error.response === undefined)) {
            if (maxRetries > 0) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return updateEventInCalendar(calendarId, eventId, eventData, maxRetries - 1, retryDelay + 250, timeout);
            }
            else {
                throw new Error('Maximum retries reached on updateEventInCalendar');
            }
        }
        else {
            throw error;
        }
    }
};

// Remove event from calendar
const removeEventFromCalendar = async (calendarId, eventId, maxRetries = 2, retryDelay = 250, timeout = 7500) => {
    try {
        const response = await axios.delete(config.calendarService.baseUrl + ':' + config.calendarService.port + '/v1/calendars/' + calendarId + '/' + eventId,
        {
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': config.calendarService.apikey
            },
            timeout: timeout,
            signal: newAbortSignal(timeout)
        });

        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error) && (error.code === 'ECONNABORTED' || error.response === undefined)) {
            if (maxRetries > 0) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return removeEventFromCalendar(calendarId, eventId, maxRetries - 1, retryDelay + 250, timeout);
            }
            else {
                throw new Error('Maximum retries reached on removeEventFromCalendar');
            }
        }
        else {
            throw error;
        }
    }
};

// Helper function
const newAbortSignal = (timeoutMs) => {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), timeoutMs);
    return abortController.signal;
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
