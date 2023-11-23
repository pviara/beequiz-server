import { OpenAIConfiguration } from './openai-configuration';

export interface AppConfigService {
    getOpenAIConfig(): OpenAIConfiguration;
}
