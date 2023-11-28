import { AppConfigServiceImpl } from './app-config-service.impl';
import { Provider } from '@nestjs/common';

export const APP_CONFIG_SERVICE_TOKEN = 'AppConfigServiceToken';

export const AppConfigServiceProvider: Provider = {
    provide: APP_CONFIG_SERVICE_TOKEN,
    useClass: AppConfigServiceImpl,
};
