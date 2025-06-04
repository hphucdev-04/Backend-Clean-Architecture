import { Router } from 'express';

export interface IBaseRepository<T> {
	findAll(): Promise<T[]>;
	findById(id: string): Promise<T | null>;
	create(item: any): Promise<T>;
	update(id: string, item: Partial<T>): Promise<T | null>;
	delete(id: string): Promise<boolean>;
}

export interface IController {
	path: string;
	router: Router;
	initializeRoutes(): void;
}
