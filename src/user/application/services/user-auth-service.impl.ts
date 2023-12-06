import { User } from '../../domain/user';
import { UserAuthService } from './user-auth-service';

export class UserAuthServiceImpl implements UserAuthService {
    authenticate(username: string, password: string): Promise<User | null> {
        throw new Error('Method not implemented.');
    }
}
