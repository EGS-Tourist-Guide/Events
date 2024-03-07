// Import necessary dependencies
import { Schema, model } from 'mongoose';

// Define the Event schema
const eventSchema = new Schema({
    uuid:                   { type: String, required: true, unique: true, immutable: true },
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
    price:                  { type: Number, required: false, unique: false, immutable: false, min:0 },
    currency:               { type: String, required: false, unique: false, immutable: false },
    pointOfInterest:        { type: String, required: false, unique: false, immutable: false },
    maxParticipants:        { type: Number, required: false, unique: false, immutable: false, min:0 },
    currentParticipants:    { type: Number, required: false, unique: false, immutable: false, min:0 },
    favorites:              { type: Number, required: false, unique: false, immutable: false, min:0 },
    thumbnail:              { type: String, required: false, unique: false, immutable: false },
    createdAt:              { type: Date, default: Date.now, required: true, unique: false, immutable: true },
});

// Create the Event model
const Event = model('Event', eventSchema);

// Export the Event model
export default Event;
