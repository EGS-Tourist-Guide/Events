// Service configuration
const config = {
    amazonS3: {
        accessKeyId: process.env.AMAZONS3_SERVICE_ACCESS_KEY_ID,
        secretAccessKey: process.env.AMAZONS3_SERVICE_SECRET_ACCESS_KEY,
        region: process.env.AMAZONS3_SERVICE_REGION,
        bucket: process.env.AMAZONS3_SERVICE_BUCKET,
        url: process.env.AMAZONS3_SERVICE_URL,
        forcePathStyle: true
    },
    calendarService: {
        apikey: process.env.CALENDAR_SERVICE_KEY,
        baseUrl: process.env.CALENDAR_SERVICE_URL,
        port: process.env.CALENDAR_SERVICE_PORT
    },
    poiService: {
        apikey: process.env.POI_SERVICE_KEY,
        baseUrl: process.env.POI_SERVICE_URL,
        port: process.env.POI_SERVICE_PORT
    },
    database: {
        appName: process.env.API_NAME,
        dbName: process.env.DATABASE_NAME,
        uri: process.env.DATABASE_URI
    },
    server: {
        port: process.env.API_PORT || 3000,
        secret: process.env.API_SECRET || 'secret',
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
