import mongoose from 'mongoose';
import crypto from 'crypto';
import config from '../config/config.js';
import dbConnection from '../database/connection.js';
import dbOperation from '../database/operations.js';
import ApiKey from '../models/key.js';

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
        const query = {
            key: hashedKey
        };

        if (mongoose.connection.readyState === 0) {
            await dbConnection.connect();
        }

        const apiKey = await dbOperation.readAllDocuments(ApiKey, query);

        if (apiKey === undefined || apiKey.length === 0 || !apiKey[0].active) {
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
