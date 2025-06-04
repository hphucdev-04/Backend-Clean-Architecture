import express, { Application, NextFunction } from 'express';
import cors from 'cors';
import { env } from '~/configs/env';
import { routes } from '~/routes/index';
import { errorMiddleware } from '~/middlewares/error.middleware';
import { logger } from './utilities/logger.untility';

export class App {
	public app: Application;
	public port: number;

	constructor() {
		this.app = express();
		this.port = env.app.port;

		this.initializeMiddlewares();
		this.initializeRoutes();
		this.initializeErrorHandling();
	}

	public listen(): void {
		this.app.listen(this.port, () => {
			logger.info(`Server running on port ${env.app.port} in ${env.node} mode`);
		});
	}

	private initializeMiddlewares(): void {
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
	}

	private initializeRoutes(): void {
		this.app.use(env.app.apiPrefix, routes );
	}

	private initializeErrorHandling(): void {
		this.app.use(errorMiddleware);
	}
}
