import { AuthServiceImpl } from './auth-service.impl';
import { Provider } from '@nestjs/common';

export const AUTH_SERVICE_TOKEN = 'AuthService';

export const AuthServiceProvider: Provider = {
    provide: AUTH_SERVICE_TOKEN,
    useClass: AuthServiceImpl,
};
