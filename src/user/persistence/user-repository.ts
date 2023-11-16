import { User } from '../domain/user';

export interface UserRepository {
    getByUsername(username: string): Promise<User | null>;
}
