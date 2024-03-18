import validator from 'validator';
import config from '../config/config.js';

// Verify if request contains a valid UUIDv4 parameter
const isValidUUID = (req, res, next) => {
    try {

        // Check if parameter is a string in the UUIDv4 format
        const uuid = req.params.uuid;

        if (typeof uuid !== 'string' || !validator.isUUID(uuid, 4)) {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: 'URL parameter <uuid> must be a string in the UUIDv4 format',
                    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851'
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

// Verify if request contains valid query parameters
const isValidQuery = (req, res, next) => {
    try {

        // Check if invalid query parameters are present in the request
        const allowedParameters = config.server.allowedSearchParams;
        const invalidParams = Object.keys(req.query).filter(param => !allowedParameters.includes(param.toLocaleLowerCase()));

        if (invalidParams.length > 0) {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: `Query parameter(s) <${invalidParams.join(', ')}> is not allowed. Must be one of the following: [${allowedParameters.join(', ')}]`,
                    example: '?limit=25&offset=0&search=Event_Name&name=Event_Name&organizer=Organizer_Name&city=City_Name&category=Sports&startdate=2024-12-31T23:59:59Z&maxprice=100.00'
                }
            });
        }

        // Check if valid query parameters are of the correct type and format
        if (req.query.limit !== undefined) {
            const limit = Number.parseInt(req.query.limit);
            if (isNaN(limit) || !Number.isInteger(limit) || limit < 1 || limit > 50) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: 'Query parameter <limit> must be a string that represents a valid positive integer between 1 and 50',
                        example: 'limit=25'
                    }
                });
            }
        }

        if (req.query.offset !== undefined) {
            const offset = Number.parseInt(req.query.offset);
            if (isNaN(offset) || !Number.isInteger(offset) || offset < 0) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: 'Query parameter <offset> must be a string that represents a valid non-negative integer',
                        example: 'offset=50'
                    }
                });
            }
        }

        if (req.query.search !== undefined) {
            if (typeof req.query.search !== 'string' || !validator.isLength(req.query.search.trim(), { min: 1, max: 256 })) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: 'Query parameter <search> must be a non-empty string between 1 and 256 characters long (excluding leading and trailing white spaces)',
                        example: 'search=Generic string'
                    }
                });
            }
        }

        if (req.query.name !== undefined) {
            if (typeof req.query.name !== 'string' || !validator.isLength(req.query.name.trim(), { min: 1, max: 256 })) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: 'Query parameter <name> must be a non-empty string between 1 and 256 characters long (excluding leading and trailing white spaces)',
                        example: 'name=Event_name'
                    }
                });
            }
        }

        if (req.query.organizer !== undefined) {
            if (typeof req.query.organizer !== 'string' || !validator.isLength(req.query.organizer.trim(), { min: 1, max: 256 })) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: 'Query parameter <organizer> must be a non-empty string between 1 and 256 characters long (excluding leading and trailing white spaces)',
                        example: 'organizer=Organizer_name'
                    }
                });
            }
        }

        if (req.query.city !== undefined) {
            if (typeof req.query.city !== 'string' || !validator.isLength(req.query.city.trim(), { min: 1, max: 256 })) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: 'Query parameter <city> must be a non-empty string between 1 and 256 characters long (excluding leading and trailing white spaces)',
                        example: 'city=City_name'
                    }
                });
            }
        }

        if (req.query.category !== undefined) {
            const allowedOptions = config.server.allowedCategories;
            if (typeof req.query.category !== 'string' || !validator.isIn(req.query.category.toLowerCase(), allowedOptions)) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: `Query parameter <category> must be a string of one of the following categories: [${allowedOptions.join(', ')}]`,
                        example: 'category=sports'
                    }
                });
            }
        }

        if (req.query.startdate !== undefined) {
            if (typeof req.query.startdate !== 'string' || !validator.isRFC3339(req.query.startdate)) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: 'Query parameter <startDate> must be a string in the RFC 3339 format',
                        example: 'startDate=2024-12-31T23:59:59Z'
                    }
                });
            }
        }

        if (req.query.beforedate !== undefined) {
            if (typeof req.query.beforedate !== 'string' || !validator.isRFC3339(req.query.beforedate)) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: 'Query parameter <beforedate> must be a string in the RFC 3339 format',
                        example: 'beforedate=2024-12-31T23:59:59Z'
                    }
                });
            }
        }

        if (req.query.afterdate !== undefined) {
            if (typeof req.query.afterdate !== 'string' || !validator.isRFC3339(req.query.afterdate)) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: 'Query parameter <afterdate> must be a string in the RFC 3339 format',
                        example: 'afterdate=2024-12-31T23:59:59Z'
                    }
                });
            }
        }

        if (req.query.maxprice !== undefined) {
            const pattern = config.server.priceFormatQuery;
            if (typeof req.query.maxprice !== 'string' || !pattern.test(req.query.maxprice)) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: 'Query parameter <maxPrice> must be a string in the correct format',
                        example: 'maxPrice=10.00'
                    }
                });
            }
        }

        // All checks passed, continue
        next();

    }
    catch (error) {
        return res.status(500).json({
            error: {
                code: '500',
                message: 'Internal Server Error',
                details: 'An unexpected error has occurred. Please try again later'
            }
        });
    }
};

