import { MongoDbQuizQuestionRepo } from './mongodb-quiz-question-repo';
import { Provider } from '@nestjs/common';
import { QuizQuestionRepository } from './quiz-question-repository';

export const QuizQuestionRepoProvider: Provider = {
    provide: QuizQuestionRepository,
    useClass: MongoDbQuizQuestionRepo,
};
