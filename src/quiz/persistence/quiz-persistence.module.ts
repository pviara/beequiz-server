import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizQuestionRepoProvider } from './quiz-question/repository/quiz-question-repository.provider';
import { QuizThemeRepoProvider } from './quiz-theme/repository/quiz-theme-repository.provider';
import {
    QUIZ_QUESTION_MODEL,
    quizQuestionSchema,
} from './quiz-question/entity/quiz-question-entity';
import {
    QUIZ_THEME_MODEL,
    quizThemeSchema,
} from './quiz-theme/entity/quiz-theme-entity';

@Module({
    exports: [MongooseModule, QuizQuestionRepoProvider, QuizThemeRepoProvider],
    imports: [
        MongooseModule.forFeature([
            { name: QUIZ_QUESTION_MODEL, schema: quizQuestionSchema },
        ]),
        MongooseModule.forFeature([
            { name: QUIZ_THEME_MODEL, schema: quizThemeSchema },
        ]),
    ],
    providers: [QuizQuestionRepoProvider, QuizThemeRepoProvider],
})
export class QuizPersistenceModule {}
