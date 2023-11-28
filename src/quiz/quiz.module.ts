import { AppConfigModule } from '../infrastructure/app-config.module';
import { DateTimeServiceProvider } from '../application/date-time-service.provider';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OpenAIObjectFactoryProvider } from './application/model/open-ai-object-factory/open-ai-object-factory.provider';
import { OpenAIServiceProvider } from './application/services/open-ai/open-ai-service.provider';
import { PromptServiceProvider } from './application/services/prompt/prompt-service.provider';
import { QuizController } from './presentation/quiz-controller';
import { QuizParserProvider } from './application/model/quiz-parser/quiz-parser.provider';
import { QuizQuestionRepoProvider } from './persistence/quiz-question/repository/quiz-question-repository.provider';
import { QuizThemeRepoProvider } from './persistence/quiz-theme/repository/quiz-theme-repository.provider';
import { QuizServiceProvider } from './application/services/quiz/quiz-service.provider';
import {
    QUIZ_THEME_MODEL,
    quizThemeSchema,
} from './persistence/quiz-theme/entity/quiz-theme-entity';
import {
    QUIZ_QUESTION_MODEL,
    quizQuestionSchema,
} from './persistence/quiz-question/entity/quiz-question-entity';

@Module({
    controllers: [QuizController],
    imports: [
        AppConfigModule,
        MongooseModule.forFeature([
            { name: QUIZ_QUESTION_MODEL, schema: quizQuestionSchema },
        ]), // => QuizRepositoryModule
        MongooseModule.forFeature([
            { name: QUIZ_THEME_MODEL, schema: quizThemeSchema },
        ]), // => QuizRepositoryModule
    ],
    providers: [
        DateTimeServiceProvider, // ------- ] => SharedModule
        OpenAIObjectFactoryProvider, // --- ] => OpenAIModule
        OpenAIServiceProvider, // --------- ] => OpenAIModule
        PromptServiceProvider, // --------- ] => OpenAIModule
        QuizParserProvider, // ------------ ] => stays here
        QuizServiceProvider, // ----------- ] => stays here
        QuizQuestionRepoProvider, // ------ ] => QuizRepositoryModule
        QuizThemeRepoProvider, // --------- ] => QuizRepositoryModule
    ],
})
export class QuizModule {}
