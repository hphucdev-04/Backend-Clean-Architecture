import { Router } from 'express';
import { IController } from '~/base/base.interface';

export abstract class BaseController implements IController {
	public path: string;
	public router: Router;

	constructor(path: string) {
		this.path = path;
		this.router = Router();
	}

	abstract initializeRoutes(): void;
}
