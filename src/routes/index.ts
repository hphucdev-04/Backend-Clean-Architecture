import { Router, Request, Response } from 'express';
import { UserController } from '~/modules/user/user.controller';
import { AuthController } from '~/modules/auth/auth.controller';

const router = Router();

// Khởi tạo các controller
const userController = new UserController();
const authController = new AuthController();


router.use(userController.path, userController.router);
router.use(authController.path, authController.router);

router.get('/', (req: Request, res: Response) => {
	res.send('Welcome to the API')
  });

router.get('/health', (req: Request, res: Response) => {
	res.status(200).json({
		status: 'success',
		message: 'Server is running',
	});
});

export const routes = router;
