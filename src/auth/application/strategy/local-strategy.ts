import { AuthService } from '../auth-service';
import { AUTH_SERVICE_TOKEN } from '../auth-service.provider';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from '../../../user/domain/user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(AUTH_SERVICE_TOKEN)
        private readonly authService: AuthService,
    ) {
        super();
    }

    async validate(username: string, password: string): Promise<User> {
        const user = await this.authService.authenticate(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
