import express from 'express';
import authValidator from '../middleware/authValidation.js';
import dataValidator from '../middleware/dataValidation.js';
import fileValidator from '../middleware/fileValidation.js';
import imageController from '../controllers/imageController.js';

// Create a new instance of the express router
const routerImages = express.Router();

/**
 * @swagger
 * /v1/images/{uuid}:
 *   post:
 *     tags:
 *       - Files
 *     summary: Upload an image
 *     description: Uploads to the storage an image associated with a specific event
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: uuid
 *         in: path
 *         description: UUID of the event associated with the image
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid 
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 description: Allows 1 file per request. MIME type must be image/jpeg with a maximum size of 10MB
 *                 type: string
 *                 format: binary
 *               userId:
 *                 type: string
 *                 example: id12345
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Created_201'
 *       400:
 *         $ref: '#/components/responses/BadRequest_400'
 *       401:
 *         $ref: '#/components/responses/Unauthorized_401'
 *       403:
 *         $ref: '#/components/responses/Forbidden_403'
 *       413:
 *         $ref: '#/components/responses/PayloadTooLarge_413'
 *       415:
 *         $ref: '#/components/responses/UnsupportedMediaType_415'
 *       500:
 *         $ref: '#/components/responses/InternalServerError_500'
 */
routerImages.post('/images/:uuid', authValidator.isValidAuthKey, dataValidator.isValidUUID, fileValidator.isValidFile, authValidator.isOperationAllowed, async (req, res) => {
    await imageController.uploadFile(req, res);
});

/**
 * @swagger
 * /v1/images/{uuid}:
 *   get:
 *     tags:
 *       - Files
 *     summary: Get an image
 *     description: Fetches the download URL of the image associated with a specific event
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: uuid
 *         in: path
 *         description: UUID of the event associated with the image
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Disposition:
 *             description: Indicates the content is an downloadable attachment, providing a filename for the attachment
 *             schema:
 *               type: string
 *       400:
 *         $ref: '#/components/responses/BadRequest_400'
 *       401:
 *         $ref: '#/components/responses/Unauthorized_401'
 *       404:
 *         $ref: '#/components/responses/NotFound_404'
 *       500:
 *         $ref: '#/components/responses/InternalServerError_500'
 */
routerImages.get('/images/:uuid', authValidator.isValidAuthKey, dataValidator.isValidUUID, async (req, res) => {
    await imageController.downloadFile(req, res);
});

/**
 * @swagger
 * /v1/images/{uuid}:
 *   delete:
 *     tags:
 *       - Files
 *     summary: Delete an image
 *     description: Deletes the image associated with a specific event
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: uuid
 *         in: path
 *         description: UUID of the event associated with the image
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: id12345
 *     responses:
 *       204:
 *         $ref: '#/components/responses/NoContent_204'
 *       400:
 *         $ref: '#/components/responses/BadRequest_400'
 *       401:
 *         $ref: '#/components/responses/Unauthorized_401'
 *       403:
 *         $ref: '#/components/responses/Forbidden_403'
 *       500:
 *         $ref: '#/components/responses/InternalServerError_500'
 */
routerImages.delete('/images/:uuid', authValidator.isValidAuthKey, authValidator.isOperationAllowed, dataValidator.isValidUUID, async (req, res) => {
    await imageController.deleteFile(req, res);
});

// Export the router
export default routerImages;