// Verify if request contains a valid body
const isValidBody = (req, res, next) => {
    try {

        // Check if request body is not missing or empty
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: 'Request body is missing or empty'
                }
            });
        }

        // Check if all required body parameters are present in the request body
        const requiredParameters = [
            'name',
            'organizer',
            'street',
            'doornumber',
            'postcode',
            'city',
            'country',
            'contact',
            'category',
            'startdate',
            'enddate',
            'about',
        ];

        for (const param of requiredParameters) {
            if (req.body[param] === undefined) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: `Request body is missing the required parameter: ${param}`
                    }
                });
            }
        }

        // Check if all required body parameters are of the correct type and format
        if (typeof req.body.name !== 'string' || !validator.isLength(req.body.name.trim(), { min: 1, max: 256 })) {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: 'Body parameter <name> must be a non-empty string between 1 and 256 characters long (excluding leading and trailing white spaces)',
                    example: 'Event_name'
                }
            });
        }

        if (typeof req.body.organizer !== 'string' || !validator.isLength(req.body.organizer.trim(), { min: 1, max: 256 })) {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: 'Body parameter <organizer> must be a non-empty string between 1 and 256 characters long (excluding leading and trailing white spaces)',
                    example: 'Organizer_name'
                }
            });
        }

        if (typeof req.body.street !== 'string' || !validator.isLength(req.body.street.trim(), { min: 1, max: 256 })) {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: 'Body parameter <street> must be a non-empty string between 1 and 256 characters long (excluding leading and trailing white spaces)',
                    example: 'Street_name'
                }
            });
        }

        if (typeof req.body.doornumber !== 'string' || !validator.isLength(req.body.doornumber.trim(), { min: 1, max: 256 })) {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: 'Body parameter <doornumber> must be a non-empty string between 1 and 256 characters long (excluding leading and trailing white spaces)',
                    example: 'N123'
                }
            });
        }

        if (typeof req.body.postcode !== 'string' || !validator.isLength(req.body.postcode.trim(), { min: 1, max: 256 })) {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: 'Body parameter <postcode> must be a non-empty string between 1 and 256 characters long (excluding leading and trailing white spaces)',
                    example: '1234-567'
                }
            });
        }

        if (typeof req.body.city !== 'string' || !validator.isLength(req.body.city.trim(), { min: 1, max: 256 })) {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: 'Body parameter <city> must be a non-empty string between 1 and 256 characters long (excluding leading and trailing white spaces)',
                    example: 'City_name'
                }
            });
        }

        if (typeof req.body.country !== 'string' || !validator.isLength(req.body.country.trim(), { min: 1, max: 256 })) {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: 'Body parameter <country> must be a non-empty string between 1 and 256 characters long (excluding leading and trailing white spaces)',
                    example: 'Country_name'
                }
            });
        }

        if (typeof req.body.contact !== 'string' || !validator.isEmail(req.body.contact)) {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: 'Body parameter <contact> must be a string in a valid email format',
                    example: 'user@domain.com'
                }
            });
        }

        const allowedOptions = config.server.allowedCategories;
        if (typeof req.body.category !== 'string' || !validator.isIn(req.body.category.toLowerCase(), allowedOptions)) {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: `Body parameter <category> must be a string of one of the following categories: [${allowedOptions.join(', ')}]`,
                    example: 'sports'
                }
            });
        }

        if (typeof req.body.startdate !== 'string' || !validator.isRFC3339(req.body.startdate)) {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: 'Body parameter <startdate> must be a string in the RFC 3339 format',
                    example: '2024-12-31T23:59:59Z'
                }
            });
        }

        if (typeof req.body.enddate !== 'string' || !validator.isRFC3339(req.body.enddate)) {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: 'Body parameter <enddate> must be a string in the RFC 3339 format',
                    example: '2024-12-31T23:59:59Z'
                }
            });
        }

        if (typeof req.body.about !== 'string' || !validator.isLength(req.body.about.trim(), { min: 1, max: 2048 })) {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: 'Body parameter <about> must be a non-empty string between 1 and 2048 characters long (excluding leading and trailing white spaces)',
                    example: 'This is a description of the event'
                }
            });
        }

        // Check if optional body parameters, should they exist, are of the correct type and format
        if (req.body.price !== undefined) {
            const pattern = config.server.priceFormatReq;
            if (typeof req.body.price !== 'string' || !pattern.test(req.body.price)) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: 'Body parameter <price> must be a string in the correct format',
                        example: 'EUR10.00'
                    }
                });
            }
        }

        if (req.body.pointofinterest !== undefined) {
            if (typeof req.body.pointofinterest !== 'string' || !validator.isLength(req.body.pointofinterest.trim(), { min: 1, max: 256 })) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: 'Body parameter <pointofinterest> must be a non-empty string between 1 and 256 characters long (excluding leading and trailing white spaces)',
                        example: 'Point of interest'
                    }
                });
            }
        }

        if (req.body.maxparticipants !== undefined) {
            if (typeof req.body.maxparticipants !== 'number' || !Number.isInteger(req.body.maxparticipants) || req.body.maxparticipants < 0 || req.body.maxparticipants > 9999999999) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: 'Body parameter <maxparticipants> must be a non-negative integer with a maximum value of 9999999999',
                        example: '100'
                    }
                });
            }
        }

        if (req.body.currentparticipants !== undefined) {
            if (typeof req.body.currentparticipants !== 'number' || !Number.isInteger(req.body.currentparticipants) || req.body.currentparticipants < 0 || req.body.currentparticipants > 9999999999) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: 'Body parameter <currentparticipants> must be a non-negative integer with a maximum value of 9999999999',
                        example: '50'
                    }
                });
            }
        }

        // Remove any additional parameters that are part of the schema but are not valid in a request
        if (req.body._id !== undefined) {
            delete req.body._id;
        }
        if (req.body.favorites !== undefined) {
            delete req.body.favorites;
        }
        if (req.body.created !== undefined) {
            delete req.body.created;
        }
        if (req.body.currency !== undefined) {
            delete req.body.currency;
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
const dataValidator = {
    isValidUUID,
    isValidQuery,
    isValidBody
};

export default dataValidator;
