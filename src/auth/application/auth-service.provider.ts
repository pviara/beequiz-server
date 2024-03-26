import { AuthService } from './auth-service';
import { AuthServiceImpl } from './auth-service.impl';
import { JwtService } from '@nestjs/jwt';
import { Provider } from '@nestjs/common';

export const AuthServiceProvider: Provider = {
    inject: [JwtService],
    provide: AuthService,
    useFactory: (jwtService: JwtService) => {
        return new AuthServiceImpl(jwtService);
    },
};
