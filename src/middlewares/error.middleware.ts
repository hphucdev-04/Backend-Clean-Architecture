import { Request, Response, NextFunction } from 'express';
import { HttpException } from '~/exceptions/http.exception';
import { logger } from '~/utilities/logger.untility';

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
	logger.warn(error.message);
    
    if (error instanceof HttpException) {
      const status = error.status || 500;
      const message = error.message || 'Something went wrong';
      const errors = error.errors || {details: error.message};
      
      res.status(status).json({
        success: false,
        message: message,
        errors: errors
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  } catch (err) {
    next(err);
  }
};