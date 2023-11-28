import { QuizTheme } from '../../../domain/quiz-parameters';
import { QuizQuestion } from '../../../domain/quiz-question';

export interface QuizThemeRepository {
    getQuizThemes(): Promise<QuizTheme[]>;
    saveGeneratedThemes(quizThemes: QuizTheme[]): Promise<QuizTheme[]>;
}
