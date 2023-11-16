import { AddUserRepoDTO } from './add-user-repo.dto';
import { User } from '../domain/user';

export interface UserRepository {
    add(userToAdd: AddUserRepoDTO): Promise<void>;
    getByUsername(username: string): Promise<User | null>;
}
