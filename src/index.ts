import express, { Application, Request, Response } from 'express';
import {  errorHandler, boomErrorHandler, ormErrorHandler } from './middlewares/error.handler';
import { config } from './config/config';
import routes from './routes';
import cors from 'cors';
import passport from 'passport';
import JwtStrategy from './utils/auth/strategies/jwt.strategy';
import path from 'path';

passport.use(JwtStrategy);

const app: Application = express();
const port = config.port;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './uploads')))

const corsOptions = {
  origin: '*'
};

app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
  res.send('Server running');
});

routes(app);

app.use(ormErrorHandler)
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});