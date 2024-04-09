import mongoose from 'mongoose';
import crypto from 'crypto';
import validator from 'validator';
import config from '../config/config.js';
import dbConnection from '../database/connection.js';
import dbOperation from '../database/operations.js';
import ApiKey from '../models/key.js';
import Event from '../models/event.js';

// Verify if request authentication key is valid
const isValidAuthKey = async (req, res, next) => {
    try {

        // Check if the request contains header with the API key
        const authHeader = req.headers['service-api-key']

        if (authHeader === undefined) {
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
        const key = req.headers['service-api-key']
        const hashedKey = crypto.createHash('sha256').update(key + config.server.secret).digest('hex');

        if (mongoose.connection.readyState === 0) {
            await dbConnection.connect();
        }

        const validUser = await dbOperation.readDocument(ApiKey, hashedKey);

        if (validUser === null || validUser === undefined || !validUser.active) {
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

// Verify if who made the request has permission to perform the operation
const isOperationAllowed = async (req, res, next) => {
    try {
        if (typeof req.body.userId !== 'string' || !validator.isLength(req.body.userId.trim(), { min: 1, max: 1024 })) {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: 'Body parameter <userId> must be a non-empty string between 1 and 1024 characters long (excluding leading and trailing white spaces)',
                    example: 'id12345'
                }
            });
        }

        const userId = req.body.userId;
        const eventId = req.params.uuid;

        // Check if the user has permission to access the resource (if he was the one that created the resource)
        if (mongoose.connection.readyState === 0) {
            await dbConnection.connect();
        }

        const event = await dbOperation.readDocument(Event, eventId);

        // If the event does not exist
        if (event === null || event === undefined) {
            return res.status(404).json({
                error: {
                    code: '403',
                    message: 'Forbidden',
                    details: 'Cannot operate with data associated to a non-existing event'
                }
            });
        }

        // If the user is not the original creator of the event
        if(event.userId !== userId) {
            return res.status(403).json({
                error: {
                    code: '403',
                    message: 'Forbidden',
                    details: 'You do not have permission to perform this operation'
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
    isValidAuthKey,
    isOperationAllowed
};

export default authValidator;
