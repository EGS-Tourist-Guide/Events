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
 *                 type: array
 *                 items:
 *                  type: string
 *                  format: binary
 *     responses:
 *       201:
 *         description: Created success
 *         headers:
 *           Location:
 *             description: URI where the newly created image can be found
 *             schema:
 *               type: string
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *                     example:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *         headers:
 *           WWW-Authenticate:
 *             description: 'Basic realm="service-api-key"'
 *             schema:
 *               type: string
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *       413:
 *         description: Payload Too Large
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *       415:
 *         description: Unsupported Media Type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 */
routerImages.post('/images/:uuid', authValidator.isValidAuthKey, dataValidator.isValidUUID, fileValidator.isValidFile, async (req, res) => {
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
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *                     example:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *         headers:
 *           WWW-Authenticate:
 *             description: 'Basic realm="service-api-key"'
 *             schema:
 *               type: string
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
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
 *     responses:
 *       204:
 *         description: No Content
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *                     example:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *         headers:
 *           WWW-Authenticate:
 *             description: 'Basic realm="service-api-key"'
 *             schema:
 *               type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 */
routerImages.delete('/images/:uuid', authValidator.isValidAuthKey, dataValidator.isValidUUID, async (req, res) => {
    await imageController.deleteFile(req, res);
});

// Export the router
export default routerImages;
