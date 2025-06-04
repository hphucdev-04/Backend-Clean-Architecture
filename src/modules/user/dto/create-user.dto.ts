import { IsEmail, IsString, IsOptional, IsEnum, MinLength, MaxLength, IsNumber, IsNotEmpty } from 'class-validator';
import { Role } from '~/utilities/emu.untility';

export class CreateUserDto {
	@IsNotEmpty({message:'Email is required'})
	@IsEmail({}, { message: 'Please provide a valid email address' })
	email!: string;

	@IsNotEmpty({message: 'Password is required'})
	@IsString({ message: 'Password must be a string' })
	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	@MaxLength(100, { message: 'Password cannot be longer than 100 characters' })
	password!: string;

	@IsNotEmpty({message: 'First name is required'})
	@IsString({ message: 'First name must be a string' })
	@MinLength(2, { message: 'First name must be at least 2 characters long' })
	@MaxLength(50, { message: 'First name cannot be longer than 50 characters' })
	firstName!: string;

	@IsNotEmpty({message: 'Last name is required'})
	@IsString({ message: 'Last name must be a string' })
	@MinLength(2, { message: 'Last name must be at least 2 characters long' })
	@MaxLength(50, { message: 'Last name cannot be longer than 50 characters' })
	lastName!: string;
	
	@IsNotEmpty({message: 'Phone is required'})
	@IsNumber()
	phone!: number

	@IsOptional()
	@IsEnum(Role, { message: 'Role must be one of: admin, user' })
	role?: Role;
}
