import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Define the ApiKey schema
const apiKeySchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
        required: true,
        unique: true,
        immutable: true
    },
    active:     { type: Boolean, required: true, unique: false, immutable: false },
    createdAt:  { type: Date, default: Date.now, required: true, unique: false, immutable: true },
});

// Create the ApiKey model
const ApiKey = mongoose.model('Key', apiKeySchema);

// Export the ApiKey model
export default ApiKey;
