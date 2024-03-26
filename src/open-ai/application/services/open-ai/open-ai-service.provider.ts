import { AppConfigService } from '../../../../infrastructure/app-config/app-config-service';
import { FakeOpenAIServiceImpl } from './fake-open-ai-service.impl';
import { Logger, Provider } from '@nestjs/common';
import { OpenAIObjectFactory } from '../../open-ai-object-factory/open-ai-object-factory';
import { OpenAIServiceImpl } from './open-ai-service.impl';
import { PromptService } from '../prompt/prompt-service';
import { QuizParser } from '../../../../quiz/application/quiz-parser/quiz-parser';
import { QUIZ_PARSER_TOKEN } from '../../../../quiz/application/quiz-parser/quiz-parser.provider';
import { OpenAIService } from './open-ai-service';

export const OpenAIServiceProvider: Provider = {
    provide: OpenAIService,
    inject: [
        AppConfigService,
        OpenAIObjectFactory,
        PromptService,
        QUIZ_PARSER_TOKEN,
    ],
    useFactory: (
        appConfigService: AppConfigService,
        objectFactory: OpenAIObjectFactory,
        promptService: PromptService,
        quizParser: QuizParser,
    ) => {
        const logger = new Logger('OpenAIServiceProvider');

        if (appConfigService.isAppInDevMode()) {
            logger.log('Used fake OpenAIService implementation for dev mode');
            return new FakeOpenAIServiceImpl();
        }

        logger.log('Used standard OpenAIService implementation for production');
        return new OpenAIServiceImpl(objectFactory, promptService, quizParser);
    },
};
