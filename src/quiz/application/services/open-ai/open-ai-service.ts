import { QuizQuestion } from '../../../domain/quiz-question';
import { QuizTheme } from '../../../domain/quiz-parameters';

export interface OpenAIService {
    generateQuestionsForQuiz(
        savedQuizQuestions: QuizQuestion[],
        numberOfQuestions: number,
    ): Promise<QuizQuestion[]>;
    generateThemesForQuiz(savedQuizThemes: QuizTheme[]): Promise<QuizTheme[]>;
}
