import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '~/configs/env';
import { UnauthorizedException } from '~/exceptions/http.exception';

export interface IUserPayload {
	id: string;
	role: string;
}

export interface RequestWithUser extends Request {
	user?: IUserPayload;
}

export const authenticationGuard = (req: RequestWithUser, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw new UnauthorizedException('Authentication token is required');
		}

		const token = authHeader.split(' ')[1];

		if (!token) {
			throw new UnauthorizedException('Authentication token is required');
		}

		try {
			const decoded = jwt.verify(token, env.jwt.secret) as IUserPayload;
			req.user = decoded;
			next();
		} catch (error) {
			throw new UnauthorizedException('Invalid or expired token');
		}
	} catch (error) {
		next(error);
	}
};
