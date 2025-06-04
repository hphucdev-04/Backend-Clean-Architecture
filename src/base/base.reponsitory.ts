import { Model, Document } from 'mongoose';
import { IBaseRepository } from '~/base/base.interface';

export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
	protected model: Model<T>;

	constructor(model: Model<T>) {
		this.model = model;
	}

	public async findAll(): Promise<T[]> {
		return this.model.find().exec();
	}

	public async findById(id: string): Promise<T | null> {
		return this.model.findById(id).exec();
	}

	public async create(item: any): Promise<T> {
		return this.model.create(item);
	}

	public async update(id: string, item: Partial<T>): Promise<T | null> {
		return this.model.findByIdAndUpdate(id, item, { new: true }).exec();
	}

	public async delete(id: string): Promise<boolean> {
		const result = await this.model.findByIdAndDelete(id).exec();
		return result !== null;
	}
}
