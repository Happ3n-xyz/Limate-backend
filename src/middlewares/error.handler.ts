import { ValidationError } from 'sequelize';
import { Request, Response, NextFunction } from 'express';

function logErrors(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  next(err);
}

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  res.status(500).json({
    message: err.message
  });
}

function boomErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
    return;
  }
  next(err);
}

function ormErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ValidationError) {
    res.status(409).json({
      statusCode: 409,
      message: err.name,
      errors: err.errors
    });
    return;
  }
  next(err);
}

export { logErrors, errorHandler, boomErrorHandler, ormErrorHandler };
