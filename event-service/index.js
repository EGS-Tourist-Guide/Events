import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// Load environment variables
const loadEnvVariables = async () => {
  try {
    const __dirname = import.meta.dirname;
    dotenv.config({ path: path.join(__dirname, '../event-service/.env') });
  } catch (error) {
    throw error;
  }
};

// Configure the server
const configServer = async () => {
  const logger = (await import('../event-service/logger.js')).default;
  const config = (await import('../event-service/config/config.js')).default;
  const dbConnection = (await import('../event-service/database/connection.js')).default;
  const routerEvents = (await import('../event-service/routes/events.js')).default;
  const routerFiles = (await import('../event-service/routes/files.js')).default;
  const routerKeys = (await import('../event-service/routes/keys.js')).default;
  const swaggerUI = (await import('swagger-ui-express')).default;
  const swaggerSpec = (await import('../event-service/swagger.js')).default;

  // Create a new instance of the express server
  const app = express();
  const port = config.server.port;

  // Use middleware
  app.use(bodyParser.json());
  app.use(cors());

  // Use swagger route
  app.use('/v1/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

  // Use service routes
  app.use('/v1', routerKeys, routerEvents, routerFiles);

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
    throw error;
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
try {
  await loadEnvVariables();
  await configServer();
}
catch (error) {
  console.log('An error occurred while starting the server:\n')
  console.error(error);
}
