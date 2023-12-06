import { AuthService } from './auth-service';
import { User } from '../user/domain/user';
import { UserAuthService } from '../user/application/services/user-auth-service';

export class AuthServiceImpl implements AuthService {
    constructor(private userAuthService: UserAuthService) {}

    authenticate(username: string, password: string): Promise<User | null> {
        return this.userAuthService.authenticate(username, password);
    }

    signIn(user: User): string {
        throw new Error('Method not implemented.');
    }
}
