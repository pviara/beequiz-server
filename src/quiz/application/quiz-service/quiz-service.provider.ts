import { Provider } from '@nestjs/common';
import { QuizServiceImpl } from './quiz-service.impl';

export const QUIZ_SERVICE_TOKEN = 'QuizService';

export const QuizServiceProvider: Provider = {
    provide: QUIZ_SERVICE_TOKEN,
    useClass: QuizServiceImpl,
};
