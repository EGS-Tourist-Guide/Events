import express  from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Create a new instance of the express server
const app = express();
const port = process.env.PORT || 3000;

// Load environment variables
dotenv.config();

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
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
