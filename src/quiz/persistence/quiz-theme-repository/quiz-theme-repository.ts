import { QuizTheme } from '../../domain/quiz-parameters';
import { QuizQuestion } from '../../domain/quiz-question';

export interface QuizThemeRepository {
    getQuizThemes(): QuizTheme[];
    saveGeneratedThemes(quizThemes: QuizTheme[]): void;
}
