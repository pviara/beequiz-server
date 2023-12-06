import { AccessToken, AuthService } from './auth-service';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../user/domain/user';
import { UserAuthService } from '../../user/application/services/user-auth-service';
import { USER_AUTH_SERVICE_TOKEN } from '../../user/application/services/user-auth.provider';

export class AuthServiceImpl implements AuthService {
    constructor(
        private jwtService: JwtService,

        @Inject(USER_AUTH_SERVICE_TOKEN)
        private userAuthService: UserAuthService,
    ) {}

    authenticate(username: string, password: string): Promise<User | null> {
        return this.userAuthService.authenticate(username, password);
    }

    signIn(user: User): AccessToken {
        return this.jwtService.sign({ username: user.username });
    }
}
