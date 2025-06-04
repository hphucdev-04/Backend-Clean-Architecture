import {
	IsEmail,
	IsString,
	IsOptional,
	IsEnum,
	MinLength,
	MaxLength,
	IsBoolean,
} from 'class-validator';
import { Role } from '~/utilities/emu.untility';

export class UpdateUserDto {
	@IsOptional()
	@IsEmail({}, { message: 'Please provide a valid email address' })
	email?: string;

	@IsOptional()
	@IsString({ message: 'First name must be a string' })
	@MinLength(2, { message: 'First name must be at least 2 characters long' })
	@MaxLength(50, { message: 'First name cannot be longer than 50 characters' })
	firstName?: string;

	@IsOptional()
	@IsString({ message: 'Last name must be a string' })
	@MinLength(2, { message: 'Last name must be at least 2 characters long' })
	@MaxLength(50, { message: 'Last name cannot be longer than 50 characters' })
	lastName?: string;

	@IsOptional()
	@IsEnum(Role, { message: 'Role must be one of: admin, user, editor, moderator' })
	role?: Role;

	@IsOptional()
	@IsBoolean({ message: 'isActive must be a boolean value' })
	isActive?: boolean;
}
