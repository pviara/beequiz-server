import { MongoDbQuizThemeRepo } from './mongodb-quiz-theme-repo';
import { Provider } from '@nestjs/common';
import { QuizThemeRepository } from './quiz-theme-repository';

export const QuizThemeRepoProvider: Provider = {
    provide: QuizThemeRepository,
    useClass: MongoDbQuizThemeRepo,
};
