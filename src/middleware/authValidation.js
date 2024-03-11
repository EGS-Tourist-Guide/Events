import config from '../config/config.js';

// Verify if request authentication key is valid
const isValidAuthKey = (req, res, next) => {
    try {

        // Check if the request contains header with the API key
        const authHeader = req.headers['service-api-key']

        if (!authHeader) {
            res.setHeader('WWW-Authenticate', 'Basic realm="service-api-key"');
            return res.status(401).json({
                error: {
                    code: '401',
                    message: 'Unauthorized',
                    details: 'Authentication header is missing'
                }
            });
        }

        // Check if the API key is valid
        if (authHeader !== config.server.key) {
            res.setHeader('WWW-Authenticate', 'Basic realm="service-api-key"');
            return res.status(401).json({
                error: {
                    code: '401',
                    message: 'Unauthorized',
                    details: 'Authentication key is invalid'
                }
            });
        }

        // All checks passed, continue
        next();

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
const authValidator = {
    isValidAuthKey
};

export default authValidator;
