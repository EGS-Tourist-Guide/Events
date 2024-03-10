import mongoose from 'mongoose';

// Open connection to the database
const connect = async () => {
    try {
        await mongoose.connect(process.env.SERVICE_DATABASE_URL,
            {
                appName: process.env.SERVICE_API_NAME,
                dbName: process.env.SERVICE_DATABASE_NAME,
                autoIndex: false,
            });
    } catch (error) {
        throw error;
    }
};

// Close connection to the database
const disconnect = async () => {
    try {
        await mongoose.disconnect();
    } catch (error) {
        throw error;
    }
};

// Export
const dbConnection = {
    connect,
    disconnect
};

export default dbConnection;
