import { ApiServiceProvider } from './application/services/api/api-service.provider';
import { AppConfigModule } from '../infrastructure/app-config/app-config.module';
import { Module } from '@nestjs/common';
import { OpenAIObjectFactoryProvider } from './application/open-ai-object-factory/open-ai-object-factory.provider';
import { OpenAIServiceProvider } from './application/services/open-ai/open-ai-service.provider';
import { PromptServiceProvider } from './application/services/prompt/prompt-service.provider';
import { QuizParserModule } from '../quiz/application/quiz-parser/quiz-parser.module';

@Module({
    exports: [ApiServiceProvider, OpenAIServiceProvider],
    imports: [AppConfigModule, QuizParserModule],
    providers: [
        ApiServiceProvider,
        OpenAIObjectFactoryProvider,
        OpenAIServiceProvider,
        PromptServiceProvider,
    ],
})
export class OpenAIModule {}
