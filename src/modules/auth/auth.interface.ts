import { UserResponseDto } from '~/modules/user/dto/user-response.dto';
import { LoginDto } from '~/modules/auth/dto/login.dto';
import { RegisterDto } from '~/modules/auth/dto/register.dto';

export interface TokenData {
	token: string;
	expiresIn: number;
}

export interface LoginResponseDto {
	user: UserResponseDto;
	tokens: {
		accessToken: TokenData;
		refreshToken: TokenData;
	};
}

export interface IAuthService {
	register(userData: RegisterDto): Promise<UserResponseDto>;
	login(credentials: LoginDto): Promise<LoginResponseDto>;
	refreshToken(token: string): Promise<TokenData>;
	verifyEmail(id:string,activationCode: string): Promise<boolean>;
	requestPasswordReset(email: string): Promise<boolean>;
	resetPassword(resetCode: string, newPassword: string): Promise<boolean>;
}
