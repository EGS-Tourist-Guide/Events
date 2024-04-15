import config from '../config/config.js';

// Perform operations on points of interest. Service is GraphQL based, so only a single function with a single query is needed
const performOperation = async (graphQLquery, maxRetries = 2, retryDelay = 250, timeout = 7500) => {
    try {
        const response = fetch(config.poiService.baseUrl + ':' + config.poiService.port + '/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: graphQLquery })
        });

        // Wait for either the response or the timeout to occur
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                const timeoutError = new Error('performOperation from ../services/pointOfInterest.js timed out');
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
            return performOperation(graphQLquery, maxRetries - 1, retryDelay + 250, timeout);
        }
        else {
            throw error;
        }
    }
};

// Export
const poiService = {
    performOperation
};

export default poiService;
