import { AppConfigModule } from '../infrastructure/app-config/app-config.module';
import { AppConfigService } from '../infrastructure/app-config/app-config-service';
import { AuthController } from './presentation/auth-controller';
import { AuthServiceProvider } from './application/auth-service.provider';
import { APP_CONFIG_SERVICE_TOKEN } from '../infrastructure/app-config/app-config-service.provider';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './application/strategy/jwt-strategy';
import { JWT_SECRET } from '../infrastructure/app-config/configuration/authentication-configuration';
import { LocalStrategy } from './application/strategy/local-strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';

@Module({
    controllers: [AuthController],
    imports: [
        AppConfigModule,
        JwtModule.registerAsync({
            imports: [AppConfigModule],
            inject: [APP_CONFIG_SERVICE_TOKEN],
            useFactory: (configService: AppConfigService) => {
                return {
                    secret: configService.getAuthConfig()[JWT_SECRET],
                    signOptions: { expiresIn: '2 days' },
                };
            },
        }),
        PassportModule,
        UserModule,
    ],
    providers: [AuthServiceProvider, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
