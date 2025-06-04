import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
	@IsString({ message: 'First name must be a string' })
	@IsNotEmpty({ message: 'First name is required' })
	@MinLength(2, { message: 'First name must be at least 2 characters long' })
	firstName!: string;

	@IsString({ message: 'Last name must be a string' })
	@IsNotEmpty({ message: 'Last name is required' })
	@MinLength(2, { message: 'Last name must be at least 2 characters long' })
	lastName!: string;

	@IsEmail({}, { message: 'Email must be a valid email address' })
	@IsNotEmpty({ message: 'Email is required' })
	email!: string;

	@IsString({ message: 'Password must be a string' })
	@IsNotEmpty({ message: 'Password is required' })
	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
		message:
			'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
	})
	password!: string;
}
