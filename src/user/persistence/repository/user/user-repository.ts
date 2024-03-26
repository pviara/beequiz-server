import { AddUserRepoDTO } from '../../dto/add-user-repo.dto';
import { User } from '../../../domain/user';

export abstract class UserRepository {
    abstract add(userToAdd: AddUserRepoDTO): Promise<void>;
    abstract getByEmail(email: string): Promise<User | null>;
    abstract getById(userId: string): Promise<User | null>;
    abstract update(user: User): Promise<void>;
}
