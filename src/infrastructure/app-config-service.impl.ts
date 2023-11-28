import { AppConfigService } from './app-config-service';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { OPENAI_API_KEY, OpenAIConfiguration } from './openai-configuration';

@Injectable()
export class AppConfigServiceImpl implements AppConfigService {
    constructor(private configService: ConfigService) {}

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
