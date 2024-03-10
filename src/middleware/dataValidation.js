import validator from 'validator';

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
        const allowedParameters = ['name', 'organizer', 'city', 'category', 'startdate', 'minprice', 'maxprice'];
        const invalidParams = Object.keys(req.query).filter(param => !allowedParameters.includes(param.toLocaleLowerCase()));

        if (invalidParams.length > 0) {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: `Query parameter(s) <${invalidParams.join(', ')}> is not allowed. Must be one of the following: [name, organizer, city, category, startDate, minPrice, maxPrice]`,
                    example: '?name=Event_Name&organizer=Organizer_Name&city=City_Name&category=Category_Name&startDate=2024-12-31T23:59:59Z&minPrice=EUR10.00&maxPrice=EUR100.00'
                }
            });
        }

        // Check if valid query parameters are of the correct type and format
        if (req.query.name !== undefined) {
            if (typeof req.query.name !== 'string' || !validator.isLength(req.query.name.trim(), { min: 1, max: 256 })) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: 'Query parameter <name> must be a non-empty string between 1 and 256 characters long (excluding leading and trailing white spaces)',
                        example: 'Event_name'
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
                        example: 'Organizer_name'
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
                        example: 'City_name'
                    }
                });
            }
        }

        if (req.query.category !== undefined) {
            const options = ["business", "conference", "culture", "networking", "technology", "sports", "wellness", "workshop"];
            if (typeof req.query.category !== 'string' || !validator.isIn(req.query.category.toLowerCase(), options)) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: 'Query parameter <category> must be a string of one of the following categories: [business, conference, culture, networking, technology, sports, wellness, workshop]',
                        example: 'sports'
                    }
                });
            }
        }

        if(req.query.startDate !== undefined) {
            if (typeof req.query.startDate !== 'string' || !validator.isRFC3339(req.query.startDate)) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: 'Query parameter <startDate> must be a string in the RFC 3339 format',
                        example: '2024-12-31T23:59:59Z'
                    }
                });
            }
        }

        if (req.query.minPrice !== undefined) {
            const pattern = /^(EUR|USD|GBP)\d+\.\d{2}$/;
            if (typeof req.query.minPrice !== 'string' || !pattern.test(req.query.minPrice)) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: 'Query parameter <minPrice> must be a string in the correct format',
                        example: 'EUR10.00'
                    }
                });
            }
        }

        if (req.query.maxPrice !== undefined) {
            const pattern = /^(EUR|USD|GBP)\d+\.\d{2}$/;
            if (typeof req.query.maxPrice !== 'string' || !pattern.test(req.query.maxPrice)) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: 'Query parameter <maxPrice> must be a string in the correct format',
                        example: 'EUR10.00'
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
            'doorNumber',
            'postCode',
            'city',
            'country',
            'contact',
            'category',
            'startDate',
            'endDate',
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

        if (typeof req.body.doorNumber !== 'string' || !validator.isLength(req.body.doorNumber.trim(), { min: 1, max: 256 })) {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: 'Body parameter <doorNumber> must be a non-empty string between 1 and 256 characters long (excluding leading and trailing white spaces)',
                    example: 'N123'
                }
            });
        }

        if (typeof req.body.postCode !== 'string' || !validator.isLength(req.body.postCode.trim(), { min: 1, max: 256 })) {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: 'Body parameter <postCode> must be a non-empty string between 1 and 256 characters long (excluding leading and trailing white spaces)',
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

        const options = ["business", "conference", "culture", "networking", "technology", "sports", "wellness", "workshop"];
        if (typeof req.body.category !== 'string' || !validator.isIn(req.body.category.toLowerCase(), options)) {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: 'Body parameter <category> must be a string of one of the following categories: [business, conference, culture, networking, technology, sports, wellness, workshop]',
                    example: 'sports'
                }
            });
        }

        if (typeof req.body.startDate !== 'string' || !validator.isRFC3339(req.body.startDate)) {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: 'Body parameter <startDate> must be a string in the RFC 3339 format',
                    example: '2024-12-31T23:59:59Z'
                }
            });
        }

        if (typeof req.body.endDate !== 'string' || !validator.isRFC3339(req.body.endDate)) {
            return res.status(400).json({
                error: {
                    code: '400',
                    message: 'Bad Request',
                    details: 'Body parameter <endDate> must be a string in the RFC 3339 format',
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
            const pattern = /^(EUR|USD|GBP)\d+\.\d{2}$/;
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

        if (req.body.maxParticipants !== undefined) {
            if (typeof req.body.maxParticipants !== 'number' || !Number.isInteger(req.body.maxParticipants) || req.body.maxParticipants < 0) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: 'Body parameter <maxParticipants> must be a non-negative integer',
                        example: '100'
                    }
                });
            }
        }

        if (req.body.currentParticipants !== undefined) {
            if (typeof req.body.currentParticipants !== 'number' || !Number.isInteger(req.body.currentParticipants) || req.body.currentParticipants < 0) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: 'Body parameter <currentParticipants> must be a non-negative integer',
                        example: '50'
                    }
                });
            }
        }

        if (req.body.favorites !== undefined) {
            if (typeof req.body.favorites !== 'number' || !Number.isInteger(req.body.favorites) || req.body.favorites < 0) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: 'Body parameter <favorites> must be a non-negative integer',
                        example: '10'
                    }
                });
            }
        }

        if (req.body.thumbnail !== undefined) {
            if (typeof req.body.thumbnail !== 'string' || !validator.isLength(req.body.thumbnail.trim(), { min: 1, max: 512 })) {
                return res.status(400).json({
                    error: {
                        code: '400',
                        message: 'Bad Request',
                        details: 'Body parameter <thumbnail> must be a non-empty string between 1 and 512 characters long (excluding leading and trailing white spaces)',
                        example: 'https://www.example.com/image.jpg'
                    }
                });
            }
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
