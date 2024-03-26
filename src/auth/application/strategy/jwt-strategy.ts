import { AppConfigService } from '../../../infrastructure/app-config/app-config-service';
import { AuthenticatedUser } from '../../presentation/model/authenticated-user';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { mapToAuthenticatedUser } from './utils';
import { PassportStrategy } from '@nestjs/passport';
import { UserRepository } from '../../../user/persistence/repository/user/user-repository';

type JwtAuthPayload = {
    email: string;
    iat: number;
    exp: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: AppConfigService,
        private userRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getAuthConfig().JWT_SECRET,
            usernameField: 'email',
        });
    }

    async validate(payload: JwtAuthPayload): Promise<AuthenticatedUser> {
        const user = await this.userRepository.getByEmail(payload.email);
        if (!user) {
            throw new UnauthorizedException(
                `User with email ${payload.email} has not been found during JWT validation.`,
            );
        }
        return mapToAuthenticatedUser(user);
    }
}
