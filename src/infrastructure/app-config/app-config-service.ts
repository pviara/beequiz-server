import { ApplicationConfiguration } from './configuration/application-configuration';
import { AuthenticationConfiguration } from './configuration/authentication-configuration';
import { DatabaseConfiguration } from './configuration/database-configuration';
import { OpenAIConfiguration } from './configuration/openai-configuration';

export interface AppConfigService {
    getAppConfig(): ApplicationConfiguration;
    getAuthConfig(): AuthenticationConfiguration;
    getDatabaseConfig(): DatabaseConfiguration;
    getOpenAIConfig(): OpenAIConfiguration;
}
