import { Provider } from '@nestjs/common';
import { MongoDbQuizQuestionRepo } from './mongodb-quiz-question-repo';

export const QUIZ_QUESTION_REPO_TOKEN = 'MongoDbQuizQuestionRepo';

export const QuizQuestionRepoProvider: Provider = {
    provide: QUIZ_QUESTION_REPO_TOKEN,
    useClass: MongoDbQuizQuestionRepo,
};
