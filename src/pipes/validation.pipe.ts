import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { BadRequestException } from '~/exceptions/http.exception';

export const validationPipe = (type: any, skipMissingProperties = false) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const object = plainToInstance(type, req.body);
			const errors = await validate(object, { skipMissingProperties });

			if (errors.length > 0) {
				const errorMessages = formatErrors(errors);
				throw new BadRequestException('Validation failed', errorMessages);
			}

			next();
		} catch (error) {
			next(error);
		}
	};
};

function formatErrors(errors: ValidationError[]): Record<string, string> {
	const result: Record<string, string> = {};

	errors.forEach((error) => {
		const property = error.property;
		const constraints = error.constraints;

		if (constraints) {
			const messages = Object.values(constraints);
			result[property] = messages[0]; 
		}

		if (error.children && error.children.length > 0) {
			const childErrors = formatErrors(error.children);
			Object.keys(childErrors).forEach((key) => {
				result[`${property}.${key}`] = childErrors[key];
			});
		}
	});

	return result;
}
