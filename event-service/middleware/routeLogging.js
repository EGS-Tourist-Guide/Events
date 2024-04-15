import { v4 as uuidv4 } from 'uuid';
import logger from '../logger.js';

// Log incoming request
const request = async (req, res, next) => {

    // Generate a unique ID for the log message to track the request and response
    req.logID = uuidv4();
    try {
        logger.logInfo.info({
            message: `[REQUEST] ${req.method} ${req.originalUrl}`,
            messageID: req.logID,
            fromIP: req.ip,
            params: req.params,
            query: req.query,
            body: req.body
        });

        next();

    } catch (error) {
        error.messageID = req.logID;
        logger.logError.error(error); // Write to error log file
    }
};

const response = async (req, res, next) => {
    try {
        res.on('finish', () => {
            logger.logInfo.info({
                message: `[RESPONSE] ${req.method} ${req.originalUrl}`,
                messageID: req.logID,
                toIP: req.ip,
                status_code: res.statusCode,
            });
        });

        next();

    } catch (error) {
        error.messageID = req.logID;
        logger.logError.error(error); // Write to error log file
    }
}

// Export 
const routeLogger = {
    request,
    response,
};

export default routeLogger;
