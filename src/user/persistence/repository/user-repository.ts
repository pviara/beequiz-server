import { AddUserRepoDTO } from '../dto/add-user-repo.dto';
import { User } from '../../domain/user';

export interface UserRepository {
    add(userToAdd: AddUserRepoDTO): Promise<void>;
    getById(userId: string): Promise<User | null>;
    getByUsername(username: string): Promise<User | null>;
    update(user: User): Promise<void>;
}
