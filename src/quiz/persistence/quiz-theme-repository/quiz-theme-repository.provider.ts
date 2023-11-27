import { MongoDbQuizThemeRepo } from './mongodb-quiz-theme-repo';
import { Provider } from '@nestjs/common';

export const QUIZ_THEME_REPO_TOKEN = 'MongoDbQuizThemeRepo';

export const QuizThemeRepoProvider: Provider = {
    provide: QUIZ_THEME_REPO_TOKEN,
    useClass: MongoDbQuizThemeRepo,
};
