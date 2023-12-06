import { AppConfigService } from './app-config-service';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import {
    OPENAI_API_KEY,
    OpenAIConfiguration,
} from './configuration/openai-configuration';
import {
    DATABASE_URI,
    DatabaseConfiguration,
} from './configuration/database-configuration';
import {
    AuthenticationConfiguration,
    JWT_SECRET,
} from './configuration/authentication-configuration';

@Injectable()
export class AppConfigServiceImpl implements AppConfigService {
    constructor(private configService: ConfigService) {}

    getAuthConfig(): AuthenticationConfiguration {
        const jwtSecret = this.configService.get(JWT_SECRET);
        if (!jwtSecret) {
            this.throwVarNotFoundErrorFor(JWT_SECRET);
        }

        return {
            JWT_SECRET: jwtSecret,
        };
    }

    getDatabaseConfig(): DatabaseConfiguration {
        const databaseURI = this.configService.get<string>(DATABASE_URI);
        if (!databaseURI) {
            this.throwVarNotFoundErrorFor(DATABASE_URI);
        }

        return {
            DATABASE_URI: databaseURI as string,
            TEST_DATABASE_URI: (databaseURI as string).replace(
                'beequiz?',
                'test_beequiz?',
            ),
        };
    }

    getOpenAIConfig(): OpenAIConfiguration {
        const openAIAPIKey = this.configService.get(OPENAI_API_KEY);
        if (!openAIAPIKey) {
            this.throwVarNotFoundErrorFor(OPENAI_API_KEY);
        }

        return {
            OPENAI_API_KEY: openAIAPIKey,
        };
    }

    private throwVarNotFoundErrorFor(key: string): void {
        throw new Error(`Variable not found for key "${key}".`);
    }
}
