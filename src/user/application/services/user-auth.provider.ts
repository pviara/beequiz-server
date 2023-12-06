import { Provider } from '@nestjs/common';
import { UserAuthServiceImpl } from './user-auth-service.impl';

export const USER_AUTH_SERVICE_TOKEN = 'UserAuthService';

export const UserAuthServiceProvider: Provider = {
    provide: USER_AUTH_SERVICE_TOKEN,
    useClass: UserAuthServiceImpl,
};
