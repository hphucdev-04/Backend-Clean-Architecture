import { Response, NextFunction } from 'express';
import { RequestWithUser } from './authentication.guard';
import { ForbiddenException } from '~/exceptions/http.exception';
import { Role } from '~/utilities/emu.untility';

export const authorizationGuard = (roles: Role[]) => {
	return (req: RequestWithUser, res: Response, next: NextFunction) => {
		try {
			if (!req.user) {
				throw new ForbiddenException('User not authenticated');
			}

			const userRole = req.user.role as Role;

			if (!roles.includes(userRole)) {
				throw new ForbiddenException('You do not have permission to access this resource');
			}

			next();
		} catch (error) {
			next(error);
		}
	};
};
