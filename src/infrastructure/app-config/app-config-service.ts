import { ApplicationConfiguration } from './configuration/application-configuration';
import { AuthenticationConfiguration } from './configuration/authentication-configuration';
import { DatabaseConfiguration } from './configuration/database-configuration';
import { OpenAIConfiguration } from './configuration/openai-configuration';

export abstract class AppConfigService {
    abstract getAppConfig(): ApplicationConfiguration;
    abstract getAuthConfig(): AuthenticationConfiguration;
    abstract getDatabaseConfig(): DatabaseConfiguration;
    abstract getOpenAIConfig(): OpenAIConfiguration;
    abstract isAppInDevMode(): boolean;
    abstract isAppInProductionMode(): boolean;
}
