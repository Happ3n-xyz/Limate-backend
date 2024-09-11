import { Application, Router } from 'express';
import authRouter from "./auth.router";
import userRouter from "./users.router";
import swaggerRouter from './swagger.router';

export default (app : Application) => {
    const router = Router();
    app.use('/api', router);
    authRouter(router);
    userRouter(router);
    swaggerRouter(router);
}