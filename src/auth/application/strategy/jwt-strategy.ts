import { AppConfigService } from '../../../infrastructure/app-config/app-config-service';
import { APP_CONFIG_SERVICE_TOKEN } from '../../../infrastructure/app-config/app-config-service.provider';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '../../../user/domain/user';
import { UserRepository } from '../../../user/persistence/repository/user-repository';
import { USER_REPO_TOKEN } from '../../../user/persistence/repository/user-repository.provider';

type JwtAuthPayload = {
    email: string;
    iat: number;
    exp: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(APP_CONFIG_SERVICE_TOKEN)
        configService: AppConfigService,

        @Inject(USER_REPO_TOKEN)
        private readonly userRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getAuthConfig().JWT_SECRET,
            usernameField: 'email',
        });
    }

    async validate(payload: JwtAuthPayload): Promise<User> {
        const user = await this.userRepository.getByEmail(payload.email);
        if (!user) {
            throw new UnauthorizedException(
                `User with email ${payload.email} has not been found during JWT validation.`,
            );
        }

        return user;
    }
}
