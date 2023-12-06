import { User } from '../../domain/user';

export interface UserAuthService {
    authenticate(username: string, password: string): Promise<User | null>;
}
