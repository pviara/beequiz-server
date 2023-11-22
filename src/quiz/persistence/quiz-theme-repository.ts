import { QuizTheme } from '../domain/quiz-parameters';

export interface QuizThemeRepository {
    getQuizThemes(): QuizTheme[];
    saveGeneratedThemes(quizThemes: QuizTheme[]): void;
}
