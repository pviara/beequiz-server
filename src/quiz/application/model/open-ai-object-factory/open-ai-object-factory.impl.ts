import { AppConfigService } from '../../../../infrastructure/app-config-service';
import { APP_CONFIG_SERVICE_TOKEN } from '../../../../infrastructure/app-config-service.provider';
import { Inject } from '@nestjs/common';
import OpenAI from 'openai';
import { OpenAIObjectFactory } from './open-ai-object-factory';
import { OPENAI_API_KEY } from '../../../../infrastructure/openai-configuration';

export class OpenAIObjectFactoryImpl implements OpenAIObjectFactory {
    constructor(
        @Inject(APP_CONFIG_SERVICE_TOKEN)
        private appConfigService: AppConfigService,
    ) {}

    createOpenAIObject(): OpenAI {
        return new OpenAI({
            apiKey: this.appConfigService.getOpenAIConfig()[OPENAI_API_KEY],
        });
    }
}
