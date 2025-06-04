import jwt from 'jsonwebtoken';
import { IAuthService, TokenData, LoginResponseDto } from './auth.interface';
import { UserRepository } from '~/modules/user/user.repository';
import { UserResponseDto } from '~/modules/user/dto/user-response.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { HashPasswordUtility } from '~/utilities/hash-password.utility';
import { env } from '~/configs/env';
import { Role } from '~/utilities/emu.untility';
import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	NotFoundException,
	UnauthorizedException,
} from '~/exceptions/http.exception';

export class AuthService implements IAuthService {
	private userRepository: UserRepository;

	constructor() {
		this.userRepository = new UserRepository();
	}

	public async register(userData: RegisterDto): Promise<UserResponseDto> {
		const existingUser = await this.userRepository.findByEmail(userData.email);
		if (existingUser) {
			throw new BadRequestException(`User with email ${userData.email} already exists`);
		}

		const activationCode = HashPasswordUtility.generateRandomCode();
		const activationCodeExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); 

		const newUser = await this.userRepository.create({
			...userData,
			role: Role.User,
			isActive: false,
			activationCode,
			activationCodeExpiresAt,
		});

		// TODO: Send activation email

		return UserResponseDto.fromEntity(newUser);
	}

	public async login(credentials: LoginDto): Promise<LoginResponseDto> {
		const user = await this.userRepository.findByEmail(credentials.email);
		if (!user) {
			throw new UnauthorizedException('Invalid email or password');
		}

		if (!user.isActive) {
			throw new UnauthorizedException(
				'Your account is not active. Please check your email to activate your account.',
			);
		}

		const isPasswordValid = await this.userRepository.comparePassword(user,credentials.password);
		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid email or password');
		}

		user.lastLogin = new Date();
		await user.save();

		const accessToken = this.createToken(user._id.toString(), user.role, env.jwt.expiresIn);
		const refreshToken = this.createToken(
			user._id.toString(),
			user.role,
			env.jwt.refreshExpiresIn,
			true,
		);

		return {
			user: UserResponseDto.fromEntity(user),
			tokens: {
				accessToken,
				refreshToken,
			},
		};
	}

	public async refreshToken(token: string): Promise<TokenData> {
		try {
			const decoded = jwt.verify(token, env.jwt.refreshSecret) as { id: string; role: string };

			const user = await this.userRepository.findById(decoded.id);
			if (!user) {
				throw new UnauthorizedException('Invalid token');
			}

			if (!user.isActive) {
				throw new UnauthorizedException('Your account is not active');
			}

			return this.createToken(user._id.toString(), user.role, env.jwt.expiresIn);
		} catch (error) {
			throw new UnauthorizedException('Invalid or expired token');
		}
	}

	public async verifyEmail(id:string, activationCode: string): Promise<boolean> {
		const user = await this.userRepository.findByEmail(id)
		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (user.isActive) {
			throw new ConflictException('User is already activated');
		}

		if (activationCode !== user.activationCode) {
			throw new BadRequestException('Invalid activation code');
		}

		if (  !user.activationCodeExpiresAt || user.activationCodeExpiresAt.getTime() < Date.now()) {
			throw new ForbiddenException('Activation code has expired');
		}
		user.isActive = true;
		user.activationCode = null;
		user.activationCodeExpiresAt = null;
		await user.save();

		return true;
	}

	public async requestPasswordReset(email: string): Promise<boolean> {
		// Find user by email
		const user = await this.userRepository.findByEmail(email);
		if (!user) {
			// For security reasons, don't reveal that the email doesn't exist
			return true;
		}

		// Generate reset code
		const resetPasswordCode = HashPasswordUtility.generateRandomCode();
		const resetPasswordCodeExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

		// Save reset code to user
		user.resetPasswordCode = resetPasswordCode;
		user.resetPasswordCodeExpiresAt = resetPasswordCodeExpiresAt;
		await user.save();

		// TODO: Send password reset email

		return true;
	}

	public async resetPassword(resetCode: string, newPassword: string): Promise<boolean> {
		// Find user by reset code
		const user = await this.userRepository.getModel().findOne({
			resetPasswordCode: resetCode,
			resetPasswordCodeExpiresAt: { $gt: new Date() },
		});

		if (!user) {
			throw new BadRequestException('Invalid or expired reset code');
		}

		// Hash new password
		const hashedPassword = await HashPasswordUtility.hash(newPassword);

		// Update password
		user.password = hashedPassword;
		user.resetPasswordCode = null;
		user.resetPasswordCodeExpiresAt = null;
		await user.save();

		return true;
	}

	private createToken(
		userId: string,
		role: string,
		expiresIn: string,
		isRefreshToken = false,
	): TokenData {
		const secret = isRefreshToken ? env.jwt.refreshSecret : env.jwt.secret;
		const expiresInSeconds = this.parseExpiresIn(expiresIn);

		const token = jwt.sign({ id: userId, role }, secret, { expiresIn: expiresInSeconds });

		return {
			token,
			expiresIn: expiresInSeconds,
		};
	}

	private parseExpiresIn(expiresIn: string): number {
		// Parse expiration time (e.g., '1d', '7d', '24h')
		const unit = expiresIn.slice(-1);
		const value = parseInt(expiresIn.slice(0, -1), 10);

		switch (unit) {
			case 'd': // days
				return value * 24 * 60 * 60;
			case 'h': // hours
				return value * 60 * 60;
			case 'm': // minutes
				return value * 60;
			default: // seconds
				return parseInt(expiresIn, 10);
		}
	}
}
