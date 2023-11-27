import { Module } from '@nestjs/common';
import { QuizController } from './presentation/quiz-controller';
import { QuizQuestionRepoProvider } from './persistence/quiz-question-repository/quiz-question-repository.provider';
import { QuizThemeRepoProvider } from './persistence/quiz-theme-repository/quiz-theme-repository.provider';

@Module({
    controllers: [QuizController],
    providers: [QuizQuestionRepoProvider, QuizThemeRepoProvider],
})
export class QuizModule {}
