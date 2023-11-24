import { QuizParameters } from '../../domain/quiz-parameters';

export interface QuizService {
    getQuizParameters(): Promise<QuizParameters>;
}
