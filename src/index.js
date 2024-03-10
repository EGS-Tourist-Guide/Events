import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a new instance of the express server
const app = express();
const port = process.env.SERVICE_API_PORT || 3000;

// Apply middleware
app.use(bodyParser.json());
app.use(cors());

// Import route files
import router from '../src/routes/events.js';

// Use routes
app.use('/v1', router);

// Default 404 route
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: '404',
      message: 'Not Found',
      details: 'The requested resource does not exist',
    }
  });
});

// Start the server
try {
  console.log('Starting server...');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} catch (error) {
  console.error('Failed to start server', error);
}
