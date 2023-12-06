import { AuthService } from './auth-service';
import { User } from '../user/domain/user';

export class AuthServiceImpl implements AuthService {
    authenticate(username: string, password: string): Promise<User | null> {
        throw new Error('Method not implemented.');
    }

    signIn(user: User): string {
        throw new Error('Method not implemented.');
    }
}
