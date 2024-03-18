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
 *     description: Generates a key that can be used to authenticate the client when making requests to the service. The key is returned and shown only once, so its value must be stored securely by the client
 *     responses:
 *       201:
 *         description: Created success
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
 *     description: Revokes the key that is given in the service-api-key header
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
routerKeys.patch('/keys', authValidator.isValidAuthKey, async (req, res) => {
    await keyController.revokeKey(req, res);
});

// Export the router
export default routerKeys;
