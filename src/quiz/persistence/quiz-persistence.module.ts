import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizQuestionRepoProvider } from './quiz-question/repository/quiz-question-repository.provider';
import { QuizThemeRepoProvider } from './quiz-theme/repository/quiz-theme-repository.provider';
import { QuizGameRepoProvider } from './quiz-game/repository/quiz-game-repository.provider';
import {
    quizGameSchema,
    QUIZ_GAME_MODEL,
} from './quiz-game/entity/quiz-game-entity';
import {
    quizQuestionSchema,
    QUIZ_QUESTION_MODEL,
} from './quiz-question/entity/quiz-question-entity';
import {
    quizThemeSchema,
    QUIZ_THEME_MODEL,
} from './quiz-theme/entity/quiz-theme-entity';

@Module({
    exports: [
        MongooseModule,
        QuizGameRepoProvider,
        QuizQuestionRepoProvider,
        QuizThemeRepoProvider,
    ],
    imports: [
        MongooseModule.forFeature([
            { name: QUIZ_GAME_MODEL, schema: quizGameSchema },
            { name: QUIZ_QUESTION_MODEL, schema: quizQuestionSchema },
            { name: QUIZ_THEME_MODEL, schema: quizThemeSchema },
        ]),
    ],
    providers: [
        QuizGameRepoProvider,
        QuizQuestionRepoProvider,
        QuizThemeRepoProvider,
    ],
})
export class QuizPersistenceModule {}
