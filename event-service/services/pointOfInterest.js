import config from '../config/config.js';
import axios from 'axios';

// Perform operations on points of interest. Service is GraphQL based, so only a single function with a single query is needed
const performOperation = async (graphQLquery, maxRetries = 1, retryDelay = 1000, timeout = 7500) => {
    try {
        const response = await axios.post(config.poiService.baseUrl + ':' + config.poiService.port + '/graphql',
            {
                query: graphQLquery,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: timeout,
                signal: newAbortSignal(timeout)
            });

        return processMsg(response);

    } catch (error) {
        if (axios.isAxiosError(error) && (error.code === 'ECONNABORTED' || error.response === undefined)) {
            if (maxRetries > 0) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return performOperation(graphQLquery, maxRetries - 1, retryDelay + 250, timeout);
            }
            else {
                throw new Error('Maximum retries reached on performOperation');
            }
        }
        else {
            throw error;
        }
    }
};

// Process the message received from the service
const processMsg = (msg) => {
    if (msg.data.errors && msg.data.errors.length > 0) {
        const info = msg.data.errors[0].message.toString().toLowerCase();
        if (info.includes('no points of interest found')) {
            return 'ERR_NOT_FOUND';
        }
        else if (info.includes('point of interest not found')) {
            return 'ERR_ALREADY_DELETED';
        }
        else {
            return 'ERR_GATEWAY';
        }
    }
    else if (msg.data.data.createPointOfInterest) {
        const info = msg.data.data.createPointOfInterest.message.toString().toLowerCase();
        if (info.includes('name already exists')) {
            return 'ERR_CONFLICT_NAME';
        }
        else if (info.includes('already exists within')) {
            return 'ERR_CONFLICT_LOCATION';
        }
        else {
            return msg.data.data.createPointOfInterest.poi;
        }
    }
    else if (msg.data.data.searchPointsOfInterest) {
        return msg.data.data.searchPointsOfInterest;
    }
    else {
        return 'ERR_GATEWAY';
    }
}

// Create an abort signal with a timeout
const newAbortSignal = (timeoutMs) => {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), timeoutMs);
    return abortController.signal;
};

// Export
const poiService = {
    performOperation
};

export default poiService;
