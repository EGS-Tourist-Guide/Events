import dotenv from 'dotenv';

// Service configuration
dotenv.config();

const config = {
    database: {
        appName: process.env.SERVICE_API_NAME || 'Events_Service',
        dbName: process.env.SERVICE_DATABASE_NAME || 'Events_Production',
        uri: process.env.SERVICE_DATABASE_URI || 'mongodb://localhost:27017',
    },
    firebaseStorage: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_BUCKET_ID,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
    },
    server: {
        port: process.env.SERVICE_API_PORT || 3000,
        key: process.env.SERVICE_API_KEY || 'key',
        allowedSearchParams: ['search', 'name', 'organizer', 'city', 'category', 'startdate', 'minprice', 'maxprice', 'limit', 'offset'],
        allowedCategories: ['business', 'conference', 'culture', 'networking', 'technology', 'sports', 'wellness', 'workshop']
    },
};

export default config;
