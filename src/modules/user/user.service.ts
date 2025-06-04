import { IUserService } from '~/modules/user/user.interface';
import { UserRepository } from '~/modules/user/user.repository';
import { CreateUserDto } from '~/modules/user/dto/create-user.dto';
import { UpdateUserDto } from '~/modules/user/dto/update-user.dto';
import { UserResponseDto } from '~/modules/user/dto/user-response.dto';
import { NotFoundException, ConflictException } from '~/exceptions/http.exception';

export class UserService implements IUserService {
	private userRepository: UserRepository;

	constructor() {
		this.userRepository = new UserRepository();
	}

	public async getAllUsers(): Promise<UserResponseDto[]> {
		const users = await this.userRepository.findAll();
		return users.map((user) => UserResponseDto.fromEntity(user));
	}

	public async getUserById(id: string): Promise<UserResponseDto | null> {
		const user = await this.userRepository.findById(id);

		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		return UserResponseDto.fromEntity(user);
	}

	public async createUser(userData: CreateUserDto): Promise<UserResponseDto> {
		const existingUser = await this.userRepository.findByEmail(userData.email);

		if (existingUser) {
			throw new ConflictException(`User with email ${userData.email} already exists`);
		}

		const newUser = await this.userRepository.create(userData);
		return UserResponseDto.fromEntity(newUser);
	}

	public async updateUser(id: string, userData: UpdateUserDto): Promise<UserResponseDto | null> {
		const existingUser = await this.userRepository.findById(id);

		if (!existingUser) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		if (userData.email && userData.email !== existingUser.email) {
			const userWithEmail = await this.userRepository.findByEmail(userData.email);

			if (userWithEmail && userWithEmail.id !== id) {
				throw new ConflictException(`User with email ${userData.email} already exists`);
			}
		}

		const updatedUser = await this.userRepository.update(id, userData);

		if (!updatedUser) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		return UserResponseDto.fromEntity(updatedUser);
	}

	public async deleteUser(id: string): Promise<boolean> {
		const existingUser = await this.userRepository.findById(id);

		if (!existingUser) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		return this.userRepository.delete(id);
	}

	public async changeUserStatus(id: string, isActive: boolean): Promise<boolean> {
		const existingUser = await this.userRepository.findById(id);

		if (!existingUser) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		const updatedUser = await this.userRepository.update(id, { isActive });
		return updatedUser !== null;
	}
}
