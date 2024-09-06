import { Router, Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth.service';
import validatorHandler from '../middlewares/validator.handler';
import { requestNonce, signIn } from '../schemas/auth.schema';
import passport from 'passport';

const router = Router();
const authService = new AuthService();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication operations
 */ 
export default (app: Router) => {
  app.use('/auth', router);


  /**
 * @swagger
 * /auth/auto-login-user:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Automatic login for user (requires authentication token)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the json with the user logged in
 *       404:
 *         description: User not found
 */
  router.get('/auto-login-user',
  passport.authenticate('jwt', {session: false}),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user as { id: string };
      const result = await authService.autoSignIn(id);
      return res.json(result).status(200);
    } catch (e) {
      next(e);
    }
  });

  /**
  * @swagger
  * /auth/request-nonce:
  *   post:
  *     tags:
  *       - Auth
  *     summary: Login for user
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               address:
  *                 type: string
  *     responses:
  *       200:
  *         description: Returns the json with the requested nonce.
  *       4XX:
  *         description: Error in the request.
  */
  router.post('/request-nonce',
  validatorHandler(requestNonce, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.body;
      const result = await authService.generateNonce(address);
      res.json(result).status(200);
    } catch (error) {
      next(error);
    }
  });

  /**
  * @swagger
  * /auth/login-user:
  *   post:
  *     tags:
  *       - Auth
  *     summary: Login for user
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               address:
  *                 type: string
  *               nonce:
  *                 type: string
  *               signature:
  *                 type: string
  *     responses:
  *       200:
  *         description: Returns the json with the user logged in with token
  *       401:
  *         description: Unauthorized, invalid signature
  *       404:
  *         description: User not found or invalid nonce
  */
  router.post('/login-user',
  validatorHandler(signIn, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address, nonce, signature} = req.body as { address: string, nonce: string, signature: string };
      const result = await authService.signedSignIn(address, nonce, signature);
      return res.json(result).status(200);
    } catch (error) {
      next(error);
    }
  });

}