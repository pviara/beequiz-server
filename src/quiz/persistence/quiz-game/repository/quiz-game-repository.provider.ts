import { MongoDbQuizGameRepo } from './mongodb-quiz-game-repo';
import { Provider } from '@nestjs/common';

export const QUIZ_GAME_REPO_TOKEN = 'MongoDbQuizGameRepo';

export const QuizGameRepoProvider: Provider = {
    provide: QUIZ_GAME_REPO_TOKEN,
    useClass: MongoDbQuizGameRepo,
};
