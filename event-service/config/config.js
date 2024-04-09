// Service configuration
const config = {
    amazonS3: {
        accessKeyId: process.env.AMAZON_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AMAZON_S3_SECRET_ACCESS_KEY,
        region: process.env.AMAZON_S3_REGION,
        bucket: process.env.AMAZON_S3_BUCKET,
        url: process.env.AMAZON_S3_URL,
        forcePathStyle: true
    },
    database: {
        appName: process.env.SERVICE_API_NAME || 'Events_Service',
        dbName: process.env.SERVICE_DATABASE_NAME || 'Events_Production',
        uri: process.env.SERVICE_DATABASE_URI || 'mongodb://localhost:27017',
    },
    server: {
        port: process.env.SERVICE_API_PORT || 3000,
        secret: process.env.SERVICE_API_SECRET || 'secret',
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
