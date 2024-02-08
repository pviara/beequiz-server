import {
    ALLOWED_ORIGIN,
    APP_ENVIRONMENT,
    APP_PORT,
    ApplicationConfiguration,
} from './configuration/application-configuration';
import { AppConfigService } from './app-config-service';
import {
    AuthenticationConfiguration,
    JWT_SECRET,
    OAUTH_CLIENT,
    OAUTH_REDIRECT_URL,
    OAUTH_SECRET,
} from './configuration/authentication-configuration';
import { ConfigService } from '@nestjs/config';
import {
    DATABASE_URI,
    DatabaseConfiguration,
    TEST_DATABASE_URI,
} from './configuration/database-configuration';
import { Injectable } from '@nestjs/common';
import {
    OPENAI_API_KEY,
    OpenAIConfiguration,
} from './configuration/openai-configuration';

@Injectable()
export class AppConfigServiceImpl implements AppConfigService {
    constructor(private configService: ConfigService) {}

    getAppConfig(): ApplicationConfiguration {
        return this.getConfiguration(ALLOWED_ORIGIN, APP_ENVIRONMENT, APP_PORT);
    }

    getAuthConfig(): AuthenticationConfiguration {
        return this.getConfiguration(
            JWT_SECRET,
            OAUTH_CLIENT,
            OAUTH_REDIRECT_URL,
            OAUTH_SECRET,
        );
    }

    getDatabaseConfig(): DatabaseConfiguration {
        return this.getConfiguration(DATABASE_URI, TEST_DATABASE_URI);
    }

    getOpenAIConfig(): OpenAIConfiguration {
        return this.getConfiguration(OPENAI_API_KEY);
    }

    private getConfiguration<T>(...keys: string[]): T {
        const configurationEntries = this.createEntriesFor(keys);
        return Object.fromEntries(configurationEntries) as T;
    }

    private createEntriesFor(keys: string[]): [string, string][] {
        return keys.map((key) => {
            const value = this.getEnvironmentVariable(key);
            return [key, value];
        });
    }

    private getEnvironmentVariable(key: string): string {
        const value = this.configService.get<string>(key);
        if (!value) {
            throw new Error(`Variable not found for key "${key}".`);
        }

        return value;
    }
}
