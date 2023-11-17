import { QuizParameters } from '../domain/quiz-parameters';

export interface QuizParametersRepository {
    getQuizParameters(): QuizParameters;
}
