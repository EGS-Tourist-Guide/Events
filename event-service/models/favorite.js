import mongoose from 'mongoose';

// Define the Favorite schema
const favoriteSchema = new mongoose.Schema({
    eventId:            { type: String, required: true, unique: false, immutable: true },
    userId:             { type: String, required: true, unique: false, immutable: true },
    favoriteStatus:     { type: Boolean, required: true, unique: false, immutable: false }
});

// Create the Favorite model
const Favorite = mongoose.model('Favorite', favoriteSchema);

// Export the Favorite model
export default Favorite;
