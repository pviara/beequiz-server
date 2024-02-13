import { MongoDbQuizQuestionRepo } from './mongodb-quiz-question-repo';
import { Provider } from '@nestjs/common';

export const QUIZ_QUESTION_REPO_TOKEN = 'MongoDbQuizQuestionRepo';

export const QuizQuestionRepoProvider: Provider = {
    provide: QUIZ_QUESTION_REPO_TOKEN,
    useClass: MongoDbQuizQuestionRepo,
};
