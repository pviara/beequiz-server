import { QuizQuestion } from '../../../../quiz/domain/quiz-question';
import { QuizTheme } from '../../../../quiz/domain/quiz-parameters';

export interface OpenAIService {
    generateQuestionsForQuiz(
        savedQuizQuestions: QuizQuestion[],
        numberOfQuestions: number,
    ): Promise<QuizQuestion[]>;
    generateThemesForQuiz(savedQuizThemes: QuizTheme[]): Promise<QuizTheme[]>;
}
