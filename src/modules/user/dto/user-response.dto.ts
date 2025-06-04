import { IUser } from '~/modules/user/user.interface';

export class UserResponseDto {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: string;
	isActive: boolean;
	lastLogin?: Date;
	createdAt?: Date;


	constructor(user: {
		id: string;
		email: string;
		firstName: string;
		lastName: string;
		role: string;
		isActive: boolean;
		lastLogin?: Date;
		createdAt?: Date;
	}) {
		this.id = user.id;
		this.email = user.email;
		this.firstName = user.firstName;
		this.lastName = user.lastName;
		this.role = user.role;
		this.isActive = user.isActive;
		this.lastLogin = user.lastLogin;
		this.createdAt = user.createdAt;
	}

	static fromEntity(user: IUser): UserResponseDto {
		return new UserResponseDto({
			id: user._id.toString(),
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role,
			isActive: user.isActive,
			lastLogin: user.lastLogin,
			createdAt: user.createdAt,
		});
	}
}
