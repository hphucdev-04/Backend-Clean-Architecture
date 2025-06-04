import { Request, Response, NextFunction } from 'express';
import { BaseController } from '~/base/base.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { validationPipe } from '~/pipes/validation.pipe';
import { VerifyEmailDto } from './dto/verify-email.dto';

export class AuthController extends BaseController {
	private authService: AuthService;

	constructor() {
		super('/auth');
		this.authService = new AuthService();
		this.initializeRoutes();
	}

	public initializeRoutes(): void {
		this.router.post('/register', validationPipe(RegisterDto), this.register);

		this.router.post('/login', validationPipe(LoginDto), this.login);

		this.router.post('/refresh-token', this.refreshToken);

		this.router.get('/verify-email/:id/:code', this.verifyEmail);

		this.router.post('/forgot-password', this.forgotPassword);

		this.router.post('/reset-password', this.resetPassword);
	}

	private register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const userData: RegisterDto = req.body;
			const newUser = await this.authService.register(userData);

			res.status(201).json({
				success: true,
				data: newUser,
				message: 'User registered successfully. Please check your email to activate your account.',
			});
		} catch (error) {
			next(error);
		}
	};

	private login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const credentials: LoginDto = req.body;
			const loginData = await this.authService.login(credentials);

			res.status(200).json({
				success: true,
				data: loginData,
				message: 'Login successful',
			});
		} catch (error) {
			next(error);
		}
	};

	private refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { refreshToken } = req.body;

			if (!refreshToken) {
				res.status(400).json({
					success: false,
					message: 'Refresh token is required',
				});
				return;
			}

			const newToken = await this.authService.refreshToken(refreshToken);

			res.status(200).json({
				success: true,
				data: newToken,
				message: 'Token refreshed successfully',
			});
		} catch (error) {
			next(error);
		}
	};

	private verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { id, code } = req.params;
			const verified = await this.authService.verifyEmail(id,code);

			res.status(200).json({
				success: verified,
				message: 'Email verified successfully. You can now login.',
			});
		} catch (error) {
			next(error);
		}
	};

	private forgotPassword = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const { email } = req.body;

			if (!email) {
				res.status(400).json({
					success: false,
					message: 'Email is required',
				});
				return;
			}

			await this.authService.requestPasswordReset(email);

			res.status(200).json({
				success: true,
				message: 'If your email exists in our system, you will receive a password reset link.',
			});
		} catch (error) {
			next(error);
		}
	};

	private resetPassword = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const { code, password } = req.body;

			if (!code || !password) {
				res.status(400).json({
					success: false,
					message: 'Reset code and new password are required',
				});
				return;
			}

			const reset = await this.authService.resetPassword(code, password);

			res.status(200).json({
				success: reset,
				message: 'Password reset successfully. You can now login with your new password.',
			});
		} catch (error) {
			next(error);
		}
	};
}
