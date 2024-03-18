import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// Load environment variables
const loadEnvVariables = async () => {
  const __dirname = import.meta.dirname;
  dotenv.config({ path: path.join(__dirname, '../src/.env') });
};

// Configure the server
const configServer = async () => {
  const config = (await import('../src/config/config.js')).default;
  const dbConnection = (await import('../src/database/connection.js')).default;
  const routerEvents = (await import('../src/routes/events.js')).default;
  const routerImages = (await import('../src/routes/images.js')).default;
  const routerKeys = (await import('../src/routes/keys.js')).default;
  const swaggerUI = (await import('swagger-ui-express')).default;
  const swaggerSpec = (await import('../src/swagger/swagger.js')).default;

  // Create a new instance of the express server
  const app = express();
  const port = config.server.port;

  // Use middleware
  app.use(bodyParser.json());
  app.use(cors());

  // Use swagger route
  app.use('/v1/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

  // Use service routes
  app.use('/v1', routerKeys, routerEvents, routerImages);

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
    console.log('Database connection has been successfully closed!')
    console.log('Server has been stopped');
    process.exit(0);
  });
};

// Start the server
await loadEnvVariables();
await configServer();
