import { Document } from 'mongoose';
import { CreateUserDto } from '~/modules/user/dto/create-user.dto';
import { UpdateUserDto } from '~/modules/user/dto/update-user.dto';
import { UserResponseDto } from '~/modules/user/dto/user-response.dto';
import { IBaseRepository } from '~/base/base.interface';

export interface IUser extends Document {
	_id: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	role: string;
	isActive: boolean;
	activationCode?: string | null;
	activationCodeExpiresAt?: Date | null;
	resetPasswordCode?: string | null;
	resetPasswordCodeExpiresAt?: Date | null;
	lastLogin?: Date;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface IUserService {
	getAllUsers(): Promise<UserResponseDto[]>;
	getUserById(id: string): Promise<UserResponseDto | null>;
	createUser(userData: CreateUserDto): Promise<UserResponseDto>;
	updateUser(id: string, userData: UpdateUserDto): Promise<UserResponseDto | null>;
	deleteUser(id: string): Promise<boolean>;
	changeUserStatus(id: string, isActive: boolean): Promise<boolean>;
}

export interface IUserRepository extends IBaseRepository<IUser> {
	findByEmail(email: string): Promise<IUser | null>;
	findByRole(role: string): Promise<IUser[]>;
	updatePassword(id: string, hashedPassword: string): Promise<boolean>;
	comparePassword(user: IUser, plainPassword: string): Promise<boolean>;
}
