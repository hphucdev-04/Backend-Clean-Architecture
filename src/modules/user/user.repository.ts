import { IUserRepository } from '~/modules/user/user.interface';
import { BaseRepository } from '~/base/base.reponsitory';
import { IUser } from '~/modules/user/user.interface';
import { User } from '~/modules/user/user.model';
import { HashPasswordUtility } from '~/utilities/hash-password.utility';

export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
	constructor() {
		super(User);
	}
	
	public getModel() {
		return this.model;
	}

	public async findByEmail(email: string): Promise<IUser | null> {
		return this.model.findOne({ email }).exec();
	}

	public async findByRole(role: string): Promise<IUser[]> {
		return this.model.find({ role }).exec();
	}

	public async updatePassword(id: string, hashedPassword: string): Promise<boolean> {
		const result = await this.model
			.updateOne({ _id: id }, { $set: { password: hashedPassword } })
			.exec();

		return result.modifiedCount > 0;
	}

	public async comparePassword(user: IUser, plainPassword: string): Promise<boolean> {
		return HashPasswordUtility.compare(plainPassword, user.password);
	}
	  
}
