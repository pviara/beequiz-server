import { AppConfigService } from './app-config-service';
import { AppConfigServiceImpl } from './app-config-service.impl';
import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';

export const AppConfigServiceProvider: Provider = {
    inject: [ConfigService],
    provide: AppConfigService,
    useFactory: (configService: ConfigService) => {
        return new AppConfigServiceImpl(configService);
    },
};
