import { AppConfigService } from '../../../../infrastructure/app-config/app-config-service';
import { APP_CONFIG_SERVICE_TOKEN } from '../../../../infrastructure/app-config/app-config-service.provider';
import { OpenAIObjectFactory } from '../../open-ai-object-factory/open-ai-object-factory';
import { OpenAIServiceImpl } from './open-ai-service.impl';
import { OPENAI_OBJECT_FACTORY_TOKEN } from '../../open-ai-object-factory/open-ai-object-factory.provider';
import { PromptService } from '../prompt/prompt-service';
import { Provider } from '@nestjs/common';
import { PROMPT_SERVICE_TOKEN } from '../prompt/prompt-service.provider';
import { QuizParser } from '../../../../quiz/application/quiz-parser/quiz-parser';
import { QUIZ_PARSER_TOKEN } from '../../../../quiz/application/quiz-parser/quiz-parser.provider';

export const OPENAI_SERVICE_TOKEN = 'OpenAIService';

export const OpenAIServiceProvider: Provider = {
    provide: OPENAI_SERVICE_TOKEN,
    inject: [
        APP_CONFIG_SERVICE_TOKEN,
        OPENAI_OBJECT_FACTORY_TOKEN,
        PROMPT_SERVICE_TOKEN,
        QUIZ_PARSER_TOKEN,
    ],
    useFactory: (
        appConfigService: AppConfigService,
        objectFactory: OpenAIObjectFactory,
        promptService: PromptService,
        quizParser: QuizParser,
    ) => {
        if (appConfigService.isAppInDevMode()) {
            // todo: return new FakeOpenAIServiceImpl(); 
        }
        return new OpenAIServiceImpl(objectFactory, promptService, quizParser);
    },
};
