import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Define the Event schema
const eventSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        unique: true,
        immutable: true
    },
    userid:                 { type: String, required: true, unique: false, immutable: true },
    organizer:              { type: String, required: true, unique: false, immutable: false },
    category:               { type: String, required: true, unique: false, immutable: false },
    contact:                { type: String, required: true, unique: false, immutable: false },
    price:                  { type: Number, default: 0, required: true, unique: false, immutable: false, min:0 },
    currency:               { type: String, default: '---', required: true, unique: false, immutable: false },
    favorites:              { type: Number, default: 0, required: true, unique: false, immutable: false, min:0 },
    maxparticipants:        { type: Number, required: false, unique: false, immutable: false, min:0 },
    currentparticipants:    { type: Number, required: false, unique: false, immutable: false, min:0 },
    calendarid:             { type: String, required: true, unique: false, immutable: true },
    pointofinterestid:      { type: String, required: true, unique: false, immutable: true },
    created:                { type: Date, default: Date.now, required: true, unique: false, immutable: true },
});

// Create the Event model
const Event = mongoose.model('Event', eventSchema);

// Export the Event model
export default Event;
