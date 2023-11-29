import { ParsedQuizTheme } from 'src/quiz/application/quiz-parser/model/parsed-quiz-theme';
import { QuizTheme } from '../../../domain/quiz-parameters';

export interface QuizThemeRepository {
    getQuizThemes(): Promise<QuizTheme[]>;
    saveGeneratedThemes(quizThemes: ParsedQuizTheme[]): Promise<QuizTheme[]>;
}
