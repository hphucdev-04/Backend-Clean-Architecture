import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class VerifyEmailDto {
	@IsNotEmpty({message:'User id is requied'})
	id!:string

	@IsString({ message: 'Verification code must be a string' })
	@IsNotEmpty({ message: 'Verification code is required' })
	@MinLength(5, { message: 'Verification code must be 5 digits' })
	code!: string;
}
