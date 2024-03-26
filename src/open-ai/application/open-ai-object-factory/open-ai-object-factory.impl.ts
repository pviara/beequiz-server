import { AppConfigService } from '../../../infrastructure/app-config/app-config-service';
import OpenAI from 'openai';
import { OpenAIObjectFactory } from './open-ai-object-factory';
import { OPENAI_API_KEY } from '../../../infrastructure/app-config/configuration/openai-configuration';

export class OpenAIObjectFactoryImpl implements OpenAIObjectFactory {
    constructor(private appConfigService: AppConfigService) {}

    createOpenAIObject(): OpenAI {
        return new OpenAI({
            apiKey: this.appConfigService.getOpenAIConfig()[OPENAI_API_KEY],
        });
    }
}
