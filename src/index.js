import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import config from '../src/config/config.js';
import router from '../src/routes/events.js';
import dbConnection from '../src/database/connection.js';
import firebaseStorage from '../src/services/firebaseStorage.js';

// Create a new instance of the express server
const app = express();
const port = config.server.port;

// Apply middleware
app.use(bodyParser.json());
app.use(cors());

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

// Handle process initialization
try {
  console.log('Connecting to the database...');
  await dbConnection.connect();
  console.log('Database connection has been successfully established!');
  console.log('Initializing Firebase Storage...')
  await firebaseStorage.initializeStorage();
  console.log('Firebase Storage has been successfully initialized!');
  console.log('Starting server...');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

} catch (error) {
  console.error(error);
}

// Handle process termination
process.once('SIGINT', async () => {
  console.log('Closing database connection...');
  await dbConnection.disconnect();
  console.log('Database connection has been succesfully closed!')
  console.log('Server has been stopped');
  process.exit(0);
});
