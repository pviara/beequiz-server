import { QuizQuestion } from 'src/quiz/domain/quiz-question';
import { QuizParameters } from '../../domain/quiz-parameters';

export interface QuizService {
    getQuizParameters(): Promise<QuizParameters>;
    getQuizQuestions(
        quizThemeId: string,
        numberOfQuestions: number,
    ): Promise<QuizQuestion[]>;
}
