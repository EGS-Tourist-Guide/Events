// Import necessary dependencies
import { Schema, model } from 'mongoose';

// Define the ApiKey schema
const apiKeySchema = new Schema({
    key:        { type: String, required: true, unique: true, immutable: true },
    active:     { type: Boolean, required: true, unique: false, immutable: false },
    createdAt:  { type: Date, default: Date.now, required: true, unique: false, immutable: true },
});

// Create the ApiKey model
const ApiKey = model('Key', apiKeySchema);

// Export the ApiKey model
export default ApiKey;
