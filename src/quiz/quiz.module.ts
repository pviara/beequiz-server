import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OpenAIModule } from '../open-ai/open-ai.module';
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
import { SharedModule } from '../shared/shared.module';

@Module({
    controllers: [QuizController],
    imports: [
        // // AppConfigModule, // => OpenAIModule
        OpenAIModule,
        MongooseModule.forFeature([
            { name: QUIZ_QUESTION_MODEL, schema: quizQuestionSchema },
        ]), // => QuizRepositoryModule
        MongooseModule.forFeature([
            { name: QUIZ_THEME_MODEL, schema: quizThemeSchema },
        ]), // => QuizRepositoryModule
        SharedModule,
    ],
    providers: [
        // // DateTimeServiceProvider, // ------- ] => SharedModule
        // // OpenAIObjectFactoryProvider, // --- ] => OpenAIModule
        // // OpenAIServiceProvider, // --------- ] => OpenAIModule
        // // PromptServiceProvider, // --------- ] => OpenAIModule
        QuizParserProvider, // ------------ ] => stays here
        QuizServiceProvider, // ----------- ] => stays here
        QuizQuestionRepoProvider, // ------ ] => QuizRepositoryModule
        QuizThemeRepoProvider, // --------- ] => QuizRepositoryModule
    ],
})
export class QuizModule {}
