import { Router, Request, Response, NextFunction } from 'express';
import validatorHandler from '../middlewares/validator.handler';
import passport from 'passport';
import UserService from '../services/user.service';
import { createLimate, updateUser } from '../schemas/user.schema';

const router = Router();
const userService = new UserService();


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User operations
 */
export default (app: Router) => {
  app.use('/users', router);

/**
 * @swagger
 * /users/limates:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get Limates for user (requires authentication token)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the json with the user's limates
 *       4XX:
 *         description: Error in request
 */
  router.get('/limates',
  passport.authenticate('jwt', {session: false}),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user as { id: string };
      const result = await userService.getUserLimates(id);
      return res.json(result).status(200);
    } catch (e) {
      next(e);
    }
  });

  /**
 * @swagger
 * /users/code:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get code for user (requires authentication token)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the json with the user's code
 *       4XX:
 *         description: Error in request
 */
  router.get('/code',
  passport.authenticate('jwt', {session: false}),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user as { id: string };
      const result = await userService.getUserCode(id);
      return res.json(result).status(200);
    } catch (e) {
      next(e);
    }
  });

    /**
 * @swagger
 * /users/limates:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create limate for user (requires authentication token)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns the json with the limate created
 *       4XX:
 *         description: Error in request
 */
  router.post('/limates',
  passport.authenticate('jwt', {session: false}),
  validatorHandler(createLimate, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('entering to create limate');
      
      const { id } = req.user as { id: string };
      const { code, username } = req.body;
      const result = await userService.registerLimate(id, username, code);
      return res.json(result).status(200);
    } catch (e) {
      next(e);
    }
  });

      /**
 * @swagger
 * /users:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update user info(requires authentication token)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns the json with the updated user
 *       4XX:
 *         description: Error in request
 */
  router.patch('/',
    passport.authenticate('jwt', {session: false}),
    validatorHandler(updateUser, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
    try {   
      const { id } = req.user as { id: string };
      const { username } = req.body;
      const result = await userService.update(id, {username});
      return res.json(result).status(200);
    } catch (e) {
      next(e);
    }
  });
      

}