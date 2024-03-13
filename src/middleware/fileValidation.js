import multer from 'multer';
import config from '../config/config.js';

// Create a new instance of multer and configure it to handle file uploads according to the service configuration
const upload = multer({
    fileFilter: (req, file, cb) => {
        if (!config.server.allowedImageType.includes(file.mimetype)) {
            cb(null, false);
            cb(new Error('INVALID_FILE_TYPE'));
        }
        else {
            cb(null, true);
        }
    },
    limits: { fileSize: config.server.allowedImageMaxSizeMB * 1024 * 1024 }
}).single('image'); // The name of the file input field


// Verify if request contains a valid file type with a valid size
const isValidFile = (req, res, next) => {
    try {
        // Call the multer instance to handle the file and check for errors
        upload(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(413).json({
                        error: {
                            code: '413',
                            message: 'Payload Too Large',
                            details: 'The file size exceeds the maximum allowed size of 10MB'
                        }
                    });
                }
            }
            else if (err) {
                if (err.message === 'INVALID_FILE_TYPE') {
                    return res.status(415).json({
                        error: {
                            code: '415',
                            message: 'Unsupported Media Type',
                            details: `The file type is not supported. Supported types are: [${config.server.allowedImageType.join(', ')}]`,
                        }
                    });
                }
            }

            // All checks passed, continue
            next();
        });
    }
    catch (err) {
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
const fileValidator = {
    isValidFile
};

export default fileValidator;
