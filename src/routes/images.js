import express from 'express';
import authValidator from '../middleware/authValidation.js';
import dataValidator from '../middleware/dataValidation.js';
import fileValidator from '../middleware/fileValidation.js';
import imageController from '../controllers/imageController.js';

// Create a new instance of the express router and apply authentication middleware to all routes
const routerImages = express.Router();
routerImages.use(authValidator.isValidAuthKey);

// Define the routes, apply data validation middleware and call the appropriate controller method
routerImages.post('/images/:uuid', dataValidator.isValidUUID, fileValidator.isValidFile, async (req, res) => {
    await imageController.uploadFile(req, res);
});

routerImages.get('/images/:uuid', dataValidator.isValidUUID, async (req, res) => {
    await imageController.downloadFile(req, res);
});

routerImages.delete('/images/:uuid', dataValidator.isValidUUID, async (req, res) => {
    await imageController.deleteFile(req, res);
});

// Export the router
export default routerImages;
