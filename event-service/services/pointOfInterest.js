import config from "../config/config.js";

// Perform operations on points of interest. Service is GraphQL based, so only a single function with a single query is needed
const performOperation = async (graphQLquery) => {
    try {
        const response = await fetch(config.poiService.baseUrl + ':' + config.poiService.port + '/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': config.poiService.apikey
            },
            body: JSON.stringify(graphQLquery)
        });

        const data = await response.json();
        return data;

    } catch (error) {
        throw error;
    }
};

// Export
const poiService = {
    performOperation
};

export default poiService;
