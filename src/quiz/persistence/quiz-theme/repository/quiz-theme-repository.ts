import { ParsedQuizTheme } from 'src/quiz/application/quiz-parser/model/parsed-quiz-theme';
import { QuizTheme } from '../../../domain/quiz-parameters';

export abstract class QuizThemeRepository {
    abstract getQuizTheme(themeId: string): Promise<QuizTheme | null>;
    abstract getQuizThemes(): Promise<QuizTheme[]>;
    abstract saveGeneratedThemes(
        quizThemes: ParsedQuizTheme[],
    ): Promise<QuizTheme[]>;
}
