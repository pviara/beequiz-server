import { AppConfigService } from 'src/infrastructure/app-config/app-config-service';
import { OpenAIObjectFactory } from './open-ai-object-factory';
import { OpenAIObjectFactoryImpl } from './open-ai-object-factory.impl';
import { Provider } from '@nestjs/common';

export const OpenAIObjectFactoryProvider: Provider = {
    inject: [AppConfigService],
    provide: OpenAIObjectFactory,
    useFactory: (appConfigService: AppConfigService) => {
        return new OpenAIObjectFactoryImpl(appConfigService);
    },
};
