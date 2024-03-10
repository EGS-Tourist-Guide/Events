import dotenv from 'dotenv';

// Service configuration
dotenv.config();

const config = {
    database: {
        appName: process.env.SERVICE_API_NAME || 'Events_Service',
        dbName: process.env.SERVICE_DATABASE_NAME || 'Events_Production',
        uri: process.env.SERVICE_DATABASE_URI || 'mongodb://localhost:27017',
    },
    server: {
        port: process.env.SERVICE_API_PORT || 3000,
        key: process.env.SERVICE_API_KEY || 'key'
    }
};

export default config;
