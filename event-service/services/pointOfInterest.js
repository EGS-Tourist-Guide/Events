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
        
        if (response.data && response.data.errors && response.data.errors.length > 0 && !response.data.errors[0].message.includes("found")) {
            throw new Error('Error in performOperation: ' + response.data.errors[0].message);
        }
        
        return response.data;

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

// Helper function
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
