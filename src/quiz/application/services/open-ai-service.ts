import { QuizTheme } from '../../domain/quiz-parameters';

export interface OpenAIService {
    generateThemesForQuiz(savedQuizThemes: QuizTheme[]): Promise<QuizTheme[]>;
}
