import mongoose from 'mongoose';

// Define the ApiKey schema
const apiKeySchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        unique: true,
        immutable: true
    },
    appId:  { type: String, required: true, unique: true, immutable: true },
    active:     { type: Boolean, default: true, required: true, unique: false, immutable: false },
    createdAt:  { type: Date, default: Date.now, required: true, unique: false, immutable: true },
});

// Create the ApiKey model
const ApiKey = mongoose.model('ApiKey', apiKeySchema);

// Export the ApiKey model
export default ApiKey;
