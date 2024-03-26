import { MongoDbQuizGameRepo } from './mongodb-quiz-game-repo';
import { Provider } from '@nestjs/common';
import { QuizGameRepository } from './quiz-game-repository';

export const QuizGameRepoProvider: Provider = {
    provide: QuizGameRepository,
    useClass: MongoDbQuizGameRepo,
};
