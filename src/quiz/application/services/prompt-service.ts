import { QuizTheme } from '../../domain/quiz-parameters';

export interface PromptService {
    getQuizThemesPrompt(savedQuizThemes: QuizTheme[]): string;
}
