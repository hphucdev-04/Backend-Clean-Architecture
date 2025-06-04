import { HttpException } from '~/exceptions/http.exception';

export class ApiException extends HttpException {
	constructor(status: number, message: string, errors?: any) {
		super(status, message, errors);
	}
}

export class ValidationException extends ApiException {
	constructor(errors: any) {
		super(400, 'Validation Error', errors);
	}
}

export class DatabaseException extends ApiException {
	constructor(message: string = 'Database Error', errors?: any) {
		super(500, message, errors);
	}
}

export class AuthenticationException extends ApiException {
	constructor(message: string = 'Authentication Failed', errors?: any) {
		super(401, message, errors);
	}
}

export class AuthorizationException extends ApiException {
	constructor(message: string = 'Not Authorized', errors?: any) {
		super(403, message, errors);
	}
}
