import { DateTimeServiceProvider } from '../application/date-time-service.provider';
import { Module } from '@nestjs/common';
import { OpenAIObjectFactoryProvider } from './application/model/open-ai-object-factory/open-ai-object-factory.provider';
import { OpenAIServiceProvider } from './application/services/open-ai/open-ai-service.provider';
import { PromptServiceProvider } from './application/services/prompt/prompt-service.provider';
import { QuizController } from './presentation/quiz-controller';
import { QuizParserProvider } from './application/model/quiz-parser/quiz-parser.provider';
import { QuizQuestionRepoProvider } from './persistence/quiz-question-repository/quiz-question-repository.provider';
import { QuizThemeRepoProvider } from './persistence/quiz-theme-repository/quiz-theme-repository.provider';
import { QuizServiceProvider } from './application/services/quiz/quiz-service.provider';

@Module({
    controllers: [QuizController],
    providers: [
        DateTimeServiceProvider,
        OpenAIObjectFactoryProvider,
        OpenAIServiceProvider,
        PromptServiceProvider,
        QuizParserProvider,
        QuizQuestionRepoProvider,
        QuizServiceProvider,
        QuizThemeRepoProvider,
    ],
})
export class QuizModule {}
