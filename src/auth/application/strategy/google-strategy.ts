import { AddUserRepoDTO } from 'src/user/persistence/dto/add-user-repo.dto';
import { AppConfigService } from '../../../infrastructure/app-config/app-config-service';
import { APP_CONFIG_SERVICE_TOKEN } from '../../../infrastructure/app-config/app-config-service.provider';
import { Inject, Injectable } from '@nestjs/common';
import {
    OAUTH_CLIENT,
    OAUTH_REDIRECT_URL,
    OAUTH_SECRET,
} from '../../../infrastructure/app-config/configuration/authentication-configuration';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { UserRepository } from '../../../user/persistence/repository/user/user-repository';
import { USER_REPO_TOKEN } from '../../../user/persistence/repository/user/user-repository.provider';
import { User } from 'src/user/domain/user';

type GoogleProfile = { email: string };

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        @Inject(APP_CONFIG_SERVICE_TOKEN)
        configService: AppConfigService,

        @Inject(USER_REPO_TOKEN)
        private userRepository: UserRepository,
    ) {
        const authConfig = configService.getAuthConfig();

        super({
            clientID: authConfig[OAUTH_CLIENT],
            clientSecret: authConfig[OAUTH_SECRET],
            callbackURL: authConfig[OAUTH_REDIRECT_URL],
            scope: ['email'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: GoogleProfile,
        done: VerifyCallback,
    ): Promise<void> {
        const user = await this.getOrCreateUserFrom(profile);
        done(null, user);
    }

    private async getOrCreateUserFrom(profile: GoogleProfile): Promise<User> {
        const user = await this.userRepository.getByEmail(profile.email);
        if (!user) {
            const userToAdd = new AddUserRepoDTO(profile.email);
            await this.userRepository.add(userToAdd);

            return this.getOrCreateUserFrom(profile);
        }

        return user;
    }
}
