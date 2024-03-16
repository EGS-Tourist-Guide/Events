// Service configuration
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
        allowedCategories: ['business', 'conference', 'culture', 'networking', 'technology', 'sports', 'wellness', 'workshop'], // Allowed event categories
        allowedSearchParams: ['limit', 'offset', 'search', 'name', 'organizer', 'city', 'category', 'startdate', 'beforedate', 'afterdate', 'maxprice' ], // Allowed query parameters
        allowedGenericSearchParams: ['name', 'organizer', 'category'], // Fields that can be searched using the <search> query parameter
        allowedFileType: ['image/jpeg'], // Allowed MIME types for files
        allowedFileMaxSizeMB: 10, // Allowed maximum file size in MB
        allowedFileNumber: 1, // Allowed number of files per request
        priceFormatReq: /^(EUR|USD|GBP)\d+\.\d{2}$/, // Regular expression to validate the price format in a request
        priceFormatQuery: /^(\d+\.\d{2})$/ // Regular expression to validate the price format in a query parameter
    },
};

export default config;
