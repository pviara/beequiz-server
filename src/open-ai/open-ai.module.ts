import { AppConfigModule } from '../infrastructure/app-config.module';
import { Module } from '@nestjs/common';
import { OpenAIObjectFactoryProvider } from './application/open-ai-object-factory/open-ai-object-factory.provider';
import { OpenAIServiceProvider } from './application/services/open-ai/open-ai-service.provider';
import { PromptServiceProvider } from './application/services/prompt/prompt-service.provider';

@Module({
    exports: [
        OpenAIObjectFactoryProvider,
        OpenAIServiceProvider,
        PromptServiceProvider,
    ],
    imports: [AppConfigModule],
    providers: [
        OpenAIObjectFactoryProvider,
        OpenAIServiceProvider,
        PromptServiceProvider,
    ],
})
export class OpenAIModule {}
