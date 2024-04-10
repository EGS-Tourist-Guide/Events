import express from 'express';
import authValidator from '../middleware/authValidation.js';
import keyController from '../controllers/keyController.js';

// Create a new instance of the express router 
const routerKeys = express.Router();

/**
 * @swagger
 * /v1/keys:
 *   post:
 *     tags:
 *       - Keys
 *     summary: Generate a key
 *     description: Generates a key that can be used to authenticate the service client when making requests to the service. The key is returned and shown only once, so its value must be stored securely. 
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     details:
 *                       type: string
 *                     key:
 *                       type: string
 *                     appId:
 *                       type: string
 *       500:
 *         $ref: '#/components/responses/InternalServerError_500'
 */
routerKeys.post('/keys',  async (req, res) => {
    await keyController.generateKey(req, res);
});

/**
 * @swagger
 * /v1/keys:
 *   patch:
 *     tags:
 *       - Keys
 *     summary: Revoke a key
 *     description: Revokes the key that is given in the service-api-key header. The key can no longer be used to authenticate the service client when making requests.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: object
 *                   properties:
 *                     code:
 *                      type: string
 *                     message:
 *                      type: string
 *                     details:
 *                      type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized_401'
 *       500:
 *         $ref: '#/components/responses/InternalServerError_500'
 */
routerKeys.patch('/keys', authValidator.isValidAuthKey, async (req, res) => {
    await keyController.revokeKey(req, res);
});

// Export the router
export default routerKeys;
