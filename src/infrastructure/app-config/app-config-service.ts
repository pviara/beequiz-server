import { DatabaseConfiguration } from './configuration/database-configuration';
import { OpenAIConfiguration } from './configuration/openai-configuration';

export interface AppConfigService {
    getDatabaseConfig(): DatabaseConfiguration;
    getOpenAIConfig(): OpenAIConfiguration;
}
