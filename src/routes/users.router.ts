import { Router, Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth.service';
import validatorHandler from '../middlewares/validator.handler';
import passport from 'passport';

const router = Router();
const authService = new AuthService();

export default (app: Router) => {
  app.use('/users', router);

}