import { AuthService } from './auth-service';
import { Inject } from '@nestjs/common';
import { User } from '../../user/domain/user';
import { UserAuthService } from '../../user/application/services/user-auth-service';
import { USER_AUTH_SERVICE_TOKEN } from '../../user/application/services/user-auth.provider';

export class AuthServiceImpl implements AuthService {
    constructor(
        @Inject(USER_AUTH_SERVICE_TOKEN)
        private userAuthService: UserAuthService,
    ) {}

    authenticate(username: string, password: string): Promise<User | null> {
        return this.userAuthService.authenticate(username, password);
    }

    signIn(user: User): string {
        throw new Error('Method not implemented.');
    }
}
