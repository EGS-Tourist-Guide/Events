import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Define the Event schema
const eventSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
        required: true,
        unique: true,
        immutable: true
    },
    name:                   { type: String, required: true, unique: false, immutable: false },
    organizer:              { type: String, required: true, unique: false, immutable: false },
    street:                 { type: String, required: true, unique: false, immutable: false },
    doorNumber:             { type: String, required: true, unique: false, immutable: false },
    postCode:               { type: String, required: true, unique: false, immutable: false },
    city:                   { type: String, required: true, unique: false, immutable: false },
    country:                { type: String, required: true, unique: false, immutable: false },
    contact:                { type: String, required: true, unique: false, immutable: false },
    category:               { type: String, required: true, unique: false, immutable: false },
    startDate:              { type: Date, required: true, unique: false, immutable: false },
    endDate:                { type: Date, required: true, unique: false, immutable: false },
    about:                  { type: String, required: true, unique: false, immutable: false },
    price:                  { type: Number, default: 0, required: true, unique: false, immutable: false, min:0 },
    currency:               { type: String, default: '---', required: true, unique: false, immutable: false },
    favorites:              { type: Number, default: 0, required: true, unique: false, immutable: false, min:0 },
    pointOfInterest:        { type: String, required: false, unique: false, immutable: false },
    maxParticipants:        { type: Number, required: false, unique: false, immutable: false, min:0 },
    currentParticipants:    { type: Number, required: false, unique: false, immutable: false, min:0 },
    createdAt:              { type: Date, default: Date.now, required: true, unique: false, immutable: true },
});

// Create the Event model
const Event = mongoose.model('Event', eventSchema);

// Export the Event model
export default Event;
