import { Request, Response, NextFunction } from 'express';
import { BaseController } from '~/base/base.controller';
import { UserService } from '~/modules/user/user.service';
import { CreateUserDto } from '~/modules/user/dto/create-user.dto';
import { UpdateUserDto } from '~/modules/user/dto/update-user.dto';
import { validationPipe } from '~/pipes/validation.pipe';
import { authenticationGuard } from '~/guards/authentication.guard';
import { authorizationGuard } from '~/guards/authorization.guard';
import { Role } from '~/utilities/emu.untility';

export class UserController extends BaseController {
	private userService: UserService;

	constructor() {
		super('/users');
		this.userService = new UserService();
		this.initializeRoutes();
	}

	public initializeRoutes(): void {
		this.router.get('/', 
			authenticationGuard, 
			authorizationGuard([Role.Admin]), 
			this.getAllUsers
		);

		this.router.get('/:id', 
			authenticationGuard, 
			this.getUserById
		);

		this.router.post('/', 
			authenticationGuard, 
			validationPipe(CreateUserDto), 
			this.createUser
		);

		this.router.put('/:id', 
			authenticationGuard, 
			validationPipe(UpdateUserDto), 
			this.updateUser
		);

		this.router.delete('/:id', 
			authenticationGuard, 
			authorizationGuard([Role.Admin]), 
			this.deleteUser
		);
	}

	private getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const users = await this.userService.getAllUsers();
			res.status(200).json({
				data: users,
				message: 'getAllUsers',
			});
		} catch (error) {
			next(error);
		}
	};

	private getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const userId = req.params.id;
			const user = await this.userService.getUserById(userId);
			res.status(200).json({
				data: user,
				message: 'getUserById',
			});
		} catch (error) {
			next(error);
		}
	};

	private createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const userData: CreateUserDto = req.body;
			const newUser = await this.userService.createUser(userData);
			res.status(201).json({
				data: newUser,
				message: 'createUser',
			});
		} catch (error) {
			next(error);
		}
	};

	private updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const userId = req.params.id;
			const userData: UpdateUserDto = req.body;
			const updatedUser = await this.userService.updateUser(userId, userData);
			res.status(200).json({
				data: updatedUser,
				message: 'updateUser',
			});
		} catch (error) {
			next(error);
		}
	};

	private deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const userId = req.params.id;
			const deleted = await this.userService.deleteUser(userId);
			res.status(200).json({
				success: deleted,
				message: 'deleteUser',
			});
		} catch (error) {
			next(error);
		}
	};
}